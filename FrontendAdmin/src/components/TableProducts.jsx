// src/components/ProductTable.jsx
import { Upload, Trash2 } from 'lucide-react';

const ProductTable = ({ products, onEdit, onDelete, onViewDetails }) => {
  return (
    <div className="overflow-hidden border border-gray-300 rounded-2xl shadow-sm">
      {/* Contenedor con scroll vertical y horizontal */}
      <div className="overflow-x-auto">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 z-10 bg-[#b4d4e8] shadow-sm">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold text-gray-800 border-r border-gray-300/50 whitespace-nowrap">Producto</th>
                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">ID</th>
                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">Categoría</th>
                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">Stock</th>
                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold text-gray-800 border-r border-gray-300/50 text-center whitespace-nowrap">Precio</th>
                <th className="px-3 sm:px-6 py-3 sm:py-5 font-bold text-gray-800 text-center whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 bg-white">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-lg font-medium">No se encontraron productos</p>
                      <p className="text-sm">Prueba con otros términos de búsqueda</p>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-2 sm:py-4 border-r border-gray-300/50 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={product.image} className="w-8 h-8 rounded-md object-cover border" alt="" />
                        <span className="text-xs sm:text-sm font-medium">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 border-r border-gray-300/50 text-center text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      #{product.id}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 border-r border-gray-300/50 text-center text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {product.category}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 border-r border-gray-300/50 text-center text-xs sm:text-sm text-gray-600 whitespace-nowrap">
                      {product.stock}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 border-r border-gray-300/50 text-center text-xs sm:text-sm font-medium whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <button onClick={() => onEdit(product)} className="p-2 bg-[#5c8eff] text-white rounded-lg hover:bg-blue-600 transition-colors" title="Editar">
                          <Upload size={18} />
                        </button>
                        <button onClick={() => onDelete(product.id, product.title)} className="p-2 bg-[#2d3a8c] text-white rounded-lg hover:bg-red-800 transition-colors" title="Eliminar">
                          <Trash2 size={18} />
                        </button>
                        <button onClick={() => onViewDetails(product)} className="bg-[#5c8eff] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-bold hover:bg-blue-600">
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
  );
};

export default ProductTable;