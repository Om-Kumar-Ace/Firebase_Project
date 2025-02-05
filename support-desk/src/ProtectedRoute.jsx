import { useEffect, useState } from "react";
import { auth, db } from "../src/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
      setLoading(false);
    };
    fetchUserRole();
  }, []);

  if (loading) return <p>Loading...</p>;

  return userRole === requiredRole ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
