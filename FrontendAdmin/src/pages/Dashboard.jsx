// src/pages/Dashboard.jsx
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BannerProductsTable from '../components/BannerProductstable';
import BannerManagerModal from '../components/BannerMangerModal';
import OrdersTable from '../components/TableSales'; //  importamos el componente
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import bannerProductsData from '../data/banner';
// import ordersData from '../data/sales'; // ya no necesitamos ordersData porque OrdersTable lo maneja internamente

function Dashboard() {
  // ... lógica de banners (sin cambios) ...
  const [bannerProducts, setBannerProducts] = useState(bannerProductsData);
  const [selectedBannerProduct, setSelectedBannerProduct] = useState(null);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: '' });

  const openAddBannerModal = () => {
    setSelectedBannerProduct(null);
    setIsBannerModalOpen(true);
  };

  const openEditBannerModal = (product) => {
    setSelectedBannerProduct(product);
    setIsBannerModalOpen(true);
  };

  const handleSaveBannerProduct = (data) => {
    const { product, background } = data;
    if (selectedBannerProduct) {
      setBannerProducts((prev) =>
        prev.map((p) =>
          p.id === selectedBannerProduct.id ? { ...product, id: selectedBannerProduct.id, background } : p
        )
      );
    } else {
      const newProduct = { ...product, id: Date.now(), background };
      setBannerProducts((prev) => [...prev, newProduct]);
    }
    setIsBannerModalOpen(false);
  };

  const handleDeleteBannerProduct = (id, name) => {
    setDeleteConfirm({ open: true, id, name });
  };

  const confirmDelete = () => {
    setBannerProducts((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
    setDeleteConfirm({ open: false, id: null, name: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 w-full">
        
        {/* ========== SECCIÓN DE PEDIDOS (usando OrdersTable) ========== */}
        <div className="mb-12">
          <OrdersTable />
        </div>

        {/* ========== SECCIÓN DE BANNERS ========== */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Banners Informativos</h2>
            <p className="text-gray-400 text-sm uppercase tracking-tight">Personaliza la pantalla principal</p>
          </div>
          <BannerProductsTable
            products={bannerProducts}
            onAdd={openAddBannerModal}
            onEdit={openEditBannerModal}
            onDelete={handleDeleteBannerProduct}
          />
        </div>
      </main>

      <Footer />

      {/* Modales de banners */}
      <Modal isOpen={isBannerModalOpen} onClose={() => setIsBannerModalOpen(false)} maxWidth="max-w-6xl">
        <BannerManagerModal
          initialProduct={selectedBannerProduct}
          onClose={() => setIsBannerModalOpen(false)}
          onSave={handleSaveBannerProduct}
        />
      </Modal>

      <ConfirmModal
        isOpen={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null, name: '' })}
        onConfirm={confirmDelete}
        title="Eliminar producto"
        message={`¿Eliminar "${deleteConfirm.name}" del banner?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}

export default Dashboard;