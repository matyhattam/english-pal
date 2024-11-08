import { createClient } from '@supabase/supabase-js';
import { Conversations, Messages, CurrentConv } from '../../App';
import './SideBar.css'

const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);

interface SideBarProps {
  className?: string;
  conversations: Conversations[];
  currentConv: Conversations[];
  setCurrentConv: React.Dispatch<React.SetStateAction<CurrentConv>>;
  setMessages: React.Dispatch<React.SetStateAction<Messages>>;
}

export function SideBar({ className, conversations, currentConv, setCurrentConv, setMessages }: SideBarProps) {
  async function getMessages(conversation) {
    if (conversation.id != currentConv.id) {
      setCurrentConv(conversation);
      setMessages([]);

      const { data, error } = await supabase
        .from('messages')
        .select(
          `id, 
          source, 
          content, conversations!inner(id)`)
        .eq('conversations.id', conversation.id);

      data.map(fetchedMessage => {
        setMessages(messages => {
          if (!messages.some(message => message.id === fetchedMessage.id)) {
            return [...messages, fetchedMessage];
          }

          return messages;
        })
      });
    }
  };

  return <div className={className}>
    {conversations.map(conversation =>
      <div key={conversation.id}
        className='sidebaritem'
        onClick={() => { getMessages(conversation) }}
      >{conversation.name}</div>)}
  </div>
}
