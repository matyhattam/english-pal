import { FormEvent, useState } from 'react';
import { IoArrowUpCircleOutline } from "react-icons/io5";
import './Chat.css'

import OpenAI from "openai";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: OPENAI_API_KEY
});

interface TextareaProps {
  formClassName?: string;
  textAreaClassName?: string;
}

export function Textarea({ formClassName, textAreaClassName, setMessages }: TextareaProps) {
    const [userMessage, setUserMessage] = useState<string>('');

    function handleChange(e: ChangeEvent<HTMLTextAreaElement>): void {
      setUserMessage(e.target.value);
    }

    async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise<void> {
      e.preventDefault();
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an english teacher" },
          {
            role: "user",
            content: userMessage,
          },
        ],
      });
      setMessages(messages => [...messages, { source: 'user', content: userMessage }]);
      setMessages(messages => [...messages, { source: 'teacher', content: completion.choices[0].message.content }]);
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
