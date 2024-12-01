import { useState, useEffect, createContext } from 'react'
import { useNavigate } from "react-router-dom";
import { SideBar } from './components/SideBar/SideBar'
import { Chat } from './components/Chat/Chat'
import './App.css'
import { createClient } from '@supabase/supabase-js';
const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);
export const sessionContext = createContext(null);

export type Message = {
  id: string;
  created_at: Date;
  source: string;
  content: string;
}

export type Messages = Message[] | null

export type Conversation = {
  id: string;
  created_at: Date;
  name: string;
} | null

export type Conversations = Conversation[] | null;

export type CurrentConv = Conversation | null


function App() {
  const [showSideBar, setShowSideBar] = useState<boolean>(true)
  const [conversations, setConversations] = useState<Conversations>([]);
  const [currentConv, setCurrentConv] = useState<CurrentConv>(null);
  const [messages, setMessages] = useState<Messages>([]);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!data.session) {
        navigate("/login")
      } else {
        setSession(data.session)
      }
    }
    fetchSession();
  }, []);

  useEffect(() => {
    if (session) {
      const fetchConversations = async () => {
        const { data, error } = await supabase
          .from('conversations')
          .select(
            `id,
          name,
          created_at, user!inner(id)`)
          .eq('user.auth_id', session.user.id)
          .order('created_at', { ascending: false });

        data.map(fetchedConversation => {
          setConversations(conversations => {
            if (!conversations.some(conversation => conversation.id === fetchedConversation.id)) {
              return [...conversations, fetchedConversation];
            }
            return conversations;
          })
        });
      };
      fetchConversations();
    }
  }, [session]);

  function toggleSideBar() {
    setShowSideBar(!showSideBar);
  };

  return (
    <>
      <sessionContext.Provider value={session}>
        <div className='container'>
          {showSideBar && (
            <SideBar className='sidebar'
              conversations={conversations}
              currentConv={currentConv}
              setCurrentConv={setCurrentConv}
              setMessages={setMessages}>
            </SideBar>)}
          <Chat className='chat'
            toggleSideBar={toggleSideBar}
            setConversations={setConversations}
            currentConv={currentConv}
            setCurrentConv={setCurrentConv}
            messages={messages}
            setMessages={setMessages}>
          </Chat>
        </div>
      </sessionContext.Provider>
    </>
  )
}

export default App
