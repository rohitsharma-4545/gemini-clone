import React, { useEffect, useRef, useState } from 'react';
import './Main.css';
import { assets } from "../../assets/assets.js";
import { useSelector, useDispatch } from 'react-redux';
import {
    addMessage,
    updateChatroomTitle,
} from '../../slices/chatSlice';

const AI_THINK_DELAY = 1200; // ms
const PAGE_SIZE = 20;

// Dummy generator for old messages
function generateDummyMessages(count, beforeId = 0) {
    return Array.from({ length: count }, (_, i) => ({
        id: beforeId - (i + 1),
        sender: i % 2 === 0 ? 'user' : 'ai',
        text: i % 2 === 0 ? `Old user message #${i + 1}` : `Old AI message #${i + 1}`,
        timestamp: new Date(Date.now() - (i + 1) * 60000).toISOString(),
    })).reverse();
}

const Main = () => {
    const dispatch = useDispatch();
    const chatrooms = useSelector(state => state.chat.chatrooms);
    const currentChatroomId = useSelector(state => state.chat.currentChatroomId);
    const messages = useSelector(state => state.chat.messages[currentChatroomId] || []);
    const [input, setInput] = useState('');
    const [aiTyping, setAiTyping] = useState(false);
    const [aiLoadingId, setAiLoadingId] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const resultRef = useRef(null);
    const topRef = useRef(null);
    const [rows, setRows] = useState(1);

    // Find current chatroom
    const currentRoom = chatrooms.find(r => r.id === currentChatroomId);

    // Infinite scroll: load more messages when scrolled to top
    useEffect(() => {
        const handleScroll = () => {
            if (!resultRef.current || loadingMore || !hasMore) return;
            if (resultRef.current.scrollTop === 0) {
                setLoadingMore(true);
                setTimeout(() => {
                    // Simulate fetching older messages
                    const dummy = generateDummyMessages(PAGE_SIZE, messages.length ? messages[0].id : 0);
                    if (dummy.length < PAGE_SIZE) setHasMore(false);
                    dummy.forEach(msg => {
                        dispatch(addMessage({ chatroomId: currentChatroomId, message: msg }));
                    });
                    setPage(p => p + 1);
                    setLoadingMore(false);
                }, 800);
            }
        };
        const ref = resultRef.current;
        if (ref) ref.addEventListener('scroll', handleScroll);
        return () => { if (ref) ref.removeEventListener('scroll', handleScroll); };
    }, [resultRef, loadingMore, hasMore, messages, currentChatroomId, dispatch]);

    useEffect(() => {
        const updateRows = () => {
            if (window.innerWidth <= 600) {
                setRows(2);
            } else {
                setRows(1);
            }
        };
        updateRows();
        window.addEventListener('resize', updateRows);
        return () => window.removeEventListener('resize', updateRows);
    }, []);

    useEffect(() => {
        if (resultRef.current) {
            resultRef.current.scrollTop = resultRef.current.scrollHeight;
        }
    }, [messages, aiTyping]);

    // Simulate AI response
    const simulateAIResponse = (userText, chatroomId) => {
        setAiTyping(true);
        setAiLoadingId(Date.now());
        setTimeout(() => {
            setAiTyping(false);
            setAiLoadingId(null);
            // Simple AI echo/variation for demo
            const aiText = `Gemini: ${userText.split('').reverse().join('')}`;
            dispatch(addMessage({
                chatroomId,
                message: {
                    id: Date.now() + 1,
                    sender: 'ai',
                    text: aiText,
                    timestamp: new Date().toISOString(),
                },
            }));
        }, AI_THINK_DELAY);
    };

    // Send message
    const handleSend = () => {
        if ((!input.trim() && !image) || !currentChatroomId) return;
        // If this is the first user message, update chatroom title
        if (messages.length === 0 && currentRoom) {
            dispatch(updateChatroomTitle({
                chatroomId: currentRoom.id,
                title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
            }));
        }
        const userMsg = {
            id: Date.now(),
            sender: 'user',
            text: input,
            timestamp: new Date().toISOString(),
            image: imagePreview,
        };
        dispatch(addMessage({
            chatroomId: currentChatroomId,
            message: userMsg,
        }));
        setInput('');
        setImage(null);
        setImagePreview(null);
        // Simulate AI response after a delay
        simulateAIResponse(input, currentChatroomId);
    };

    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    return (
        <main className="main">
            <nav className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" />
            </nav>
            <div className="main-container">
                {messages.length === 0 ? (
                    <>
                        <div className="greet text-black">
                            <p><span>Hello, Dev</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card"
                                onClick={() => setInput("Suggest beautiful places to see on an upcoming road trip")}>
                                <p>Suggest beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card"
                                onClick={() => setInput("Briefly summarize this concept: urban planning")}>
                                <p>Briefly summarize this concept: urban planning</p>
                                <img src={assets.bulb_icon} alt="" />
                            </div>
                            <div className="card"
                                onClick={() => setInput("Brainstorm team bonding activities for our work retreat")}>
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => setInput("Tell me about React js and React native")}>
                                <p>Tell me about React js and React native</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className='result' ref={resultRef} style={{ overflowY: 'auto', maxHeight: '60vh', minHeight: 200 }}>
                        {hasMore && (
                            <div style={{ textAlign: 'center', padding: 8, color: '#888' }}>
                                {loadingMore ? 'Loading more...' : 'Scroll up to load more'}
                            </div>
                        )}
                        {messages.map((msg) => (
                            <div key={msg.id} className={`result-title ${msg.sender === 'user' ? 'user' : 'ai'}`} style={{ marginBottom: 8 }}>
                                <img src={msg.sender === 'user' ? assets.user_icon : assets.gemini_icon} alt="" />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <p>{msg.text}</p>
                                    {msg.image && (
                                        <img src={msg.image} alt="uploaded" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, marginTop: 4 }} />
                                    )}
                                </div>
                                <span style={{ fontSize: '0.8em', color: '#888', marginLeft: 8 }}>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                            </div>
                        ))}
                        {aiTyping && (
                            <div className="result-title ai" style={{ marginBottom: 8 }}>
                                <img src={assets.gemini_icon} alt="" />
                                <div className="skeleton-loader" style={{ width: '120px', height: '18px', background: '#eee', borderRadius: 4 }} />
                                <span style={{ fontSize: '0.8em', color: '#888', marginLeft: 8 }}>Gemini is typing...</span>
                            </div>
                        )}
                    </div>
                )}
                <div className="main-bottom">
                    <div className="search-box">
                        <textarea rows={rows} onChange={(e) => setInput(e.target.value)}
                            onKeyUp={(e) => {
                                if (e.key === 'Enter') {
                                    handleSend();
                                }
                            }}
                            value={input}
                            type="text"
                            placeholder="Enter a prompt here"
                            disabled={aiTyping}
                        />
                        <div className="icon-container">
                            <label style={{ cursor: 'pointer' }}>
                                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} disabled={aiTyping} />
                                <img src={assets.gallery_icon} alt="Upload" />
                            </label>
                            <button><img src={assets.mic_icon} alt="" /></button>
                            <button type="submit" onClick={handleSend} disabled={aiTyping}><img src={assets.send_icon} alt="" /></button>
                        </div>
                        {imagePreview && (
                            <div style={{ marginTop: 8, display: 'flex', alignItems: 'center' }}>
                                <img src={imagePreview} alt="preview" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 6, marginRight: 8 }} />
                                <button onClick={removeImage} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
                            </div>
                        )}
                    </div>
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people, so double-check its responses.
                        <a href="#">Your privacy and Gemini Apps</a>
                    </p>
                </div>
            </div>
        </main>
    );
}

export default Main;
