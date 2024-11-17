import { FormEvent, useState, useContext } from 'react';
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { sessionContext } from '../../App';
import { useChatGpt, useGetUser, useAddMessage } from '../../hooks/hooks';
import './Chat.css'

import { createClient } from '@supabase/supabase-js';

const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);

interface TextareaProps {
  formClassName?: string;
  textAreaClassName?: string;
}

export function Textarea({ formClassName, textAreaClassName, setConversations, currentConv, setCurrentConv, setMessages }: TextareaProps) {
  const [userMessage, setUserMessage] = useState<string>('');
  const session = useContext(sessionContext);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
    setUserMessage(e.target.value);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    setMessages(messages => [...messages, { source: 'user', content: userMessage }]);

    const answer = await useChatGpt(userMessage, "you are an english teacher");
    setMessages(messages => [...messages, { source: 'teacher', content: answer }]);

    if (currentConv !== null) {
      useAddMessage(currentConv.id, 'user', userMessage);
      useAddMessage(currentConv.id, 'teacher', answer);

    } else {
      const { data, error } = await supabase.from('conversations').insert({
        name: await useChatGpt(userMessage, "make a short title for this conversation out of the message sent by the user, without quotation marks"),
        user_id: await useGetUser(session),
      }).select();

      setCurrentConv(data);
      setConversations(conversations => [data[0], ...conversations]);

      useAddMessage(data[0].id, 'user', userMessage);
      useAddMessage(data[0].id, 'teacher', answer);
    }

    setUserMessage('');
  }

  return (
    <form
      className={formClassName}
      onSubmit={handleSubmit}>
      <textarea
        className={textAreaClassName}
        placeholder='Message English Pal'
        value={userMessage}
        onChange={handleChange}>
      </textarea>
      <button
        type="submit"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0
        }}>
        <IoArrowUpCircleOutline
          style={{
            color: "hsl(25 5.3% 44.7%)",
            fontSize: '3em'
          }}
        />
      </button>
    </form>
  )
}
