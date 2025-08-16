import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Base url of server
    const API_BASE_URL = 'http://localhost:5000'; // Adjust as necessary

    const checkLoginStatus = async () => {
        try {
            // Replace with your actual API endpoint and add Authorization header if needed
            const token = localStorage.getItem('token');
            if (!token) {
                setIsLoggedIn(false);
                setUser(null);
                setLoading(false);
                return;
            }
            const response = await fetch(`${API_BASE_URL}/check-login`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setIsLoggedIn(data.isLoggedIn);
            setUser(data.user);
        } catch (error) {
            setIsLoggedIn(false);
            setUser(null);
            console.error('Error checking login status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUser(null);
        window.location.reload();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <svg width="67" height="41" viewBox="0 0 67 41" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M45.0353 4.66312C45.8331 3.77669 46.7195 3.04539 47.6281 2.46921C49.2236 1.47198 50.9079 0.940125 52.6364 0.940125V15.411C51.3732 11.0232 48.6475 7.25591 45.0353 4.66312ZM66.5533 40.9401H15.2957C6.87461 40.9401 0.0712891 34.1146 0.0712891 25.7157C0.0712891 17.6714 6.3206 11.0675 14.232 10.5135V0.940125C16.0048 0.940125 17.7555 1.44982 19.3954 2.46921C20.304 3.02323 21.1904 3.75453 21.9882 4.59663C25.2458 2.31409 29.1904 0.984446 33.4674 0.984446C33.4674 10.2254 30.1433 20.9734 19.3289 20.9955H33.3566C32.9577 19.2005 31.3178 17.8709 29.3677 17.8487H37.5228C35.5727 17.8487 33.9328 19.2005 33.5339 21.0177H46.6087C49.2236 21.0177 51.8164 21.5274 54.2541 22.5468C56.6696 23.544 58.8857 25.0288 60.725 26.8681C62.5865 28.7296 64.0491 30.9235 65.0464 33.339C66.0436 35.7324 66.5533 38.3252 66.5533 40.9401ZM22.8525 10.7795C23.1849 11.6437 24.0713 12.6188 25.3123 13.3279C26.5533 14.0371 27.8386 14.3252 28.7472 14.1922C28.4148 13.3279 27.5284 12.3529 26.2874 11.6437C25.0464 10.9346 23.761 10.6465 22.8525 10.7795ZM41.5117 13.3279C40.2707 14.0371 38.9854 14.3252 38.0768 14.1922C38.4092 13.3279 39.2957 12.3529 40.5367 11.6437C41.7777 10.9346 43.063 10.6465 43.9716 10.7795C43.6613 11.6437 42.7527 12.6188 41.5117 13.3279Z" fill="#283841"></path>
</svg>
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Film Stack</span>
                </a>
                {isLoggedIn ? (
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-5 rtl:space-x-reverse">
                        <span className="text-gray-700 dark:text-gray-400">Welcome, {user.username}</span>
                        <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Logout</button>
                    </div>
                ) : (
                    <div className="flex items-center md:order-2 space-x-5 md:space-x-5 rtl:space-x-reverse">
                        <Link to="/login" className="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Login</Link>
                        <Link to="/register" className="text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Register</Link>    
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavBar;