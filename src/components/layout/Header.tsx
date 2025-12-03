import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, BookOpen, Users, Home } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useNavigate, NavLink } from 'react-router-dom';
import './Header.css';

export const Header: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    {
      path: '/books',
      icon: BookOpen,
      label: 'Catálogo',
      roles: ['admin', 'bibliotecario', 'alumno'],
    },
    {
      path: '/users',
      icon: Users,
      label: 'Usuarios',
      roles: ['admin', 'bibliotecario'],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    user ? item.roles.includes(user.rol) : false
  );

  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="header-content">
        <div className="header-left">
          <div className="header-logo">
            <BookOpen size={28} className="logo-icon" />
            <h1 className="logo-text">
              <span className="logo-gradient">Biblioteca</span> UTL
            </h1>
          </div>
          
          <nav className="header-nav">
            {filteredItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `header-nav-link ${isActive ? 'header-nav-link-active' : ''}`
                }
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="header-actions">
          <div className="user-badge">
            <div className="user-avatar">
              {user?.nombreCompleto.charAt(0).toUpperCase()}
            </div>
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
            <LogOut size={18} />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
