import { Client, Databases, Query, ID } from 'appwrite';


const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const USER_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID;
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const SECRET = import.meta.env.VITE_SECRET; // Use a secure secret key in production


export const updateSearchCount = async ({searchTerm, movie}) => {
    if (!searchTerm) {
        console.warn("Search term is empty, not updating search count.");
        return;
    }

    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(PROJECT_ID);

    const database = new Databases(client);

    try {
        const existingDocuments = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm)
        ]);

        if (existingDocuments.total > 0) {
            const documentId = existingDocuments.documents[0].$id;
            const newCount = existingDocuments.documents[0].count + 1;

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, {
                count: newCount,
            });
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
                movie_id: movie.id
            });
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
}

export const getTrendingMovies = async () => {
    const client = new Client()
        .setEndpoint(APPWRITE_ENDPOINT)
        .setProject(PROJECT_ID);

    const database = new Databases(client);

    try {
        const trendingMovies = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc('count'),
            Query.limit(5)
        ]);
        return trendingMovies.documents;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
}

export const registerUser = async (username, password, name) => {
    const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, name })
    });
    return res.json();
}

export const loginUser = async (username, password) => {
    const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return res.json();
}

