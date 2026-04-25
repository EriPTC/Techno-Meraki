import {BrowserRouter as Router, Routes, Route} from 'react-router'
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import LoginPage from './pages/Login.jsx';
import Recuperar1Page from './pages/RecuperarContraseña.jsx';
import Recuperar2Page from './pages/RecuperarContraseña1.jsx';
import Recuperar3Page from './pages/RecuperarContraseña2.jsx';
import PrimerUso from "./pages/PrimerUso.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Inventario from './pages/Inventario.jsx';
import Empleados from './pages/Empleados.jsx';
import Promociones from './pages/Promociones.jsx';
import {motion} from 'motion/react';


function App() {
  return (
    <>
    <Router>
      
      <div className="flex flex-col min-h-screen">
        <motion.div className={`${<Navbar/>}`}/>
        
          <main className="flex-grow">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/recuperar-contraseña" element={<Recuperar1Page />} />
            <Route path="/codigo-correo" element={<Recuperar2Page />} />
            <Route path="/nueva-contraseña" element={<Recuperar3Page />} /> 
            <Route path="/" element={<PrimerUso />} />
            <Route path="/inventario" element={<Inventario />} /> 
            <Route path="/dashboard" element={<Dashboard />} /> 
            <Route path="/empleados" element={<Empleados />} /> 
            <Route path="/promociones" element={<Promociones />} /> 
            {/* Puedes agregar ruta para registro luego */}
          </Routes>
        </main>
        
        
        <motion.div className={`${<Footer />}`}/>
      </div>
    </Router>
    </>
  )
}

export default App
