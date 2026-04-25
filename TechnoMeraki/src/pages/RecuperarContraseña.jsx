import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../components/input.jsx";
import Button from "../components/button.jsx";
import CircleAnimation from "../components/Animations/CircleAnimation.jsx";
import { motion } from "framer-motion";
import Alert from "../components/Alert.jsx";

export default function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ""
  });
  const [alert, setAlert] = useState({ visible: false, type: "success", message: "" });

  const showAlert = (type, message) => {
    setAlert({ visible: true, type, message });
  };

  const hideAlert = () => setAlert({ visible: false, type: "success", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      showAlert("error", "Por favor ingresa un correo válido");
      return;
    }
    showAlert("success", `Se ha enviado un código a ${formData.email}`);
    setTimeout(() => {
      navigate("/codigo-correo");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#bad4f8] relative">
      <CircleAnimation numCircles={20} />
      <motion.div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="bg-white/40 backdrop-blur-md p-8 sm:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/30 w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-[36px] font-bold text-[#1a365d] tracking-tight">
              Ingrese Correo
            </h1>
            <p className="text-gray-500 mt-1">Este fue enviado a su correo</p>
          </div>
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Ingrese su correo"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="text-center mb-8">
              <p className="text-gray-500 mt-1">
                <Link
                  to="/"
                  className="text-[#1a365d] hover:underline decoration-2 underline-offset-2 decoration-[#0a1c33] transition-all active:text-[#0a1c33] font-medium"
                >
                  Volver al login
                </Link>
              </p>
            </div>
            <div className="flex justify-center mt-4">
              <Button type="submit">Avanzar</Button>
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