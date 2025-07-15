import React, { useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { useSelector, useDispatch } from 'react-redux';
import {
    createChatroom,
    deleteChatroom,
    setCurrentChatroom,
} from '../../slices/chatSlice';
import Settings from '../Settings.jsx';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const chatrooms = useSelector(state => state.chat.chatrooms);
    const currentChatroomId = useSelector(state => state.chat.currentChatroomId);
    const dispatch = useDispatch();

    // Add new chatroom with default title
    const handleNewChat = () => {
        if (!extended) {
            setExtended(true);
            setTimeout(() => {
                createNewChat();
            }, 100);
        } else {
            createNewChat();
        }
    };

    // Extracted chat creation logic for reuse
    const createNewChat = () => {
        const base = 'New Chat';
        let num = 1;
        let title = base;
        const titles = chatrooms.map(r => r.title);
        while (titles.includes(title)) {
            title = `${base} ${num}`;
            num++;
        }
        dispatch(createChatroom(title));
    };

    // Delete chatroom
    const handleDelete = (id) => {
        if (window.confirm('Delete this chatroom?')) {
            dispatch(deleteChatroom(id));
        }
    };

    // Set current chatroom
    const handleSelect = (id) => {
        dispatch(setCurrentChatroom(id));
    };

    return (
        <aside className={`sidebar ${extended ? 'extended' : 'collapsed'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white`}>
            <div className={`top  ${extended ? '' : 'centered'}`}>
                <div className="menu bg-gray-100 dark:bg-gray-800" onClick={() => setExtended(prev => !prev)}>
                    <img src={assets.menu_icon} alt="Menu Icon" className="menu-icon dark:filter dark:invert" />
                </div>
                <div onClick={handleNewChat} className="new-chat bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white">
                    <img src={assets.plus_icon} alt="Plus Icon" className="dark:filter dark:invert" />
                    <p className={`${extended ? 'block' : 'none'} text-gray-900 dark:text-white`}>New Chat</p>
                </div>
                {extended ?
                    <div className="recent bg-white dark:bg-gray-900">
                        <p className="recent-title text-gray-700 dark:text-gray-200">Recent</p>
                        {chatrooms.map((room) => (
                            <div
                                key={room.id}
                                className={`recent-entry${room.id === currentChatroomId ? ' active' : ''} bg-transparent dark:hover:bg-gray-800 text-gray-900 dark:text-white`}
                                onClick={() => handleSelect(room.id)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <img src={assets.message_icon} alt="" className="dark:filter dark:invert" />
                                    <p className="recent-entry-p text-gray-900 dark:text-white">{room.title.slice(0, 18)} ...</p>
                                </span>
                                <button
                                    className="delete-chat-btn"
                                    style={{ marginLeft: 8, color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}
                                    title="Delete chatroom"
                                    onClick={e => { e.stopPropagation(); handleDelete(room.id); }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                    : null
                }
            </div>
            <div className={`bottom  ${extended ? '' : 'centered'} `}>
                <div className="bottom-item recent-entry text-gray-900 dark:text-white" style={{ cursor: 'pointer' }}>
                    {extended ? (
                        <Settings onLogout={() => { }} />
                    ) : (
                        <div onClick={() => setExtended(true)}>
                            <img src={assets.setting_icon} alt="Settings Icon" className="dark:filter dark:invert" />
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;