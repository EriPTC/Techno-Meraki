// src/components/PromotionModal.jsx
import { useState, useEffect } from 'react';
import { ChevronDown, Calendar, X, Tag } from 'lucide-react';

const PromotionModal = ({ promotion, products, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: promotion?.nombre || '',
    productos: promotion?.productos || [],
    fechaInicio: promotion?.fechaInicio || '',
    fechaFin: promotion?.fechaFin || '',
    estado: promotion?.estado || 'Próxima'
  });

  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    if (promotion) {
      setFormData({
        nombre: promotion.nombre,
        productos: promotion.productos,
        fechaInicio: promotion.fechaInicio,
        fechaFin: promotion.fechaFin,
        estado: promotion.estado
      });
    }
  }, [promotion]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addProduct = () => {
    if (selectedProduct && !formData.productos.includes(selectedProduct)) {
      setFormData({ ...formData, productos: [...formData.productos, selectedProduct] });
      setSelectedProduct('');
    }
  };

  const removeProduct = (productName) => {
    setFormData({
      ...formData,
      productos: formData.productos.filter(p => p !== productName)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.fechaInicio || !formData.fechaFin || formData.productos.length === 0) {
      alert('Completa todos los campos y agrega al menos un producto');
      return;
    }
    const newPromotion = {
      id: promotion?.id || Date.now(),
      ...formData,
      estado: new Date(formData.fechaInicio) <= new Date() && new Date(formData.fechaFin) >= new Date() ? 'Activa' : 
              new Date(formData.fechaInicio) > new Date() ? 'Próxima' : 'Vencida'
    };
    onSave(newPromotion);
    onClose();
  };

  return (
    <div className="p-8 bg-white max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Nombre de la promoción *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
              placeholder="Ej. Ofertas de Verano"
            />
          </div>

          {/* Selector de productos (con búsqueda simple) */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Producto *</label>
            <div className="flex gap-2">
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-200 outline-none"
              >
                <option value="">Seleccionar producto...</option>
                {products.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={addProduct}
                className="px-4 py-2 bg-[#a3c9e6] text-black font-bold rounded-xl hover:bg-[#8eb6d4] transition-colors"
              >
                Agregar
              </button>
            </div>
            <p className="text-xs text-gray-400">Puedes agregar varios productos a esta promoción</p>
          </div>

          {/* Fecha inicio */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Fecha de inicio *</label>
            <div className="relative">
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Fecha fin */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Fecha de finalización *</label>
            <div className="relative">
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <Calendar size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Estado (solo lectura, se calcula automáticamente pero se puede mostrar) */}
          <div className="space-y-1">
            <label className="block text-sm font-bold text-gray-700">Estado (automático)</label>
            <div className="px-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-600">
              {formData.estado}
            </div>
          </div>
        </div>

        {/* Lista de productos seleccionados */}
        <div className="mt-6">
          <label className="block text-sm font-bold text-gray-700 mb-2">Productos en promoción</label>
          <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 flex flex-wrap gap-2">
            {formData.productos.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center text-gray-400 py-4">
                <Tag size={28} />
                <p className="text-xs mt-1">Agrega productos desde la lista</p>
              </div>
            ) : (
              formData.productos.map(prod => (
                <div key={prod} className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1 rounded-full text-sm shadow-sm">
                  <span className="text-blue-600">#</span> {prod}
                  <button
                    type="button"
                    onClick={() => removeProduct(prod)}
                    className="text-red-500 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#2b5a8c] text-white font-bold rounded-xl hover:bg-[#1e4166] transition-colors shadow-md"
          >
            {promotion ? 'Actualizar' : 'Guardar Promoción'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromotionModal;