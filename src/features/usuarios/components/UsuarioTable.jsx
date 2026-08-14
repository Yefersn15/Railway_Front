import React from 'react';
import { Edit, Trash2, User, Shield, UserCheck } from 'lucide-react';

const UsuarioTable = ({ usuarios, currentUserId, onEdit, onDelete }) => {
  if (usuarios.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
        <User className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No hay usuarios</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comienza agregando un nuevo usuario.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Registrado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  #{usuario.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      {usuario.rol === 'admin' ? (
                        <Shield className="h-5 w-5 text-indigo-600" />
                      ) : (
                        <User className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {usuario.nombre}
                        {usuario.id === currentUserId && (
                          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            Tú
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {usuario.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    usuario.rol === 'admin'
                      ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                      : usuario.rol === 'domiciliario'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                  }`}>
                    {usuario.rol === 'admin' ? 'Administrador' : usuario.rol === 'domiciliario' ? 'Domiciliario' : 'Usuario'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(usuario.created_at).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(usuario)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3 transition"
                    disabled={usuario.id === currentUserId}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(usuario.id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 transition"
                    disabled={usuario.id === currentUserId}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsuarioTable;