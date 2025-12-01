import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './pages/LoginPage';
import { BooksPage } from './pages/BooksPage';
import { UsersPage } from './pages/UsersPage';
import './App.css';

function App() {
  
  return (
    <Provider store={store}>
      <div className="app-container">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          
          <Route path="/" element={<Navigate to="/books" replace />} />

          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <Layout>
                  <BooksPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute requiredRoles={['admin', 'bibliotecario']}>
                <Layout>
                  <UsersPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </BrowserRouter>
      </div>
    </Provider>
  );
}

export default App;
