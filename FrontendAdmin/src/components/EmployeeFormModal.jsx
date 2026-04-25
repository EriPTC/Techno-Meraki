// src/components/EmployeeFormModal.jsx
import { useState, useRef } from 'react';
import { ChevronDown, Plus, X, Upload } from 'lucide-react';

const EmployeeFormModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombrePila: user?.nombre?.split(' ')[0] || '',
    apellidos: user?.nombre?.split(' ').slice(1).join(' ') || '',
    dui: user?.dui || '',
    usuario: user?.usuario || '',
    fecha: user?.fecha || '',
    rol: user?.rol || 'Vendedor',
    salario: user?.salario || '',
    sucursal: user?.sucursal || '',
    contraseña: ''
  });

  const [previews, setPreviews] = useState({
    duiFrontal: user?.duiFrontal || null,
    duiTrasera: user?.duiTrasera || null,
    fotoPerfil: user?.fotoPerfil || null
  });

  const fileInputFrontal = useRef(null);
  const fileInputTrasera = useRef(null);
  const fileInputPerfil = useRef(null);

  const handleFileChange = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviews(prev => ({ ...prev, [key]: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const nombreCompleto = `${formData.nombrePila} ${formData.apellidos}`.trim();
    const newEmployee = {
      id: user?.id || Date.now(),
      nombre: nombreCompleto,
      dui: formData.dui,
      usuario: formData.usuario,
      fecha: formData.fecha,
      rol: formData.rol,
      salario: formData.salario,
      sucursal: formData.sucursal,
      duiFrontal: previews.duiFrontal,
      duiTrasera: previews.duiTrasera,
      fotoPerfil: previews.fotoPerfil
    };
    onSave(newEmployee);
    onClose();
  };

  return (
    <div className="p-10 bg-white max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Nombre</label>
              <input type="text" name="nombrePila" value={formData.nombrePila} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">DUI</label>
              <input type="text" name="dui" value={formData.dui} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Cargo</label>
              <div className="flex gap-2 flex-wrap">
                {['Administrador', 'Vendedor', 'Repartidor', 'Bodegero'].map(role => (
                  <button type="button" key={role} onClick={() => setFormData({...formData, rol: role})} className={`px-4 py-2 rounded-2xl border-2 font-medium transition-all ${formData.rol === role ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500'}`}>{role}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Sucursal</label>
              <div className="relative">
                <select name="sucursal" value={formData.sucursal} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl appearance-none bg-white">
                  <option value="">Seleccionar sucursal</option>
                  <option>San Salvador</option>
                  <option>Santa Tecla</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Apellidos</label>
              <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Usuario</label>
              <input type="text" name="usuario" value={formData.usuario} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Contraseña</label>
              <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Salario</label>
              <input type="text" name="salario" value={formData.salario} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Fecha de Nacimiento</label>
              <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-400 outline-none" />
            </div>
          </div>
        </div>

        {/* Imágenes DUI y perfil */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-4">Imágenes de DUI</label>
            <div className="flex gap-4">
              <div onClick={() => fileInputFrontal.current.click()} className="flex-1 border-2 border-dashed rounded-2xl aspect-[1.6/1] flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden relative group">
                <input type="file" ref={fileInputFrontal} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'duiFrontal')} />
                {previews.duiFrontal ? <img src={previews.duiFrontal} className="w-full h-full object-cover" /> : <span className="font-bold">Frontal</span>}
              </div>
              <div onClick={() => fileInputTrasera.current.click()} className="flex-1 border-2 border-dashed rounded-2xl aspect-[1.6/1] flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden relative group">
                <input type="file" ref={fileInputTrasera} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'duiTrasera')} />
                {previews.duiTrasera ? <img src={previews.duiTrasera} className="w-full h-full object-cover" /> : <span className="font-bold">Trasera</span>}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold mb-4 text-right">Foto de perfil</label>
            <div className="flex justify-end">
              <div onClick={() => fileInputPerfil.current.click()} className="w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden relative group">
                <input type="file" ref={fileInputPerfil} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'fotoPerfil')} />
                {previews.fotoPerfil ? <img src={previews.fotoPerfil} className="w-full h-full object-cover" /> : <Plus size={32} />}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-12">
          <button type="button" onClick={onClose} className="px-10 py-3 bg-[#7eb0d5] text-white font-bold rounded-2xl hover:bg-blue-400">Cancelar</button>
          <button type="submit" className="px-10 py-3 bg-[#2b5a8c] text-white font-bold rounded-2xl hover:bg-[#1e4166]">Enviar</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeFormModal;