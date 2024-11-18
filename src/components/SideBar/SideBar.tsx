import { useContext, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Conversations, Messages } from '../../App';
import './SideBar.css'
import { sessionContext } from '../../App';
import { useGetUser } from '../../hooks/hooks';
import { FiSearch } from "react-icons/fi";
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
  const [search, setSearch] = useState('');

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

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    setSearch(e.target.value)
  };

  return (
    <div className={className}>
      <div className='searchbar'>
        <FiSearch style={{
          color: "hsl(25 5.3% 44.7%)",
        }}
        />
        <input className='input'
          type="text"
          placeholder='Search'
          value={search}
          onChange={handleChange}
        />
      </div>
      <div className='sidebarlist'>
        {conversations.filter((item: Conversations) => item.name.toLowerCase().includes(search.toLowerCase()))
          .map(conversation =>
            <div key={conversation.id}
              className={currentConv ? currentConv.id === conversation.id ? 'sidebaritem selected' : 'sidebaritem' : 'sidebaritem'}
              onClick={() => { getMessages(conversation) }}>{conversation.name}
            </div>)}
      </div>
    </div>
  )
}
