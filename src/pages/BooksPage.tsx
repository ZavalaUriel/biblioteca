import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBooks, createBook, updateBook, deleteBook } from '../store/slices/bookSlice';
import { BookGrid } from '../components/books/BookGrid';
import { BookForm } from '../components/books/BookForm';
import { Modal, Button, Input, Card } from '../components/common';
import { GeneroLibro } from '../types';
import type { Libro, LibroDTO } from '../types';

export const BooksPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Libro | null>(null);
  const [bookToEdit, setBookToEdit] = useState<Libro | null>(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const isInitialMount = useRef(true);
  
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector((state) => state.books);
  const { user } = useAppSelector((state) => state.auth);

  // Cargar libros solo una vez al montar
  useEffect(() => {
    dispatch(fetchBooks(undefined));
  }, [dispatch]);

  // Debounce para búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Buscar solo cuando el usuario escribe (no en mount)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (debouncedSearchQuery) {
      dispatch(fetchBooks(debouncedSearchQuery));
    } else {
      dispatch(fetchBooks(undefined));
    }
  }, [debouncedSearchQuery, dispatch]);

  const filteredBooks = books.filter((book) => {
    const matchesGenre = !selectedGenre || book.genero === selectedGenre;
    return matchesGenre;
  });

  const canManageBooks = user?.rol === 'admin' || user?.rol === 'bibliotecario';

  const handleBookClick = (book: Libro) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCreateBook = async (bookData: LibroDTO) => {
    try {
      if (bookToEdit) {
        const bookId = bookToEdit.id || bookToEdit._id;
        if (!bookId) {
          alert('Error: El libro no tiene un ID válido');
          return;
        }
        await dispatch(updateBook({ id: bookId as any, book: bookData })).unwrap();
        setBookToEdit(null);
      } else {
        await dispatch(createBook(bookData)).unwrap();
      }
      setIsFormModalOpen(false);
      // Recargar la lista después de crear/actualizar
      dispatch(fetchBooks(debouncedSearchQuery || undefined));
    } catch (error) {
      console.error('Error al guardar el libro:', error);
      alert('Error al guardar el libro. Por favor, intenta de nuevo.');
    }
  };

  const handleEditBook = (book: Libro) => {
    // Prevenir edición de libros externos
    if (book.fuente === 'externo') {
      alert('No se pueden editar libros externos. Este libro pertenece a otra universidad.');
      return;
    }
    setBookToEdit(book);
    setIsModalOpen(false);
    setIsFormModalOpen(true);
  };

  const handleDeleteBook = async () => {
    if (selectedBook) {
      // Prevenir eliminación de libros externos
      if (selectedBook.fuente === 'externo') {
        alert('No se pueden eliminar libros externos. Este libro pertenece a otra universidad.');
        setIsDeleteModalOpen(false);
        return;
      }
      
      try {
        const bookId = selectedBook.id || selectedBook._id;
        console.log('Intentando eliminar libro con ID:', bookId);
        
        if (!bookId) {
          alert('Error: El libro no tiene un ID válido');
          return;
        }
        
        const result = await dispatch(deleteBook(bookId as any)).unwrap();
        console.log('Libro eliminado exitosamente:', result);
        setIsDeleteModalOpen(false);
        setIsModalOpen(false);
        setSelectedBook(null);
        // Recargar la lista después de eliminar
        dispatch(fetchBooks(debouncedSearchQuery || undefined));
      } catch (error) {
        console.error('Error al eliminar el libro:', error);
        alert('Error al eliminar el libro. Por favor, intenta de nuevo.');
      }
    } else {
      console.warn('No hay libro seleccionado para eliminar');
    }
  };

  const handleViewPdf = () => {
    setIsModalOpen(false);
    setIsPdfModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setBookToEdit(null);
    setIsFormModalOpen(true);
  };

  return (
    <div className="books-page">
      <div>
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start', 
            marginBottom: 'var(--spacing-lg)',
            flexWrap: 'wrap',
            gap: 'var(--spacing-md)'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '2.25rem', 
                fontWeight: '700', 
                margin: 0,
                marginBottom: 'var(--spacing-xs)',
                background: 'linear-gradient(135deg, var(--utl-green), var(--utl-green-accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Catálogo de Libros
              </h1>
              <p style={{ 
                color: 'var(--text-secondary)', 
                margin: 0,
                fontSize: '0.95rem'
              }}>
                Explora y gestiona la colección de libros
              </p>
            </div>
            {canManageBooks && (
              <Button
                variant="primary"
                icon={<Plus size={20} />}
                onClick={handleOpenAddModal}
                size="lg"
              >
                Agregar Libro
              </Button>
            )}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1fr', 
            gap: 'var(--spacing-md)',
            alignItems: 'start'
          }}>
            <div style={{ 
              position: 'relative',
              background: 'white',
              borderRadius: 'var(--radius-xl)',
              border: '2px solid var(--utl-green-light)',
              boxShadow: '0 4px 12px rgba(0, 168, 89, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--utl-green)',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Search size={22} />
              </div>
              <input
                type="text"
                placeholder="Buscar por título, autor o género..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
            </div>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1rem',
                background: 'white',
                border: '2px solid var(--border-color)',
                borderRadius: 'var(--radius-xl)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                transition: 'all var(--transition-normal)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
              }}
            >
              <option value="">📚 Todos los géneros</option>
              {Object.values(GeneroLibro).map((genero) => (
                <option key={genero} value={genero}>
                  {genero}
                </option>
              ))}
            </select>
          </div>
        </div>

        <BookGrid
          books={filteredBooks}
          loading={loading}
          onBookClick={handleBookClick}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedBook?.titulo}
          size="lg"
        >
          {selectedBook && (
            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 'var(--spacing-xl)' }}>
              <div>
                {selectedBook.portada ? (
                  <img
                    src={
                      selectedBook.portada.startsWith('/uploads') 
                        ? `${import.meta.env.VITE_API_URL}${selectedBook.portada}`
                        : selectedBook.portada.startsWith('data:') || selectedBook.portada.startsWith('http')
                        ? selectedBook.portada 
                        : `data:image/jpeg;base64,${selectedBook.portada}`
                    }
                    alt={selectedBook.titulo}
                    style={{ width: '100%', borderRadius: 'var(--radius-lg)' }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '400px',
                      background: 'var(--bg-secondary)',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    Sin portada
                  </div>
                )}
              </div>
              <div>
                {selectedBook.autor && (
                  <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>
                      Autor
                    </p>
                    <p style={{ color: 'var(--text-primary)', fontSize: '1.125rem', margin: 0 }}>
                      {selectedBook.autor}
                    </p>
                  </div>
                )}
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>
                    Género
                  </p>
                  <p style={{ color: 'var(--text-primary)', margin: 0 }}>
                    {selectedBook.genero}
                  </p>
                </div>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', margin: '0 0 0.25rem 0' }}>
                    Universidad
                  </p>
                  <p style={{ color: 'var(--text-primary)', margin: 0 }}>
                    {selectedBook.universidad}
                  </p>
                </div>
                
                <Button 
                  variant="primary" 
                  style={{ width: '100%' }} 
                  onClick={handleViewPdf}
                  disabled={!selectedBook.pdf}
                >
                  {selectedBook.pdf ? 'Ver PDF' : 'PDF no disponible'}
                </Button>
                
                {canManageBooks && selectedBook.fuente !== 'externo' && !(selectedBook as any).esExterno && (
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                    <Button
                      variant="secondary"
                      icon={<Edit size={18} />}
                      style={{ flex: 1 }}
                      onClick={() => handleEditBook(selectedBook)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      icon={<Trash2 size={18} />}
                      style={{ flex: 1 }}
                      onClick={() => {
                        console.log('Abriendo modal de eliminación para:', selectedBook);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
                {(selectedBook.fuente === 'externo' || (selectedBook as any).esExterno) && (
                  <div style={{ 
                    marginTop: 'var(--spacing-md)', 
                    padding: 'var(--spacing-md)', 
                    background: 'rgba(139, 92, 246, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    textAlign: 'center'
                  }}>
                    📚 Este libro proviene de otra universidad y solo se puede visualizar
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          title={selectedBook?.titulo}
          size="xl"
        >
          {selectedBook?.pdf && (
            <div style={{ width: '100%', height: '90vh' }}>
              <iframe
                src={
                  selectedBook.pdf.startsWith('/uploads') 
                    ? `${import.meta.env.VITE_API_URL}${selectedBook.pdf}`
                    : selectedBook.pdf.startsWith('data:') 
                    ? selectedBook.pdf 
                    : `data:application/pdf;base64,${selectedBook.pdf}`
                }
                style={{ width: '100%', height: '100%', border: 'none', borderRadius: 'var(--radius-md)' }}
                title="PDF Viewer"
              />
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setBookToEdit(null);
          }}
          title={bookToEdit ? 'Editar Libro' : 'Agregar Nuevo Libro'}
          size="lg"
        >
          <BookForm
            onSubmit={handleCreateBook}
            onCancel={() => {
              setIsFormModalOpen(false);
              setBookToEdit(null);
            }}
            initialData={bookToEdit ? {
              titulo: bookToEdit.titulo,
              autor: bookToEdit.autor,
              genero: bookToEdit.genero,
            } : undefined}
          />
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirmar Eliminación"
          size="sm"
        >
          <div style={{ padding: 'var(--spacing-md)' }}>
            <p style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--text-secondary)' }}>
              ¿Estás seguro de que deseas eliminar el libro "{selectedBook?.titulo}"? Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => {
                console.log('Botón eliminar presionado en modal');
                handleDeleteBook();
              }}>
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};
