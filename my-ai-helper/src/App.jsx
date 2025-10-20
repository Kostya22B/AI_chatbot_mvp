import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Client Setup ---
// ВАЖНО: Переместите эти ключи в переменные окружения (.env.local) для безопасности в реальном проекте
// VITE_SUPABASE_URL=...
// VITE_SUPABASE_ANON_KEY=...
const supabaseUrl = 'https://mmgcxilliiwuskuiiwqf.supabase.co'; // Замените на URL вашего проекта или import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tZ2N4aWxsaWl3dXNrdWlpd3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1OTQ5MzMsImV4cCI6MjA3NjE3MDkzM30.JIUMJzkV08K_ziQzVSyaqvUF_REZpGOAlyH7_C8tSvw'; // Замените на ваш ключ или import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Компоненты ---

const AuthScreen = ({ t }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [university, setUniversity] = useState('');
    const [universities, setUniversities] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUniversities = async () => {
            const { data, error } = await supabase.from('universities').select('id, name');
            if (error) {
                console.error('Error fetching universities:', error);
            } else {
                setUniversities(data);
            }
        };
        fetchUniversities();
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!isLogin && !university) {
            setError(t['auth.error.selectUniversity']);
            return;
        }

        let authError;
        if (isLogin) {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            authError = error;
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { university_id: university }
                }
            });
            if (!error) {
                setMessage(t['auth.signupSuccess']);
            }
            authError = error;
        }

        if (authError) {
            setError(authError.message);
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-gray-200 dark:bg-gray-800">
            <div className="w-full max-w-md m-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border dark:border-gray-700">
                <h1 className="text-3xl font-bold text-center mb-6 text-indigo-600 dark:text-indigo-400">{t['app.title']}</h1>
                <form onSubmit={handleAuth} className="space-y-6">
                    <h2 className="text-2xl font-semibold text-center text-gray-700 dark:text-gray-200">{isLogin ? t['auth.loginTitle'] : t['auth.signupTitle']}</h2>
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 mt-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t['auth.password']}</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 mt-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                    </div>
                    {!isLogin && (
                        <div>
                            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">{t['auth.university']}</label>
                            <select value={university} onChange={(e) => setUniversity(e.target.value)} required className="w-full p-3 mt-1 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                                <option value="">{t['auth.selectPlaceholder']}</option>
                                {universities.map(uni => <option key={uni.id} value={uni.id}>{uni.name}</option>)}
                            </select>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && <p className="text-green-500 text-sm">{message}</p>}
                    <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {isLogin ? t['auth.loginButton'] : t['auth.signupButton']}
                    </button>
                    <p className="text-center text-sm text-gray-500">
                        {isLogin ? t['auth.noAccount'] : t['auth.hasAccount']}
                        <button type="button" onClick={() => setIsLogin(!isLogin)} className="font-semibold text-indigo-500 hover:underline ml-1">
                            {isLogin ? t['auth.signupLink'] : t['auth.loginLink']}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

const ChatSidebar = ({ t, user, chats, activeChatId, onNewChat, onLogout }) => {
    const handleDelete = async (chatId) => {
        if (confirm(t['sidebar.deleteConfirm'])) {
            await supabase.from('chats').delete().eq('id', chatId);
        }
    };

    return (
        <div className="sidebar absolute md:relative z-20 w-80 md:w-1/4 bg-gray-200 dark:bg-gray-800 p-4 flex flex-col h-full border-r dark:border-gray-700 md:transform-none">
            <div className="flex-shrink-0 mb-4">
                <button onClick={onNewChat} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                    {/* Plus Icon */}
                    {t['sidebar.newChat']}
                </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2 space-y-2 chat-history">
                {chats.map(chat => (
                    <div key={chat.id} className={`flex items-center justify-between p-3 my-1 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors cursor-pointer ${chat.id === activeChatId ? 'bg-indigo-200 dark:bg-indigo-800' : ''}`}>
                        <a href={`#${chat.id}`} className="truncate flex-1">{chat.title || t['sidebar.newChatTitle']}</a>
                        <button onClick={() => handleDelete(chat.id)} className="ml-3 text-red-500 hover:text-red-700 font-bold opacity-60 hover:opacity-100">✕</button>
                    </div>
                ))}
            </div>
            <div className="flex-shrink-0 mt-4 border-t border-gray-300 dark:border-gray-600 pt-4 space-y-2">
                <p className="text-sm text-center truncate text-gray-600 dark:text-gray-400">{user?.email}</p>
                <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 bg-red-600 text-white p-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                    {/* Logout Icon */}
                    {t['sidebar.logout']}
                </button>
            </div>
        </div>
    );
}

const ChatWindow = ({ t, activeChat, universityName, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeChat?.messages]);

    const handleSend = () => {
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };
    
    if (!activeChat) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center text-center p-4">
                <h2 className="text-3xl font-bold mb-2">{t['chat.initialGreeting']} {universityName}.</h2>
                <p className="text-lg text-gray-500 dark:text-gray-400">{t['chat.initialPrompt']}</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
            <header className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                 <h1 className="text-2xl font-bold">{activeChat.title || t['sidebar.newChatTitle']}</h1>
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container">
                {activeChat.messages?.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
             <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* Model selector can be added here */}
                    <input value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()} type="text" placeholder={t['chat.inputPlaceholder']} className="w-full p-3 pr-12 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition" />
                    <button onClick={handleSend} disabled={!message.trim()} className="px-4 text-indigo-600 dark:text-indigo-400 disabled:opacity-50">
                        {/* Send Icon */}
                        {t['chat.sendButton']}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ChatScreen = ({ t, user }) => {
    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [universityName, setUniversityName] = useState('');
    
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            setActiveChatId(hash);
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            // Fetch chats
            const { data: chatData } = await supabase.from('chats').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
            setChats(chatData || []);

            // Fetch profile
            const { data: profileData } = await supabase.from('profiles').select('universities(name)').eq('id', user.id).single();
            setUniversityName(profileData?.universities?.name || 'Student');
        };
        
        fetchUserData();

        const chatSubscription = supabase
            .channel('public:chats')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chats' }, () => fetchUserData())
            .subscribe();

        return () => supabase.removeChannel(chatSubscription);
    }, [user]);

    const handleSendMessage = async (text) => {
        const userMessage = { sender: 'user', text };
        
        let currentChatId = activeChatId;
        let messages = [];

        if (currentChatId) {
            const existingChat = chats.find(c => c.id === currentChatId);
            messages = [...(existingChat.messages || []), userMessage];
            await supabase.from('chats').update({ messages }).eq('id', currentChatId);
        } else {
            messages = [userMessage];
            const { data } = await supabase.from('chats').insert({ user_id: user.id, title: text.substring(0, 30), messages }).select().single();
            window.location.hash = data.id;
            currentChatId = data.id;
        }

        // Simulate AI response
        setTimeout(async () => {
            const aiResponse = { sender: 'ai', text: t['chat.aiResponse'] };
            const finalMessages = [...messages, aiResponse];
            await supabase.from('chats').update({ messages: finalMessages }).eq('id', currentChatId);
        }, 500);
    };

    const handleNewChat = () => window.location.hash = '';

    const handleLogout = async () => await supabase.auth.signOut();

    const activeChat = chats.find(chat => chat.id === activeChatId);

    return (
        <div className="w-full h-full flex">
            <ChatSidebar t={t} user={user} chats={chats} activeChatId={activeChatId} onNewChat={handleNewChat} onLogout={handleLogout} />
            <ChatWindow t={t} activeChat={activeChat} universityName={universityName} onSendMessage={handleSendMessage} />
        </div>
    );
};


// --- Главный компонент App ---

function App({ t }) {
    const [session, setSession] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
        return (
             <div className="w-full h-screen flex items-center justify-center p-4 bg-gray-200">
                <div className="w-full max-w-lg m-auto bg-red-100 rounded-2xl shadow-xl p-8 border border-red-500 text-center">
                    <h1 className="text-2xl font-bold text-red-800 mb-4">{t['config.errorTitle']}</h1>
                    <p className="text-red-700">{t['config.errorMessage']}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative flex h-screen w-screen antialiased overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {!session ? <AuthScreen t={t} /> : <ChatScreen t={t} user={session.user} />}
        </div>
    );
}

export default App;
