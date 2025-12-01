import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, BookOpen } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="header-content">
        <div className="header-logo">
          <BookOpen size={32} className="logo-icon" />
          <h1 className="logo-text">
            <span className="logo-gradient">Biblioteca</span> Digital
          </h1>
        </div>

        <div className="header-actions">
          <div className="user-info">
            <User size={20} />
            <div className="user-details">
              <span className="user-name">{user?.nombreCompleto}</span>
              <span className="user-role">{user?.rol}</span>
            </div>
          </div>

          <motion.button
            className="logout-btn"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
