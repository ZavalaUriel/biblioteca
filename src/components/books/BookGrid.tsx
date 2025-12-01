import React from 'react';
import { motion } from 'framer-motion';
import type { Libro } from '../../types';
import { BookCard } from './BookCard';
import { Spinner } from '../common';

interface BookGridProps {
  books: Libro[];
  loading?: boolean;
  onBookClick?: (book: Libro) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ books, loading, onBookClick }) => {
  if (loading) {
    return <Spinner size="lg" />;
  }

  if (books.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: 'center',
          padding: 'var(--spacing-2xl)',
          color: 'var(--text-secondary)',
        }}
      >
        <p style={{ fontSize: '1.125rem' }}>No se encontraron libros</p>
      </motion.div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: 'var(--spacing-xl)',
      }}
    >
      {books.map((book, index) => (
        <motion.div
          key={book.id || book._id || `book-${index}-${book.titulo}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <BookCard book={book} onClick={() => onBookClick?.(book)} />
        </motion.div>
      ))}
    </div>
  );
};
