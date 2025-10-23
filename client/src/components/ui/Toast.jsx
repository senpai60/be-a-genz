// src/components/ui/Toast.jsx
import React, { useEffect } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const typeStyles = {
  success: {
    bg: "bg-zinc-800 border-green-500",
    text: "text-green-400",
    icon: <AiOutlineCheckCircle className="text-2xl" />,
  },
  error: {
    bg: "bg-red-800 border-red-500",
    text: "text-red-500",
    icon: <AiOutlineCloseCircle className="text-2xl" />,
  },
};

function Toast({ type = "success", message, onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const style = typeStyles[type] || typeStyles.success;

  return (
    <div className="fixed inset-0 z-999 flex justify-end items-start p-4 pointer-events-none">
      <div
        className={`flex items-center gap-3 p-3 rounded-lg border shadow-lg pointer-events-auto ${style.bg} ${style.text}`}
      >
        {style.icon}
        <p className="text-sm text-zinc-100">{message}</p>
      </div>
    </div>
  );
}

export default Toast;
