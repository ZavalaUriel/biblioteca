import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Users } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import './Sidebar.css';

export const Sidebar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const menuItems = [
    {
      path: '/books',
      icon: BookOpen,
      label: 'Catálogo de Libros',
      roles: ['admin', 'bibliotecario', 'alumno'],
    },
    {
      path: '/users',
      icon: Users,
      label: 'Gestión de Usuarios',
      roles: ['admin', 'bibliotecario'],
    },
  ];

  const filteredItems = menuItems.filter((item) =>
    user ? item.roles.includes(user.rol) : false
  );

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <div className="sidebar-link-content">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
