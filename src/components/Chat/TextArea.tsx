import { FormEvent, useState, useContext } from 'react';
import { IoArrowUpCircleOutline } from "react-icons/io5";
import { sessionContext } from '../../App';
import './Chat.css'

import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: OPENAI_API_KEY
});

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

  async function useGetUser() {
    const { data, error } = await supabase
      .from('user')
      .select('id')
      .eq('auth_id', session.user.id);

    return data[0].id
  }

  async function useAskChatGpt(userMessage, context) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: context },
        {
          role: "user",
          content: userMessage,
        },
      ],
    });
    return completion.choices[0].message.content;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    const answer = await useAskChatGpt(userMessage, "you are an english teacher");

    setMessages(messages => [...messages, { source: 'user', content: userMessage }]);
    setMessages(messages => [...messages, { source: 'teacher', content: answer }]);

    if (currentConv !== null) {
      await supabase.from('messages').insert({
        conversation_id: currentConv.id,
        source: 'user',
        content: userMessage,
      });
      await supabase.from('messages').insert({
        conversation_id: currentConv.id,
        source: 'teacher',
        content: answer,
      });

    } else {
      const { data, error } = await supabase.from('conversations').insert({
        name: await useAskChatGpt(userMessage, "make a short title for this conversation out of the message sent by the user, without quotation marks"),
        user_id: await useGetUser(),
      }).select();

      setCurrentConv(data);
      setConversations(conversations => [data[0], ...conversations]);

      console.log(data[0])
      await supabase.from('messages').insert({
        conversation_id: data[0].id,
        source: 'user',
        content: userMessage,
      });
      await supabase.from('messages').insert({
        conversation_id: data[0].id,
        source: 'teacher',
        content: answer,
      });
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
