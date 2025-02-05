import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { X, Menu } from "lucide-react"; // Icons for buttons

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userDoc = await getDoc(doc(db, "users", authUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setUser(null);
        setRole("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Hide sidebar on login page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className="absolute">
      {/* Hamburger Button (Toggle Sidebar) */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden p-3 bg-violet-600 text-white rounded-md fixed top-4 left-4 z-50"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed top-0 left-0 w-64 h-full bg-violet-700 text-white transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex items-center justify-between p-4 border-b border-violet-500">
          <h2 className="text-2xl font-bold text-white">Ticket System</h2>
          {/* Hide Button inside Sidebar */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white bg-violet-600 p-2 rounded-md"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col space-y-4 p-6">
          {role === "admin" && (
            <Link
              to="/admin-dashboard"
              className="px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-md text-lg transition"
            >
               Dashboard
            </Link>
          )}
          {role === "customer" && (
            <Link
              to="/customer-dashboard"
              className="px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-md text-lg transition"
            >
               Dashboard
            </Link>
          )}
            {role === "customer" && (
          <Link
            to="/ticket"
            className="px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-md text-lg transition"
          >
            Tickets Page
          </Link>)}
            {role === "admin" && (
          <Link
            to="/tickets"
            className="px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-md text-lg transition"
          >
            Tickets Page
          </Link>)}
        </nav>

        <div className="absolute bottom-6 w-full px-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition"
          >
            <Link to="/">
            Logout
            </Link>
          </button>
        </div>
      </div>

      {/* Overlay to close sidebar when clicking outside */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
