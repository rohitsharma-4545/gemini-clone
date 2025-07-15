import React, { useEffect } from 'react';
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Main from "./components/Main/Main.jsx";
import Auth from "./components/Auth.jsx";
import { useSelector } from 'react-redux';

const App = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const darkMode = useSelector(state => state.ui.darkMode);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    if (!isAuthenticated) return <Auth />;

    return (
        <>
            <Sidebar />
            <Main />
        </>
    )
}


export default App;