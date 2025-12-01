import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, TrendingUp, Activity } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchBooks } from '../store/slices/bookSlice';
import { fetchUsers } from '../store/slices/userSlice';
import { Card } from '../components/common';

export const DashboardPage: React.FC = () => {
  const { books } = useAppSelector((state) => state.books);
  const { users } = useAppSelector((state) => state.users);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBooks());
    if (user?.rol === 'admin' || user?.rol === 'bibliotecario') {
      dispatch(fetchUsers());
    }
  }, [dispatch, user]);

  const stats = [
    {
      title: 'Total de Libros',
      value: books.length,
      icon: BookOpen,
      color: 'var(--space-purple)',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      title: 'Libros Disponibles',
      value: books.filter((b) => b.id).length,
      icon: TrendingUp,
      color: 'var(--accent-success)',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
    ...(user?.rol === 'admin' || user?.rol === 'bibliotecario'
      ? [
          {
            title: 'Total de Usuarios',
            value: users.length,
            icon: Users,
            color: 'var(--space-cyan)',
            bgColor: 'rgba(6, 182, 212, 0.1)',
          },
        ]
      : []),
    {
      title: 'Actividad Reciente',
      value: '24h',
      icon: Activity,
      color: 'var(--space-pink)',
      bgColor: 'rgba(236, 72, 153, 0.1)',
    },
  ];

  return (
    <div className="dashboard-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>
          Dashboard
        </h1>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-xl)',
            marginBottom: 'var(--spacing-2xl)',
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover glow>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-lg)',
                      background: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                    }}
                  >
                    <stat.icon size={28} />
                  </div>
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: 'var(--text-secondary)',
                        fontSize: '0.875rem',
                      }}
                    >
                      {stat.title}
                    </p>
                    <h2
                      style={{
                        margin: '0.25rem 0 0 0',
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: stat.color,
                      }}
                    >
                      {stat.value}
                    </h2>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: 'var(--spacing-lg)' }}>
            Bienvenido, {user?.nombreCompleto}
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Este es tu panel de control de la Biblioteca Digital. Desde aquí puedes gestionar
            libros, usuarios y explorar el catálogo completo de la biblioteca.
          </p>
        </Card>
      </motion.div>
    </div>
  );
};
