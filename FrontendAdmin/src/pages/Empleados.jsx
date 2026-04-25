// src/App.jsx
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import Alert from '../../../TechnoMeraki/src/components/Alert';
import ConfirmModal from '../components/ConfirmModal';
import EmployeeFormModal from '../components/EmployeeFormModal';
import EmployeeDetailModal from '../components/EmployeeDetailModal';
import TableEmployees from '../components/TableEmployees'; // Importamos el nuevo componente
import initialEmployees from '../data/employees';

function App() {
  const [activeTab, setActiveTab] = useState('empleados');
  const [employees, setEmployees] = useState(initialEmployees.map(emp => ({ ...emp, salario: emp.salario || '700.00' })));
  const [activeModal, setActiveModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState({ visible: false, type: 'success', message: '' });
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, name: '' });

  const showAlert = (type, message) => setAlert({ visible: true, type, message });
  const hideAlert = () => setAlert({ visible: false, type: 'success', message: '' });

  const openAdd = () => { setSelectedUser(null); setActiveModal('form'); };
  const openEdit = (user) => { setSelectedUser(user); setActiveModal('form'); };
  const openDetails = (user) => { setSelectedUser(user); setActiveModal('details'); };

  const handleSave = (newEmployee) => {
    if (selectedUser) {
      setEmployees(employees.map(e => e.id === selectedUser.id ? newEmployee : e));
      showAlert('success', `Empleado ${newEmployee.nombre} actualizado`);
    } else {
      setEmployees([newEmployee, ...employees]);
      showAlert('success', `Empleado ${newEmployee.nombre} agregado`);
    }
    setActiveModal(null);
  };

  const requestDelete = (id, name) => setConfirmDelete({ open: true, id, name });
  const confirmDeleteEmployee = () => {
    setEmployees(employees.filter(e => e.id !== confirmDelete.id));
    showAlert('success', `Empleado ${confirmDelete.name} eliminado`);
    setConfirmDelete({ open: false, id: null, name: '' });
    if (activeModal === 'details') setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <Navbar currentTab={activeTab} setTab={setActiveTab} />
      <main className="flex-grow max-w-7xl mx-auto p-8">
        <h2 className="text-4xl font-black capitalize mb-8">Empleados</h2>

        {/* Usamos el componente TableEmployees que ya incluye buscador y acciones */}
        <TableEmployees
          employees={employees}
          onEdit={openEdit}
          onDelete={requestDelete}
          onViewDetails={openDetails}
          onAddNew={openAdd}
        />
      </main>
      <Footer />

      <Modal isOpen={activeModal === 'form'} onClose={() => setActiveModal(null)} maxWidth="max-w-5xl">
        <EmployeeFormModal user={selectedUser} onClose={() => setActiveModal(null)} onSave={handleSave} />
      </Modal>
      <Modal isOpen={activeModal === 'details'} onClose={() => setActiveModal(null)} maxWidth="max-w-5xl">
        <EmployeeDetailModal user={selectedUser} onClose={() => setActiveModal(null)} onEdit={openEdit} onDelete={requestDelete} />
      </Modal>
      <ConfirmModal isOpen={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null, name: '' })} onConfirm={confirmDeleteEmployee} title="Confirmar eliminación" message={`¿Eliminar a ${confirmDelete.name}?`} confirmText="Eliminar" cancelText="Cancelar" type="danger" />
      <Alert isVisible={alert.visible} type={alert.type} message={alert.message} onClose={hideAlert} />
    </div>
  );
}

export default App;