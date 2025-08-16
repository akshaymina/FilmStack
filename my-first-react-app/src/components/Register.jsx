import { useState } from "react";
import { registerUser } from "../appwrite.js";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const user = await registerUser(username, password, name);
            console.log("Registered:", user);
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("Registration failed. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-100 px-4 animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02]">

                {/* Logo / Title */}
                <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                        <span className="text-2xl">🎬</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800 mt-4">
                        Create an Account
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Join us and start your journey
                    </p>
                </div>

                {error && (
                    <div className="mb-4 text-sm text-red-700 bg-red-100 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-2xl border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{" "}
                    <a href="/login" className="text-purple-600 hover:underline">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}
