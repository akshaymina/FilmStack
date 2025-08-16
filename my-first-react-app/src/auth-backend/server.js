import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Client, Databases, Query, ID } from "node-appwrite";
import dotenv from "dotenv";
dotenv.config();
import process from "process";
import fetch from "node-fetch"; // Ensure you have node-fetch installed for making HTTP requests









const PORT = 5000; // Port for the auth backend
const PROJECT_ID = process.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.VITE_APPWRITE_DATABASE_ID;
const USER_COLLECTION_ID = process.env.VITE_APPWRITE_USER_COLLECTION_ID;
const APPWRITE_ENDPOINT = process.env.VITE_APPWRITE_ENDPOINT;
const JWT_SECRET = process.env.VITE_SECRET;
const API_KEY = process.env.VITE_APPWRITE_API_KEY;
const TMDB_API_KEY = process.env.VITE_TMDB_API_KEY;


const app = express();
// Alloq all requests from all origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Your frontend origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
 // Allow requests from the React app
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.options('*', cors()); // Handle preflight



// Appwrite setup
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY); // Needs full DB access

const databases = new Databases(client);

// Register route
app.post("/register", async (req, res) => {
    const { username, password, name } = req.body;

    try {
        const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password securely
        const newUser = {
            username,
            password: hashedPassword,
            name
        };

        // Check if user already exists
        const existingUsers = await databases.listDocuments(DATABASE_ID, USER_COLLECTION_ID, [
            Query.equal('username', username)
        ]);
        if (existingUsers.total > 0) {
            return res.json({ success: false, message: 'User already exists' });
        }

        // Create new user document
        await databases.createDocument(DATABASE_ID, USER_COLLECTION_ID, ID.unique(), newUser);
        return res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.json({ success: false, message: 'Registration failed' });
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const userResult = await databases.listDocuments(DATABASE_ID, USER_COLLECTION_ID, [
            Query.equal('username', username)
        ]);

        if (userResult.total === 0) {
            return res.json({ success: false, message: 'User not found' });
        }

        const storedUser = userResult.documents[0];
        const hashedPassword = storedUser.password;

        // Verify password
        if (!bcrypt.compareSync(password, hashedPassword)) {
            return res.json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: storedUser.$id, username: storedUser.username }, JWT_SECRET, { expiresIn: '2h' });
        return res.json({ success: true, token });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.json({ success: false, message: 'Login failed' });
    }
});



// To get the popular movies
app.get("/movies", async (req, res) => {
    const {endpoint} = req.query; // Get the endpoint from the query parameters
    if (!endpoint) {
        return res.status(400).json({ success: false, message: 'Endpoint query parameter is required' });
    }

    // Fetch movies from the provided endpoint
    try {
        const response = await fetch(endpoint, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${TMDB_API_KEY}`,
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Error fetching movies:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch movies', error: error.message });
    }
});

// recieve the token from the frontend and check if it is valid and send corresponding user data
app.get("/check-login", async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.json({ isLoggedIn: false, user: null });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userResult = await databases.listDocuments(DATABASE_ID, USER_COLLECTION_ID, [
            Query.equal('$id', decoded.id)
        ]);
        if (userResult.total === 0) {
            return res.json({ isLoggedIn: false, user: null });
        }
        return res.json({ isLoggedIn: true, user: userResult.documents[0] });
    } catch (error) {
        console.error('Error checking login status:', error); // Log the error for debugging purposes
        return res.json({ isLoggedIn: false, user: null });
    }
});

app.listen(PORT, () => {
    console.log(`Auth backend running on http://localhost:${PORT}`);
});

export default app; // Export the app for testing or further use