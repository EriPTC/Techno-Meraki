import React, { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import Alert from "../components/Alert.jsx";

export default function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ visible: false, type: "success", message: "" });

  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
  };

  const hideAlert = () => setAlert({ visible: false, type: "success", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.password.trim()) {
      showAlert("error", "La contraseña no puede estar vacía");
      return;
    }
    showAlert("success", "Contraseña actualizada correctamente");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      <CircleAnimation numCircles={20} />
      <motion.div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Cambiar Contraseña
            </h1>
            <p className="text-gray-500 mt-1">Cambia tu contraseña a una fuerte</p>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              label="Contraseña"
              name="password"
              placeholder="Ingrese su contraseña"
              type={showPassword ? "text" : "password"}
              icon={showPassword ? EyeOff : Eye}
              onIconClick={togglePasswordVisibility}
              value={formData.password}
              onChange={handleChange}
            />
            <div className="flex justify-center mt-4">
              <Button type="submit">Aceptar</Button>
            </div>
          </form>
        </div>
      </motion.div>

      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.visible}
        onClose={hideAlert}
        duration={3000}
      />
    </div>
  );
}