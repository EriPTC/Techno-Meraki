// src/components/BannerManagerModal.jsx
import { useState, useRef, useEffect } from 'react';
import { X, Upload, Check, Image as ImageIcon } from 'lucide-react';
import bannerProductsData from '../data/banner'; // para lista de productos disponibles

const BannerManagerModal = ({ initialProduct, onClose, onSave }) => {
  // Si se pasa initialProduct, lo usamos; si no, selección null.
  const [selectedProduct, setSelectedProduct] = useState(initialProduct || null);
  const [selectedBg, setSelectedBg] = useState({ id: 1, type: 'class', value: "bg-gradient-to-r from-blue-300 to-blue-100", label: "Azul" });
  const [backgrounds, setBackgrounds] = useState([
    { id: 1, type: 'class', value: "bg-gradient-to-r from-blue-300 to-blue-100", label: "Azul" },
    { id: 2, type: 'class', value: "bg-gradient-to-r from-purple-300 to-purple-100", label: "Púrpura" },
    { id: 3, type: 'class', value: "bg-gradient-to-r from-yellow-200 to-yellow-50", label: "Amarillo" },
    { id: 4, type: 'class', value: "bg-gradient-to-r from-pink-300 to-pink-100", label: "Rosa" },
  ]);
  const fileInputRef = useRef(null);

  // Si es edición, cargamos el fondo que tenga el producto (si existe)
  useEffect(() => {
    if (initialProduct?.background) {
      setSelectedBg(initialProduct.background);
    }
  }, [initialProduct]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBg = { id: Date.now(), type: 'image', value: reader.result, label: 'Personalizado' };
        setBackgrounds([...backgrounds, newBg]);
        setSelectedBg(newBg);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!selectedProduct) {
      alert('Debes seleccionar un producto');
      return;
    }
    onSave({ product: selectedProduct, background: selectedBg });
    onClose();
  };

  // Función para seleccionar producto (usada en la tabla interna)
  const ProductSelectionTable = () => {
    const availableProducts = bannerProductsData; // puedes importar la lista completa
    return (
      <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-sm max-h-[300px] overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[#b4d4e8]">
            <tr><th className="px-4 py-2">Producto</th><th className="px-4 py-2">Precio c/ descuento</th></tr>
          </thead>
          <tbody>
            {availableProducts.map(p => (
              <tr key={p.id} onClick={() => setSelectedProduct(p)} className={`cursor-pointer hover:bg-gray-50 ${selectedProduct?.id === p.id ? 'bg-blue-50' : ''}`}>
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.priceDiscount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-8 bg-white max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialProduct ? 'Editar producto del banner' : 'Agregar producto al banner'}
        </h2>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
      </div>

      {/* Selección de producto (solo en agregar, en edición se muestra fijo) */}
      {!initialProduct && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Seleccione un producto</h3>
          <ProductSelectionTable />
        </div>
      )}
      {initialProduct && (
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl">
          <p className="text-sm font-bold">Producto seleccionado:</p>
          <p className="text-lg font-bold">{initialProduct.name}</p>
        </div>
      )}

      {/* Fondo del banner */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Fondo del banner</h3>
        <div className="flex flex-wrap gap-3">
          {backgrounds.map((bg) => (
            <button
              key={bg.id}
              onClick={() => setSelectedBg(bg)}
              className={`w-24 h-16 rounded-xl border-2 transition-all overflow-hidden relative shadow-sm ${
                selectedBg.id === bg.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              } ${bg.type === 'class' ? bg.value : ''}`}
              style={bg.type === 'image' ? { backgroundImage: `url(${bg.value})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              {selectedBg.id === bg.id && (
                <div className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-0.5">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
              {bg.type === 'class' && (
                <span className="absolute bottom-1 left-1 text-[10px] font-bold text-white bg-black/50 px-1 rounded">
                  {bg.label}
                </span>
              )}
            </button>
          ))}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />
          <button
            onClick={() => fileInputRef.current.click()}
            className="w-24 h-16 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
          >
            <Upload size={20} />
            <span className="text-[10px] mt-1">Subir</span>
          </button>
        </div>
      </div>

      {/* Vista previa */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Vista previa</h3>
        <div
          className={`w-full h-64 rounded-2xl relative flex items-center justify-between px-8 overflow-hidden shadow-md transition-all ${
            selectedBg.type === 'class' ? selectedBg.value : ''
          }`}
          style={selectedBg.type === 'image' ? { backgroundImage: `url(${selectedBg.value})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {selectedBg.type === 'image' && <div className="absolute inset-0 bg-black/20"></div>}
          <div className="z-10 max-w-md">
            <h4 className="text-2xl font-bold text-white drop-shadow-md">
              {selectedProduct ? selectedProduct.name : "Selecciona un producto"}
            </h4>
            <p className="text-sm text-white/90 mt-2 drop-shadow">
              {selectedProduct ? selectedProduct.description : "La descripción aparecerá aquí"}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-white drop-shadow-md">
                {selectedProduct ? selectedProduct.priceDiscount : "$0.00"}
              </span>
              {selectedProduct && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {selectedProduct.discount} OFF
                </span>
              )}
            </div>
          </div>
          <div className="z-10">
            {selectedProduct ? (
              <img src={selectedProduct.photo} className="w-40 h-40 object-contain drop-shadow-lg" alt="preview" />
            ) : (
              <div className="w-40 h-40 flex items-center justify-center bg-white/20 rounded-full backdrop-blur-sm">
                <ImageIcon size={48} className="text-white/60" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-[#2d3a8c] text-white font-bold rounded-xl hover:bg-[#1e275e] transition-colors shadow-md"
        >
          Guardar Banner
        </button>
      </div>
    </div>
  );
};

export default BannerManagerModal;