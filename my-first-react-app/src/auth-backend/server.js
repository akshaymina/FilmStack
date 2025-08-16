import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Client, Databases, ID } from "node-appwrite";

const PORT = 5000; // Port for the auth backend
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USER_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const JWT_SECRET = import.meta.env.VITE_SECRET;
const API_KEY = import.meta.env.VITE_APPWRITE_API_KEY; 

const app = express();
app.use(cors());
app.use(express.json());

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
        const user = username;
        const nameField = name;
        const newUser = {
            username: user,
            password: hashedPassword,
            name: nameField
        };

        // Check if user already exists
        const existingUsers = await database.listDocuments(DATABASE_ID, USER_COLLECTION_ID, [
            Query.equal('username', username)
        ]);
        if (existingUsers.total > 0) {
            return { success: false, message: 'User already exists' };
        }

        // Create new user document
        await database.createDocument(DATABASE_ID, USER_COLLECTION_ID, ID.unique(), newUser);
        return { success: true, message: 'User registered successfully' };
    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, message: 'Registration failed' };
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await database.listDocuments(DATABASE_ID, USER_COLLECTION_ID, [
            Query.equal('username', username)
        ]);

        if (user.total === 0) {
            return { success: false, message: 'User not found' };
        }

        const storedUser = user.documents[0];
        const hashedPassword = storedUser.password;
        const plainPassword = password;

        // Verify password
        if (!bcrypt.compareSync(plainPassword, hashedPassword)) {
            return { success: false, message: 'Invalid credentials' };
        }

        // Generate JWT token
        const token = jwt.sign({ id: storedUser.$id, username: storedUser.username }, JWT_SECRET, { expiresIn: '2h' });
        return { success: true, token };
    } catch (error) {
        console.error('Error logging in user:', error);
        return { success: false, message: 'Login failed' };
    }
});

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Protected route to check login status
app.get("/check-login", authenticateJWT, (req, res) => {
    res.json({ isLoggedIn: true, user: req.user });
});

app.listen(5000, () => console.log("Auth server running on port 5000"));
