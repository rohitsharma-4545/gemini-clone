import React, { useState } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { useSelector, useDispatch } from 'react-redux';
import {
    createChatroom,
    deleteChatroom,
    setCurrentChatroom,
} from '../../slices/chatSlice';

const Sidebar = ({ setView }) => {
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
                setView && setView('main');
            }, 100);
        } else {
            createNewChat();
            setView && setView('main');
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
        setView && setView('main');
    };

    return (
        <aside className={`sidebar ${extended ? 'extended' : 'collapsed'}`}>
            <div className={`top  ${extended ? '' : 'centered'}`}>
                <div className="menu" onClick={() => setExtended(prev => !prev)}>
                    <img src={assets.menu_icon} alt="Menu Icon" />
                </div>
                <div onClick={handleNewChat} className="new-chat">
                    <img src={assets.plus_icon} alt="Plus Icon" />
                    <p className={`${extended ? 'block' : 'none'}`}>New Chat</p>
                </div>
                {extended ?
                    <div className="recent">
                        <p className="recent-title">Recent</p>
                        {chatrooms.map((room) => (
                            <div
                                key={room.id}
                                className={`recent-entry${room.id === currentChatroomId ? ' active' : ''}`}
                                onClick={() => handleSelect(room.id)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <span style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                    <img src={assets.message_icon} alt="" />
                                    <p className="recent-entry-p">{room.title.slice(0, 18)} ...</p>
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
            <div className={`bottom  ${extended ? '' : 'centered'}`}>
                <div className="bottom-item recent-entry" onClick={() => setView && setView('help')} style={{ cursor: 'pointer' }}>
                    <img src={assets.question_icon} alt="Question Icon" />
                    <p className={`fade ${extended ? 'block' : 'none'}`}>Help</p>
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="History Icon" />
                    <p className={`fade ${extended ? 'block' : 'none'}`}>Activity</p>
                </div>
                <div className="bottom-item recent-entry" onClick={() => setView && setView('settings')} style={{ cursor: 'pointer' }}>
                    <img src={assets.setting_icon} alt="Settings Icon" />
                    <p className={`fade ${extended ? 'block' : 'none'}`}>Settings</p>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
