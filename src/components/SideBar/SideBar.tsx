import { useContext } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Conversations, Messages } from '../../App';
import './SideBar.css'
import { sessionContext } from '../../App';
import { useGetUser } from '../../hooks/hooks';
const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);

interface SideBarProps {
  className?: string;
  conversations: Conversations[];
  currentConv: Conversations[];
  setCurrentConv: React.Dispatch<React.SetStateAction<Conversations>>;
  setMessages: React.Dispatch<React.SetStateAction<Messages>>;
}

export function SideBar({ className, conversations, currentConv, setCurrentConv, setMessages }: SideBarProps) {
  const session = useContext(sessionContext);

  async function getMessages(conversation: Conversations) {
    setCurrentConv(conversation);
    setMessages([]);

    const { data, error } = await supabase
      .from('messages')
      .select(
        `id, 
          source, 
          content,
          conversations!inner(id)`)
      .eq('conversation_id', conversation.id)
      .eq('conversations.user_id', await useGetUser(session))
      .order('created_at', { ascending: true });

    data.map(fetchedMessage => {
      setMessages(messages => {
        if (!messages.some(message => message.id === fetchedMessage.id)) {
          return [...messages, fetchedMessage];
        }
        return messages;
      })
    });
  };

  return (
    <div className={className}>
      {conversations.map(conversation =>
        <div key={conversation.id}
          className={currentConv ? currentConv.id === conversation.id ? 'sidebaritem selected' : 'sidebaritem' : 'sidebaritem'}
          onClick={() => { getMessages(conversation) }}>{conversation.name}
        </div>)}
    </div>
  )
}
