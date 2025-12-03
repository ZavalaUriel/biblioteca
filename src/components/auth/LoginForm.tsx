import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { login } from '../../store/slices/authSlice';
import { Button, Input, Card } from '../common';
import './LoginForm.css';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ username, password }));
    if (login.fulfilled.match(result)) {
      navigate('/books');
    }
  };

  return (
    <div className="login-container">
      <div className="stars-background" />
      <motion.div
        className="login-wrapper"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="login-card" glow>
          <div className="login-header">
            <motion.div
              className="login-logo-utl"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              UTL
            </motion.div>
            <div className="login-title-group">
              <h1 className="login-title">
                <span className="title-gradient">Biblioteca Digital</span>
              </h1>
              <p className="login-subtitle">Universidad Tecnológica de León</p>
              <div className="login-divider"></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <motion.div
                className="login-error"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <AlertCircle size={20} />
                <span>{error}</span>
              </motion.div>
            )}

            <Input
              label="Usuario"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingresa tu usuario"
              icon={<User size={20} />}
              required
            />

            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              icon={<Lock size={20} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={loading}
              className="login-button"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="login-footer">
            <p className="login-info">
              Acceso al sistema de gestión bibliotecaria
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
