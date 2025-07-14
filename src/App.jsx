import React, { useEffect } from 'react';
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Main from "./components/Main/Main.jsx";
import Auth from "./components/Auth.jsx";
import Help from "./components/Help.jsx";
import Settings from "./components/Settings.jsx";
import { useSelector } from 'react-redux';

const App = () => {
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const darkMode = useSelector(state => state.ui.darkMode);
    const [view, setView] = React.useState('main'); // 'main', 'help', 'settings'

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
            <Sidebar setView={setView} />
            {view === 'main' && <Main />}
            {view === 'help' && (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <Help />
                </div>
            )}
            {view === 'settings' && (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                    <Settings onLogout={() => setView('main')} />
                </div>
            )}
        </>
    )
}

export default App;