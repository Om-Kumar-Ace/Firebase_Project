import { useState } from "react";
import { auth, db } from "../firebaseConfig";  
import { createUserWithEmailAndPassword } from "firebase/auth";  
import { setDoc, doc } from "firebase/firestore"; 
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer"); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); 
    setLoading(true);  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User registered:", userCredential.user);

      const userId = userCredential.user.uid;

      await setDoc(doc(db, "users", userId), {
        email,
        role,  
      });

      console.log("User added to Firestore with role:", role);
      alert("Registration successful!");
      
      setEmail("");
      setPassword("");
      setRole("customer"); 
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
