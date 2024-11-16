import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { SideBar } from './components/SideBar/SideBar'
import { Chat } from './components/Chat/Chat'
import './App.css'
import { createClient } from '@supabase/supabase-js';
const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);

export interface Messages {
  id: string;
  created_at: Date;
  source: string;
  content: string;
}
export interface Conversations {
  id: string;
  created_at: Date;
  name: string;
}

export interface ShowSideBar {
  display: boolean;
}

export interface CurrentConv {
  conversation: Conversations;
}

function App() {
  const [showSideBar, setShowSideBar] = useState<boolean>(true)
  const [conversations, setConversations] = useState([]);
  const [currentConv, setCurrentConv] = useState('');
  const [messages, setMessages] = useState<Messages>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (!data.session) {
        navigate("/login")
      }
    }
    fetchSession();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data, error } = await supabase
        .from('conversations')
        .select(
          `id,
          name,
          created_at`)
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
  }, []);


  function toggleSideBar() {
    setShowSideBar(!showSideBar);
    console.log(showSideBar)
  };

  return (
    <>
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
          currentConv={currentConv}
          messages={messages}
          setMessages={setMessages}>
        </Chat>
      </div>
    </>
  )
}

export default App
