import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Shield, UserPlus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, createUser, updateUser, deleteUser } from '../store/slices/userSlice';
import { Card, Button, Modal, Input } from '../components/common';
import type { UsuarioResponse, UsuarioDTO } from '../types';

export const UsersPage: React.FC = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UsuarioResponse | null>(null);
  const [userToEdit, setUserToEdit] = useState<UsuarioResponse | null>(null);
  
  const [formData, setFormData] = useState<UsuarioDTO>({
    username: '',
    password: '',
    rol: 'alumno',
    nombreCompleto: '',
  });
  
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setUserToEdit(null);
    setFormData({
      username: '',
      password: '',
      rol: 'alumno',
      nombreCompleto: '',
    });
    setIsFormModalOpen(true);
  };

  const handleEditUser = (user: UsuarioResponse) => {
    setUserToEdit(user);
    setFormData({
      username: user.username || user.nombre,
      password: '',
      rol: user.rol,
      nombreCompleto: user.nombreCompleto,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit llamado, userToEdit:', userToEdit);
    console.log('formData:', formData);
    try {
      if (userToEdit) {
        const userId = userToEdit.id || userToEdit._id;
        console.log('Actualizando usuario con ID:', userId);
        if (!userId) {
          alert('Error: El usuario no tiene un ID válido');
          return;
        }
        await dispatch(updateUser({ id: userId as any, user: formData })).unwrap();
      } else {
        console.log('Creando nuevo usuario');
        await dispatch(createUser(formData)).unwrap();
      }
      setIsFormModalOpen(false);
      await dispatch(fetchUsers());
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      alert('Error al guardar el usuario. Por favor, intenta de nuevo.');
    }
  };

  const handleDelete = async () => {
    console.log('handleDelete llamado, selectedUser:', selectedUser);
    if (selectedUser) {
      try {
        const userId = selectedUser.id || selectedUser._id;
        console.log('Eliminando usuario con ID:', userId);
        if (!userId) {
          alert('Error: El usuario no tiene un ID válido');
          return;
        }
        await dispatch(deleteUser(userId as any)).unwrap();
        console.log('Usuario eliminado exitosamente');
        setIsDeleteModalOpen(false);
        await dispatch(fetchUsers());
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        alert('Error al eliminar el usuario. Por favor, intenta de nuevo.');
      }
    } else {
      console.warn('No hay usuario seleccionado');
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'admin':
        return 'var(--accent-danger)';
      case 'bibliotecario':
        return 'var(--space-purple)';
      case 'alumno':
        return 'var(--accent-info)';
      default:
        return 'var(--text-secondary)';
    }
  };

  return (
    <div className="users-page" style={{ padding: 'var(--spacing-xl)' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-2xl)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
            Gestión de Usuarios
          </h1>
          <Button variant="primary" icon={<UserPlus size={20} />} onClick={handleOpenAddModal}>
            Nuevo Usuario
          </Button>
        </div>

        <Card>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    ID
                  </th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Usuario
                  </th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Nombre Completo
                  </th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Rol
                  </th>
                  <th style={{ padding: 'var(--spacing-md)', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.id || user._id || `user-${index}`}
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-primary)' }}>
                      {user.id || user._id}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {user.username || user.nombre}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)', color: 'var(--text-secondary)' }}>
                      {user.nombreCompleto}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--spacing-xs)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: 'var(--radius-full)',
                          background: `${getRoleBadgeColor(user.rol)}20`,
                          color: getRoleBadgeColor(user.rol),
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textTransform: 'capitalize',
                        }}
                      >
                        <Shield size={12} />
                        {user.rol}
                      </span>
                    </td>
                    <td style={{ padding: 'var(--spacing-md)', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', justifyContent: 'flex-end' }}>
                        <Button variant="secondary" size="sm" icon={<Edit size={16} />} onClick={() => handleEditUser(user)}>
                          Editar
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={<Trash2 size={16} />}
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteModalOpen(true);
                          }}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Modal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          title={userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
          size="md"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', padding: 'var(--spacing-md)' }}>
            <Input
              label="Nombre de Usuario"
              value={formData.username || ''}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
            
            <Input
              label="Nombre Completo"
              value={formData.nombreCompleto}
              onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
              required
            />

            <Input
              label={userToEdit ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!userToEdit}
            />

            <div className="input-group">
              <label className="input-label">Rol</label>
              <select
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                }}
                required
              >
                <option value="alumno">Alumno</option>
                <option value="bibliotecario">Bibliotecario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--border-color)' }}>
              <Button type="button" variant="secondary" onClick={() => setIsFormModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary">
                {userToEdit ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Eliminar Usuario"
          size="sm"
        >
          <div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
              ¿Estás seguro de que deseas eliminar al usuario <strong>{selectedUser?.username || selectedUser?.nombre}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'flex-end' }}>
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={() => {
                console.log('Botón eliminar usuario presionado');
                handleDelete();
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
