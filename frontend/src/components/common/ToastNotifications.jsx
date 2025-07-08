// // components/common/ToastProvider.jsx
// import React from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ToastProvider = () => {
//   return (
//     <ToastContainer
//       position="top-right"
//       autoClose={3000}
//       hideProgressBar={false}
//       newestOnTop
//       closeOnClick
//       rtl={false}
//       pauseOnFocusLoss
//       draggable
//       pauseOnHover
//       theme="colored" // light, dark, or colored
//     />
//   );
// };

// export default ToastProvider;


// components/common/ToastProvider.jsx
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastProvider = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // light, dark, or colored
        className="toast-container"
        toastClassName="toast-item"
        bodyClassName="toast-body"
        progressClassName="toast-progress"
      />
      
      {/* Custom Toast Styling */}
      <style jsx="true" global="true">{`
        .toast-container {
          z-index: 9999;
        }
        
        .toast-item {
          border-radius: 12px !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          margin-bottom: 8px !important;
          overflow: hidden !important;
          transform: translateX(0) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .toast-item:hover {
          transform: translateX(-4px) scale(1.02) !important;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15), 0 6px 10px rgba(0, 0, 0, 0.08) !important;
        }
        
        .toast-body {
          font-weight: 500 !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          padding: 12px 16px !important;
        }
        
        .toast-progress {
          height: 3px !important;
          background: linear-gradient(90deg, #3b82f6, #8b5cf6) !important;
          border-radius: 0 0 12px 12px !important;
        }
        
        /* Success Toast - Blue to Purple Gradient */
        .Toastify__toast--success {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%) !important;
          color: white !important;
        }
        
        .Toastify__toast--success .Toastify__progress-bar {
          background: rgba(255, 255, 255, 0.3) !important;
        }
        
        /* Error Toast - Red Gradient */
        .Toastify__toast--error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          color: white !important;
        }
        
        .Toastify__toast--error .Toastify__progress-bar {
          background: rgba(255, 255, 255, 0.3) !important;
        }
        
        /* Warning Toast - Orange Gradient */
        .Toastify__toast--warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          color: white !important;
        }
        
        .Toastify__toast--warning .Toastify__progress-bar {
          background: rgba(255, 255, 255, 0.3) !important;
        }
        
        /* Info Toast - Cyan Gradient */
        .Toastify__toast--info {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%) !important;
          color: white !important;
        }
        
        .Toastify__toast--info .Toastify__progress-bar {
          background: rgba(255, 255, 255, 0.3) !important;
        }
        
        /* Close Button Styling */
        .Toastify__close-button {
          color: rgba(255, 255, 255, 0.8) !important;
          transition: all 0.2s ease !important;
        }
        
        .Toastify__close-button:hover {
          color: white !important;
          transform: scale(1.1) !important;
        }
        
        /* Toast Icon Styling */
        .Toastify__toast-icon {
          width: 24px !important;
          height: 24px !important;
          margin-right: 12px !important;
        }
        
        /* Animation Enhancements */
        @keyframes toastSlideIn {
          from {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        
        @keyframes toastSlideOut {
          from {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
          to {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
        }
        
        .Toastify__toast--default-enter {
          animation: toastSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        .Toastify__toast--default-exit {
          animation: toastSlideOut 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        
        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          .toast-item {
            border: 1px solid rgba(255, 255, 255, 0.05) !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 4px 6px rgba(0, 0, 0, 0.15) !important;
          }
          
          .toast-item:hover {
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 6px 10px rgba(0, 0, 0, 0.2) !important;
          }
        }
        
        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .toast-container {
            left: 8px !important;
            right: 8px !important;
            width: auto !important;
          }
          
          .toast-item {
            margin-bottom: 6px !important;
            border-radius: 10px !important;
          }
          
          .toast-body {
            font-size: 13px !important;
            padding: 10px 14px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ToastProvider;