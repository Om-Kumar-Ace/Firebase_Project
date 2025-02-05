import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === "admin") {
                    navigate("/admin-dashboard"); 
                } else {
                    navigate("/customer-dashboard"); 
                }
            } else {
                setError("User role not found. Please contact support.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid email or password.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-violet-200">
            <div className="w-full max-w-md p-8 bg-white/30 backdrop-blur-md shadow-xl rounded-2xl border border-white/30">
                <h2 className="text-3xl font-semibold text-center text-gray-900 mb-6">Welcome Back</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="email"
                            className="w-full p-3 border rounded-lg bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className="w-full p-3 border rounded-lg bg-white/60 focus:outline-none focus:ring-2 focus:ring-violet-400 transition"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-violet-500 text-white p-3 rounded-lg font-semibold text-lg transition duration-300 hover:bg-violet-600 focus:ring-2 focus:ring-violet-400"
                    >
                        Login
                    </button>
                    <p className="text-center text-gray-700 text-sm mt-4">
                        Forgot your password? <a href="/reset-password" className="text-violet-600 hover:underline">Reset it</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
