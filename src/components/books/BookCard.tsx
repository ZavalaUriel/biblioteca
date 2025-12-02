import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User as UserIcon, Globe } from 'lucide-react';
import type { Libro } from '../../types';
import { Card } from '../common';
import './BookCard.css';

interface BookCardProps {
  book: Libro;
  onClick?: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <Card className="book-card" hover glow>
        <div className="book-cover-wrapper">
          {book.portada ? (
            <img
              src={
                book.portada.startsWith('/uploads') 
                  ? `${import.meta.env.VITE_API_URL}${book.portada}`
                  : book.portada.startsWith('data:') || book.portada.startsWith('http')
                  ? book.portada 
                  : `data:image/jpeg;base64,${book.portada}`
              }
              alt={book.titulo}
              className="book-cover"
            />
          ) : (
            <div className="book-cover-placeholder">
              <BookOpen size={48} />
            </div>
          )}
          <div className="book-overlay">
            <span className="book-genre">{book.genero}</span>
            {(book.fuente === 'externo' || (book as any).esExterno) && (
              <span className="book-source-badge">
                <Globe size={12} />
                Externo
              </span>
            )}
          </div>
        </div>
        
        <div className="book-info">
          <h3 className="book-title">{book.titulo}</h3>
          {book.autor && (
            <div className="book-author">
              <UserIcon size={14} />
              <span>{book.autor}</span>
            </div>
          )}
          <p className="book-university">{book.universidad}</p>
        </div>
      </Card>
    </motion.div>
  );
};
