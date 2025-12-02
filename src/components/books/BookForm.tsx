import React, { useState } from 'react';
import { Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { Button, Input } from '../common';
import { GeneroLibro } from '../../types';
import type { LibroDTO } from '../../types';
import * as pdfjsLib from 'pdfjs-dist';
import './BookForm.css';

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

interface BookFormProps {
  onSubmit: (book: LibroDTO) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<LibroDTO>;
}

export const BookForm: React.FC<BookFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    titulo: initialData?.titulo || '',
    autor: initialData?.autor || '',
    genero: (initialData?.genero as any) || GeneroLibro.FICCION,
  });
  const [portadaFile, setPortadaFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [portadaPreview, setPortadaPreview] = useState<string>('');
  const [portadaBase64, setPortadaBase64] = useState<string>('');
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Función helper para convertir File a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Extraer solo el base64 sin el prefijo data:image/jpeg;base64,
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Función para extraer la primera página del PDF como imagen File
  const extractFirstPageAsFile = async (pdfFile: File): Promise<File> => {
    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      
      const scale = 2;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;
      
      // Convertir canvas a Blob y luego a File
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'portada.jpg', { type: 'image/jpeg' });
            resolve(file);
          } else {
            reject(new Error('Error al crear blob de la portada'));
          }
        }, 'image/jpeg', 0.8);
      });
    } catch (error) {
      console.error('Error al extraer portada del PDF:', error);
      throw error;
    }
  };

  const handlePortadaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('🖼️ handlePortadaChange - file:', file);
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, portada: 'Solo se permiten archivos de imagen' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, portada: 'La imagen es demasiado grande (máximo 5MB)' });
        return;
      }
      
      console.log('✅ Portada válida:', file.name, file.size, 'bytes');
      setPortadaFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPortadaPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setErrors({ ...errors, portada: '' });
    }
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('📄 handlePdfChange - file:', file);
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors({ ...errors, pdf: 'Solo se permiten archivos PDF' });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors({ ...errors, pdf: 'El PDF es demasiado grande (máximo 10MB)' });
        return;
      }
      
      try {
        setLoading(true);
        console.log('✅ PDF válido:', file.name, file.size, 'bytes');
        console.log('🔄 Extrayendo portada del PDF...');
        
        // Extraer la primera página como portada
        const portadaFile = await extractFirstPageAsFile(file);
        console.log('✅ Portada extraída:', portadaFile.name, portadaFile.size, 'bytes');
        
        // Convertir ambos archivos a base64
        const pdfB64 = await fileToBase64(file);
        const portadaB64 = await fileToBase64(portadaFile);
        
        console.log('✅ Archivos convertidos a base64');
        console.log('  - PDF base64 length:', pdfB64.length);
        console.log('  - Portada base64 length:', portadaB64.length);
        
        setPdfFile(file);
        setPortadaFile(portadaFile);
        setPdfBase64(pdfB64);
        setPortadaBase64(portadaB64);
        
        // Crear preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPortadaPreview(e.target?.result as string);
        };
        reader.readAsDataURL(portadaFile);
        
        setErrors({ ...errors, pdf: '', portada: '' });
      } catch (error) {
        console.error('Error al procesar el PDF:', error);
        setErrors({ ...errors, pdf: 'Error al extraer la portada del PDF' });
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
    if (formData.autor && !formData.autor.trim()) {
      newErrors.autor = 'El autor no puede estar vacío';
    }
    if (!pdfBase64) {
      newErrors.pdf = 'El archivo PDF es requerido';
    }
    // La portada se genera automáticamente del PDF

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      console.log('❌ Validación falló');
      return;
    }

    console.log('✅ Validación pasó');
    console.log('📋 formData:', formData);
    console.log('📝 portadaBase64 length:', portadaBase64.length);
    console.log('📝 pdfBase64 length:', pdfBase64.length);

    setLoading(true);
    try {
      const submitData: LibroDTO = {
        titulo: formData.titulo,
        autor: formData.autor,
        genero: formData.genero,
        portada: portadaBase64,
        archivo_pdf: pdfBase64,
      };
      console.log('🚀 Enviando submitData:', {
        ...submitData,
        portada: `[base64 ${submitData.portada.length} chars]`,
        archivo_pdf: `[base64 ${submitData.archivo_pdf.length} chars]`
      });
      await onSubmit(submitData);
    } catch (error: any) {
      console.error('Error al guardar el libro:', error);
      setErrors({ 
        ...errors, 
        pdf: error.response?.data?.message || 'Error al guardar el libro' 
      });
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
          value={formData.autor || ''}
          onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
          error={errors.autor}
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
              {loading ? 'Procesando...' : (pdfFile ? 'Cambiar PDF' : 'Seleccionar PDF')}
            </div>
          </label>
          {pdfFile && (
            <div className="file-info">
              <FileText size={16} />
              <span>{pdfFile.name}</span>
            </div>
          )}
          {errors.pdf && <p className="input-error-message">{errors.pdf}</p>}
        </div>

        {portadaPreview && (
          <div className="file-upload-group">
            <label className="file-upload-label">
              <ImageIcon size={20} />
              Vista previa de portada (generada automáticamente)
            </label>
            <div className="file-preview">
              <img
                src={portadaPreview}
                alt="Portada generada del PDF"
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
