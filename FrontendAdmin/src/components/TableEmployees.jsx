// src/components/TableEmployees.jsx
import { useState } from 'react';
import { Search, Plus, Upload, Trash2, Users, UserX } from 'lucide-react';

const TableEmployees = ({ employees, onEdit, onDelete, onViewDetails, onAddNew }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(emp =>
    emp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.rol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.dui.includes(searchTerm)
  );

  const isEmpty = filteredEmployees.length === 0;
  const isSearchEmpty = searchTerm.trim() !== '' && isEmpty;
  const noData = employees.length === 0;

  return (
    <div>
      {/* Barra de herramientas - buscador más ancho */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-96"> {/* Aumentado de sm:w-80 a sm:w-96 */}
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar empleados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-base"
          />
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-2 px-8 py-3 bg-[#a3c9e6] hover:bg-[#8eb6d4] text-black font-bold rounded-xl transition-all shadow-sm text-base"
        >
          <Plus size={20} /> Agregar
        </button>
      </div>

      {/* Tabla con scroll - altura aumentada y celdas más grandes */}
      <div className="overflow-hidden border border-gray-300 rounded-2xl shadow-sm">
        <div className="overflow-x-auto">
          <div className="max-h-[600px] overflow-y-auto"> {/* Aumentado de 500px a 600px */}
            <table className="w-full text-left text-base"> {/* Texto base en lugar de text-sm */}
              <thead className="sticky top-0 z-10 bg-[#b4d4e8] shadow-sm">
                <tr>
                  <th className="px-6 py-4 font-bold text-gray-800 border-r border-gray-300/50 whitespace-nowrap">Nombre</th>
                  <th className="px-6 py-4 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">DUI</th>
                  <th className="px-6 py-4 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">Usuario</th>
                  <th className="px-6 py-4 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">Fecha de Nac.</th>
                  <th className="px-6 py-4 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">Rol</th>
                  <th className="px-6 py-4 font-bold text-gray-800 text-center whitespace-nowrap">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {isEmpty ? (
                  <tr>
                    <td colSpan="6" className="text-center py-16"> {/* más padding vertical */}
                      <div className="flex flex-col items-center justify-center gap-3 text-gray-400">
                        {noData ? (
                          <>
                            <Users size={56} strokeWidth={1.5} />
                            <p className="text-xl font-medium">No hay empleados registrados</p>
                            <p className="text-base">Haz clic en "Agregar" para comenzar</p>
                          </>
                        ) : isSearchEmpty ? (
                          <>
                            <UserX size={56} strokeWidth={1.5} />
                            <p className="text-xl font-medium">No se encontraron empleados</p>
                            <p className="text-base">Prueba con otros términos de búsqueda</p>
                          </>
                        ) : (
                          <>
                            <Users size={56} strokeWidth={1.5} />
                            <p className="text-xl font-medium">No hay empleados disponibles</p>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 border-r border-gray-200/50 font-medium whitespace-nowrap">{emp.nombre}</td>
                      <td className="px-6 py-4 border-r border-gray-200/50 text-center text-gray-600 font-mono text-sm whitespace-nowrap">{emp.dui}</td>
                      <td className="px-6 py-4 border-r border-gray-200/50 text-center text-gray-600 whitespace-nowrap">{emp.usuario}</td>
                      <td className="px-6 py-4 border-r border-gray-200/50 text-center text-gray-600 whitespace-nowrap">{emp.fecha}</td>
                      <td className="px-6 py-4 border-r border-gray-200/50 text-center text-gray-600 whitespace-nowrap">{emp.rol}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEdit(emp)}
                            className="p-2 bg-[#5c8eff] text-white rounded-lg hover:bg-blue-600 transition-colors"
                            title="Editar"
                          >
                            <Upload size={18} />
                          </button>
                          <button
                            onClick={() => onDelete(emp.id, emp.nombre)}
                            className="p-2 bg-[#2d3a8c] text-white rounded-lg hover:bg-red-800 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button
                            onClick={() => onViewDetails(emp)}
                            className="bg-[#5c8eff] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors"
                          >
                            Ver más
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableEmployees;