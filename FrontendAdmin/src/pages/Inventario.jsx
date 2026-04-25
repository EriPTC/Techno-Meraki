// src/pages/Inventario.jsx
import { useState, useMemo, useRef } from 'react';
import Navbar from '../components/Navbar';
import CategoryFilter from '../components/CategoryFilter';
import ProductTable from '../components/TableProducts';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import AdvancedColorPicker from '../components/AdvancedColorPicker';
import Alert from '../components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import initialProducts from '../data/products';
import { Plus, CloudUpload, ChevronDown, Pipette, X } from 'lucide-react';

function Inventario() {
  // Estado volátil: copia local de los productos
  const [products, setProducts] = useState(initialProducts);
  const [activeModal, setActiveModal] = useState(null); // 'add', 'edit', 'details'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const fileInputRef = useRef(null);

  // Estado del formulario (agregar / editar)
  const [formProduct, setFormProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    colors: [],
    images: [],
    sucursal: ""
  });

  // Estados para alertas y confirmación
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null, productName: '' });

  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
  };

  const hideAlert = () => setAlert(prev => ({ ...prev, visible: false }));

  // Obtener categorías únicas de los productos
  const uniqueCategories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  // Filtrar productos por categoría y búsqueda
  const filteredProducts = useMemo(() => {
  let filtered = products;
  
  // Filtro por categoría (case-insensitive y trimmed)
  if (selectedCategory !== 'Todos') {
    filtered = filtered.filter(p => 
      p.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
    );
  }
  
  // Filtro por búsqueda (case-insensitive)
  if (searchTerm.trim()) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  return filtered;
}, [products, selectedCategory, searchTerm]);

  // Handlers de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setFormProduct(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = (index) => {
    setFormProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handlers de colores
  const addColor = (color) => {
    if (!formProduct.colors.includes(color)) {
      setFormProduct(prev => ({ ...prev, colors: [...prev.colors, color] }));
    }
    setShowColorPicker(false);
  };

  const removeColor = (color) => {
    setFormProduct(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }));
  };

  // Abrir modal para agregar
  const openAddModal = () => {
    setFormProduct({
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      colors: [],
      images: [],
      sucursal: ""
    });
    setActiveModal('add');
  };

  // Abrir modal para editar
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormProduct({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      colors: [...product.colors],
      images: product.image ? [product.image] : [],
      sucursal: product.sucursal || ""
    });
    setActiveModal('edit');
  };

  // Guardar (agregar o editar)
  const saveProduct = () => {
    // Validaciones
    if (!formProduct.title.trim()) {
      showAlert('error', 'El nombre del producto es obligatorio');
      return;
    }
    if (!formProduct.price || parseFloat(formProduct.price) <= 0) {
      showAlert('error', 'Precio inválido');
      return;
    }
    if (!formProduct.stock || parseInt(formProduct.stock) < 0) {
      showAlert('error', 'Stock inválido');
      return;
    }
    if (!formProduct.category.trim()) {
      showAlert('error', 'La categoría es obligatoria');
      return;
    }

    if (activeModal === 'add') {
      const newProduct = {
        id: Date.now(),
        title: formProduct.title,
        price: parseFloat(formProduct.price),
        stock: parseInt(formProduct.stock),
        category: formProduct.category,
        description: formProduct.description,
        image: formProduct.images.length > 0 ? formProduct.images[0] : "https://via.placeholder.com/300",
        colors: formProduct.colors,
        reviews: [],
        sucursal: formProduct.sucursal
      };
      setProducts([newProduct, ...products]);
      showAlert('success', `Producto "${formProduct.title}" agregado correctamente`);
    } else if (activeModal === 'edit' && selectedProduct) {
      const updatedProducts = products.map(p =>
        p.id === selectedProduct.id
          ? {
              ...p,
              title: formProduct.title,
              description: formProduct.description,
              price: parseFloat(formProduct.price),
              stock: parseInt(formProduct.stock),
              category: formProduct.category,
              colors: formProduct.colors,
              image: formProduct.images.length > 0 ? formProduct.images[0] : p.image,
              sucursal: formProduct.sucursal
            }
          : p
      );
      setProducts(updatedProducts);
      showAlert('success', `Producto "${formProduct.title}" actualizado`);
    }
    setActiveModal(null);
    setSelectedProduct(null);
  };

  // Solicitud de eliminación (abre modal de confirmación)
  const requestDelete = (id, name) => {
    setConfirmDelete({ isOpen: true, productId: id, productName: name });
  };

  // Confirmar eliminación
  const confirmDeleteProduct = () => {
    const { productId, productName } = confirmDelete;
    setProducts(products.filter(p => p.id !== productId));
    showAlert('success', `Producto "${productName}" eliminado`);
    setConfirmDelete({ isOpen: false, productId: null, productName: '' });
  };

  // Ver detalles
  const viewDetails = (product) => {
    setSelectedProduct(product);
    setActiveModal('details');
  };

  return (
    <div className="min-h-screen bg-[#fdfcff] font-sans flex flex-col selection:bg-blue-200">
      <Navbar />
      <main className="flex-grow w-full max-w-[1200px] mx-auto p-8 pt-10">
        {/* Filtro por categorías */}
        <CategoryFilter
          categories={uniqueCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Buscador y botón agregar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-8 py-3 bg-[#a3c9e6] hover:bg-[#8eb6d4] text-black font-bold rounded-2xl transition-all shadow-sm border border-gray-200"
          >
            <Plus size={20} /> Agregar Producto
          </button>
        </div>

        {/* Tabla de productos (scrolleable, con mensaje vacío) */}
        <ProductTable
          products={filteredProducts}
          onEdit={openEditModal}
          onDelete={requestDelete}
          onViewDetails={viewDetails}
        />
      </main>
      <Footer />

      {/* Alerta flotante */}
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.visible}
        onClose={hideAlert}
        duration={3000}
      />

      {/* Modal de confirmación para eliminar */}
      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, productId: null, productName: '' })}
        onConfirm={confirmDeleteProduct}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que deseas eliminar el producto "${confirmDelete.productName}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* MODAL: AGREGAR / EDITAR */}
      <Modal isOpen={activeModal === 'add' || activeModal === 'edit'} onClose={() => setActiveModal(null)} maxWidth="max-w-5xl">
        <div className="p-10">
          <h3 className="text-2xl font-bold mb-6">{activeModal === 'add' ? 'Nuevo Producto' : 'Editar Producto'}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Columna izquierda */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Nombre del Producto *</label>
                <input
                  type="text"
                  value={formProduct.title}
                  onChange={(e) => setFormProduct({ ...formProduct, title: e.target.value })}
                  className="w-full px-5 py-3 border border-gray-300 rounded-2xl focus:outline-none text-sm"
                  placeholder="Ej. iPhone 15 Pro..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Descripción</label>
                <textarea
                  rows="4"
                  value={formProduct.description}
                  onChange={(e) => setFormProduct({ ...formProduct, description: e.target.value })}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none text-sm resize-none"
                  placeholder="Detalles del producto..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-2 text-center">Precio ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formProduct.price}
                    onChange={(e) => setFormProduct({ ...formProduct, price: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-2 text-center">Stock *</label>
                  <input
                    type="number"
                    value={formProduct.stock}
                    onChange={(e) => setFormProduct({ ...formProduct, stock: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl text-center"
                  />
                </div>
              </div>
              
              {/* Combobox con datalist para categoría */}
              <div className="relative">
                <label className="block text-sm font-bold mb-2 text-gray-700">Categoría *</label>
                <div className="relative">
                  <input
                    list="categorias"
                    type="text"
                    value={formProduct.category}
                    onChange={(e) => setFormProduct({ ...formProduct, category: e.target.value })}
                    className="w-full px-5 py-3 pr-10 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-sm bg-white"
                    placeholder="Ej. Electrónica, Ropa, Hogar..."
                    autoComplete="off"
                  />
                  <ChevronDown
                    size={20}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
                <datalist id="categorias">
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                <p className="text-[11px] text-gray-400 mt-1 ml-1">Puedes escribir una nueva categoría</p>
              </div>

              {/* Selector de colores */}
              <div className="relative">
                <label className="block text-sm font-bold mb-2">Colores Disponibles</label>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-full px-5 py-4 border border-gray-300 rounded-2xl text-sm flex justify-between items-center bg-white hover:border-blue-400"
                >
                  <span className="text-gray-400">Pulsar para elegir color exacto</span>
                  <Pipette size={18} className="text-blue-600" />
                </button>
                {showColorPicker && (
                  <AdvancedColorPicker onSelectColor={addColor} onClose={() => setShowColorPicker(false)} />
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  {formProduct.colors.map(c => (
                    <div key={c} className="group relative">
                      <div className="w-12 h-12 rounded-2xl border-4 border-white shadow-lg" style={{ backgroundColor: c }} />
                      <button
                        onClick={() => removeColor(c)}
                        className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {formProduct.colors.length === 0 && (
                    <p className="text-xs text-gray-400 italic">No hay colores seleccionados.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha: imágenes y sucursal */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-4">Imagen del Producto</label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-gray-300 rounded-[2rem] p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all"
                >
                  <CloudUpload size={60} className="text-gray-300 mb-4" />
                  <p className="text-sm font-bold text-gray-600">Sube una imagen</p>
                  <p className="text-[10px] text-gray-400 mt-2">JPG, PNG o WEBP (Máx. 5MB)</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  {formProduct.images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border group shadow-sm">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Sucursal de Asignación</label>
                <div className="relative">
                  <select
                    value={formProduct.sucursal}
                    onChange={(e) => setFormProduct({ ...formProduct, sucursal: e.target.value })}
                    className="w-full appearance-none px-6 py-4 border border-gray-300 rounded-2xl text-sm bg-white cursor-pointer"
                  >
                    <option value="">Seleccionar Sucursal</option>
                    <option value="central">Téchnē Central</option>
                    <option value="norte">Téchnē Norte</option>
                    <option value="sur">Téchnē Sur</option>
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end gap-6">
            <button onClick={() => setActiveModal(null)} className="px-10 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200">
              Cancelar
            </button>
            <button
              onClick={saveProduct}
              className="px-14 py-4 bg-[#2d3a8c] text-white font-bold rounded-2xl shadow-lg hover:bg-[#1e275e] transition-all"
            >
              {activeModal === 'add' ? 'Registrar Producto' : 'Actualizar Producto'}
            </button>
          </div>
        </div>
      </Modal>

      {/* MODAL: DETALLES DEL PRODUCTO */}
      <Modal isOpen={activeModal === 'details'} onClose={() => setActiveModal(null)} maxWidth="max-w-4xl">
        {selectedProduct && (
          <div className="p-8 bg-[#f8f9fa]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center border shadow-xl min-h-[400px]">
                <img src={selectedProduct.image} className="max-h-72 object-contain rounded-2xl drop-shadow-2xl" alt={selectedProduct.title} />
              </div>
              <div className="bg-white rounded-[2.5rem] p-12 border shadow-xl flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold uppercase text-blue-600 tracking-widest px-3 py-1 bg-blue-50 rounded-full">{selectedProduct.category}</span>
                  <span className="text-xs text-gray-400 font-medium">Stock: {selectedProduct.stock} uds.</span>
                </div>
                <h3 className="text-4xl font-black mb-1">{selectedProduct.title}</h3>
                <p className="text-4xl font-bold text-blue-600 mb-6">${selectedProduct.price.toFixed(2)}</p>
                <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                  <p className="text-sm text-gray-600 leading-relaxed italic">"{selectedProduct.description}"</p>
                </div>
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-800 border-l-4 border-blue-600 pl-3">Colores</p>
                  <div className="flex flex-wrap gap-4">
                    {selectedProduct.colors?.map(c => (
                      <div key={c} className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 rounded-full border-4 border-white shadow-md" style={{ backgroundColor: c }} />
                        <span className="text-[9px] font-mono uppercase text-gray-400">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedProduct.reviews?.length > 0 && (
                  <div className="mt-6">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-800 mb-2">Reseñas</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({selectedProduct.reviews.length})</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end bg-white p-6 rounded-[2rem] border shadow-sm">
              <button onClick={() => setActiveModal(null)} className="px-16 py-4 bg-[#2d3a8c] text-white rounded-2xl font-bold shadow-lg">
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Inventario;