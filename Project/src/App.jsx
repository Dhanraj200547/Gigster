import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DashboardStudent from "./pages/DashboardStudent";
import DashboardEmployer from "./pages/DashboardEmployer";
import Landing from "./pages/Landing"; // Optional
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Optional: use role from localStorage or Firestore
        const storedRole = localStorage.getItem("role");
        if (storedRole === "student") {
          navigate("/dashboard-student");
        } else if (storedRole === "employer") {
          navigate("/dashboard-employer");
        } else {
          // fallback if role is not known
          navigate("/");
        }
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard-student" element={<DashboardStudent />} />
        <Route path="/dashboard-employer" element={<DashboardEmployer />} />
      </Routes>

      {/* ✅ Toast for global messages */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
