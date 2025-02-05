import { useState } from "react";
import { auth, db } from "../firebaseConfig";  // Firebase configuration
import { createUserWithEmailAndPassword } from "firebase/auth";  // Firebase Authentication
import { setDoc, doc } from "firebase/firestore";  // Firestore functions

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); // Default role is 'customer'
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");  // Reset any previous error messages
    setLoading(true);  // Start loading indicator

    try {
      // Firebase method to register the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);

      // Get user ID from Firebase Authentication
      const userId = userCredential.user.uid;

      // Store user info in Firestore
      await setDoc(doc(db, "users", userId), {
        email,
        role,  // Assign the selected role (customer/admin)
      });

      console.log("User added to Firestore with role:", role);
      alert("Registration successful!");
      
      // Reset the form
      setEmail("");
      setPassword("");
      setRole("customer"); // Reset role to default
      setLoading(false);

    } catch (error) {
      console.error("Error registering user:", error);
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-96 mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Create an Account</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full p-2 border rounded"
          required
        />
        
        {/* Role selection */}
        <div className="mb-4">
          <label className="block mb-2">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
