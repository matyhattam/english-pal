import { FormEvent, useState, useContext } from 'react';
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { ScaleLoader } from 'react-spinners';
import { sessionContext, Messages, Conversation, Conversations } from '../../App';
import { useChatGpt, useGetUser, useAddMessage } from '../../hooks/hooks';
import './Chat.css'

import { createClient } from '@supabase/supabase-js';

const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);

interface TextareaProps {
  formClassName?: string;
  textAreaClassName?: string;
  setConversations: React.Dispatch<React.SetStateAction<Conversations>>;
  currentConv: Conversation;
  setCurrentConv: React.Dispatch<React.SetStateAction<Conversation>>;
  setMessages: React.Dispatch<React.SetStateAction<Messages>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Textarea({ formClassName, textAreaClassName, setConversations, currentConv, setCurrentConv, setMessages, isLoading, setIsLoading }: TextareaProps) {
  const [userMessage, setUserMessage] = useState<string>('');
  const session = useContext(sessionContext);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    setUserMessage(e.target.value);
  }

  async function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>): void {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setUserMessage('');
      await handleSubmit(e);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    setUserMessage('');
    setMessages(messages => [...messages, { id: `${crypto.randomUUID()}`, source: 'user', content: userMessage }]);

    setIsLoading(true);
    const answer = await useChatGpt(userMessage, "you are an english teacher");
    setMessages(messages => [...messages, { id: `${crypto.randomUUID()}`, source: 'teacher', content: answer }]);
    setIsLoading(false);

    if (currentConv !== null) {
      await useAddMessage(currentConv.id, 'user', userMessage);
      await useAddMessage(currentConv.id, 'teacher', answer);

    } else {
      const { data, error } = await supabase.from('conversations').insert({
        name: await useChatGpt(userMessage, "make a short title for this conversation out of the message sent by the user, without quotation marks"),
        user_id: await useGetUser(session),
      }).select();

      setCurrentConv(data[0]);
      setConversations(conversations => [data[0], ...conversations]);

      await useAddMessage(data[0].id, 'user', userMessage);
      await useAddMessage(data[0].id, 'teacher', answer);
    }
  }

  return (
    <div className='textcontainer'>
      <form
        className={formClassName}
        onSubmit={handleSubmit}>
        <textarea
          disabled={isLoading}
          className={textAreaClassName}
          placeholder={isLoading ? 'Let me think...' : "Let's talk!"}
          value={userMessage}
          onChange={handleChange}
          onKeyDown={handleKeyDown} >
        </textarea>
        <button
          type="submit"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}>
          {isLoading ? <ScaleLoader color="hsl(25 5.3% 44.7%)" /> :
            <IoArrowUpCircleOutline
              style={{
                color: "hsl(25 5.3% 44.7%)",
                fontSize: '3em'
              }} />}
        </button>
      </form>
    </div>

  )
}
