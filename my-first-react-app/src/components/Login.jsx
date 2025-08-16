import React, { useState } from "react";
import { loginUser } from "../appwrite.js"; // Make sure this path is correct

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await loginUser(username, password);
            // Handle successful login (e.g., redirect or show success)
            if (response.success) {
                localStorage.setItem('token', response.token); // Store token for future requests
                // Redirect or update UI as needed
                console.log("Login successful:", response);
            } else {
                setError(response.message || "Login failed");
            }
        } catch (err) {
            setError(err.message || "Login failed");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>
            {error && <div style={{ color: "red" }}>{error}</div>}
            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
};

export default Login;