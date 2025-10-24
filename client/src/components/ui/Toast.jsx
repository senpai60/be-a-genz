import React, { createContext, useContext, useState, useCallback } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

// 1. Create the Context
const ToastContext = createContext(null);

// 2. Define style types
const typeStyles = {
  success: {
    bg: "bg-zinc-800 border-green-500",
    text: "text-green-400",
    icon: <AiOutlineCheckCircle className="text-2xl" />,
  },
  error: {
    bg: "bg-zinc-800 border-red-500", // Changed from bg-red-800
    text: "text-red-500",
    icon: <AiOutlineCloseCircle className="text-2xl" />,
  },
};

// 3. Create the Provider Component
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success", duration = 3000) => {
    const style = typeStyles[type] || typeStyles.success;
    setToast({ message, type, style });

    setTimeout(() => {
      setToast(null);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className="fixed inset-0 z-999 flex justify-end items-start p-4 pointer-events-none">
          <div
            className={`flex items-center gap-3 p-3 rounded-lg border shadow-lg pointer-events-auto ${toast.style.bg} ${toast.style.text}`}
          >
            {toast.style.icon}
            <p className="text-sm text-zinc-100">{toast.message}</p>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};

// 4. Create the custom hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};