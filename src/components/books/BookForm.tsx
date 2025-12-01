import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { Button, Input } from '../common';
import { GeneroLibro } from '../../types';
import type { LibroDTO } from '../../types';
import * as pdfjsLib from 'pdfjs-dist';
import './BookForm.css';

// Configurar el worker de PDF.js usando la versión local
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface BookFormProps {
  onSubmit: (book: LibroDTO) => Promise<void>;
  onCancel: () => void;
  initialData?: LibroDTO;
}

export const BookForm: React.FC<BookFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<LibroDTO>(
    initialData || {
      titulo: '',
      autor: '',
      genero: GeneroLibro.FICCION,
      portada: '',
      archivo_pdf: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFileToBase64 = (file: File, maxWidth = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.type === 'application/pdf') {
        // Para PDFs, simplemente convertir
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64 = reader.result as string;
          const base64Data = base64.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = (error) => reject(error);
      } else {
        // Para imágenes, redimensionar antes de convertir
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;

            // Redimensionar si es muy grande
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);

            // Convertir a JPEG con calidad 0.7 (más compresión)
            const base64 = canvas.toDataURL('image/jpeg', 0.7);
            const base64Data = base64.split(',')[1];
            resolve(base64Data);
          };
          img.onerror = reject;
          img.src = e.target?.result as string;
        };
        reader.onerror = (error) => reject(error);
      }
    });
  };

  const extractFirstPageAsCover = async (pdfBase64: string): Promise<string> => {
    try {
      // Convertir base64 a ArrayBuffer
      const pdfData = atob(pdfBase64);
      const pdfArray = new Uint8Array(pdfData.length);
      for (let i = 0; i < pdfData.length; i++) {
        pdfArray[i] = pdfData.charCodeAt(i);
      }

      // Cargar el PDF
      const loadingTask = pdfjsLib.getDocument({ data: pdfArray });
      const pdf = await loadingTask.promise;
      
      // Obtener la primera página
      const page = await pdf.getPage(1);
      
      // Crear canvas para renderizar
      const scale = 2; // Mayor calidad
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Renderizar la página
      await page.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      }).promise;
      
      // Convertir a base64 (JPEG con calidad 0.8)
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
      return imageBase64.split(',')[1];
    } catch (error) {
      console.error('Error al extraer portada del PDF:', error);
      throw error;
    }
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors({ ...errors, archivo_pdf: 'Solo se permiten archivos PDF' });
        return;
      }
      // Verificar tamaño del PDF (máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, archivo_pdf: 'El PDF es demasiado grande (máximo 2MB)' });
        return;
      }
      try {
        setLoading(true);
        const base64 = await handleFileToBase64(file);
        
        // Extraer automáticamente la primera página como portada
        const coverBase64 = await extractFirstPageAsCover(base64);
        
        setFormData({ 
          ...formData, 
          archivo_pdf: base64,
          portada: coverBase64 // Asignar automáticamente la portada
        });
        setErrors({ ...errors, archivo_pdf: '', portada: '' });
      } catch (error) {
        console.error('Error:', error);
        setErrors({ ...errors, archivo_pdf: 'Error al procesar el PDF' });
      } finally {
        setLoading(false);
      }
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }
    if (!formData.autor.trim()) {
      newErrors.autor = 'El autor es requerido';
    }
    if (!formData.portada) {
      newErrors.portada = 'La portada es requerida';
    }
    if (!formData.archivo_pdf) {
      newErrors.archivo_pdf = 'El archivo PDF es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (error: any) {
      console.error('Error al guardar el libro:', error);
      if (error.message?.includes('too large') || error.response?.status === 413) {
        setErrors({ 
          ...errors, 
          archivo_pdf: 'El archivo es demasiado grande. Usa un PDF más pequeño (máximo 2MB)' 
        });
      } else {
        setErrors({ 
          ...errors, 
          archivo_pdf: error.response?.data?.message || 'Error al guardar el libro' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <div className="book-form-grid">
        <Input
          label="Título"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          error={errors.titulo}
          required
        />

        <Input
          label="Autor"
          value={formData.autor}
          onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
          error={errors.autor}
          required
        />

        <div className="input-group">
          <label className="input-label">
            Género <span style={{ color: 'var(--accent-danger)' }}>*</span>
          </label>
          <select
            value={formData.genero}
            onChange={(e) => setFormData({ ...formData, genero: e.target.value as any })}
            className="book-select"
            required
          >
            {Object.values(GeneroLibro).map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
        </div>

        {/* Universidad se asigna automáticamente desde el backend */}
      </div>

      <div className="book-form-files">
        <div className="file-upload-group">
          <label className="file-upload-label">
            <FileText size={20} />
            Archivo PDF <span style={{ color: 'var(--accent-danger)' }}>*</span>
          </label>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
            La portada se generará automáticamente de la primera página del PDF
          </p>
          <label className="file-upload">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="file-input"
              disabled={loading}
            />
            <div className="file-upload-button">
              <Upload size={20} />
              {loading ? 'Procesando...' : (formData.archivo_pdf ? 'Cambiar PDF' : 'Seleccionar PDF')}
            </div>
          </label>
          {formData.archivo_pdf && (
            <div className="file-info">
              <FileText size={16} />
              <span>PDF cargado correctamente</span>
            </div>
          )}
          {errors.archivo_pdf && <p className="input-error-message">{errors.archivo_pdf}</p>}
        </div>

        {formData.portada && (
          <div className="file-upload-group">
            <label className="file-upload-label">
              <ImageIcon size={20} />
              Vista previa de portada
            </label>
            <div className="file-preview">
              <img
                src={`data:image/jpeg;base64,${formData.portada}`}
                alt="Portada generada automáticamente"
                className="portada-preview"
              />
            </div>
          </div>
        )}
      </div>

      <div className="book-form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
        >
          {initialData ? 'Actualizar' : 'Crear'} Libro
        </Button>
      </div>
    </form>
  );
};
