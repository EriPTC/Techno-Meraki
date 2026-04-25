import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DataSummary from '../components/DataSummary';
import OrdersTable from '../components/TableSales';
import BannerProductsTable from '../components/BannerProductstable';
import CategoryFilter from '../components/CategoryFilter';
import TableSales from '../components/TableSales';

const App = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  return (
    <div className="min-h-screen bg-[#fdfcff] font-sans flex flex-col selection:bg-blue-200">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
        {currentView === 'dashboard' ? (
          <>
            <DataSummary />
            <OrdersTable />
            <BannerProductsTable />
          </>
        ) : (
          <>
            <CategoryFilter />
            <TableSales />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;