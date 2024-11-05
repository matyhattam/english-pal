import { FormEvent, ReactNode, useRef, useEffect, useState } from 'react';
import { FiSidebar } from "react-icons/fi";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import './Chat.css'

import OpenAI from "openai";
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: OPENAI_API_KEY
});
let dummyMessages = [
  { source: 'user', content: 'Magna enim excepteur mollit nostrud nisi voluptate ut do dolor quis et ea irure.' },
  { source: 'teacher', content: 'Magna enim excepteur mollit nostrud nisi voluptate ut do dolor quis et ea irure.' },
  { source: 'user', content: 'Magna enim excepteur mollit nostrud nisi voluptate ut do dolor quis et ea irure.' },
  { source: 'teacher', content: 'Magna enim excepteur mollit nostrud nisi voluptate ut do dolor quis et ea irure.' },
  { source: 'user', content: 'Magna enim excepteur mollit nostrud nisi voluptate ut do dolor quis et ea irure.' },
  { source: 'teacher', content: 'Magna enim excepteur mollit nostrud nisi voluptate ut do dolor quis et ea irure.' },
]
interface ChatProps {
  className?: string;
  toggleSideBar: () => void;
}
interface ChatHeaderProps {
  children: ReactNode;
  className?: string;
}
interface MessagesAreaProps {
  className?: string;
}
interface TextareaProps {
  formClassName?: string;
  textAreaClassName?: string;
}

export function Chat({ toggleSideBar, className }: ChatProps) {
  //const [messages, setMessages] = useState(dummyMessages);
  const [messages, setMessages] = useState([]);

  function ChatHeader({ children, className }: ChatHeaderProps) {
    return <div className={className}>
      {children}
    </div>
  }

  function MessagesArea({ className }: MessagesAreaProps) {
    const scrollRef = useRef(null);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages]);

    function ChatItem({ className, children }) {
      return (
        <div className={className}>{children}</div>
      )
    }

    return <div className={className} ref={scrollRef}>
      {messages.map(message => (
        <ChatItem className={`chatitem ${message.source === 'user' ? 'useritem' : 'teacheritem'}`}>{message.content}</ChatItem>
      ))}
    </div>
  }

  function Textarea({ formClassName, textAreaClassName }: TextareaProps) {
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
      //console.log(completion.choices[0].message.content);
    }

    return (
      <form
        className={formClassName}
        onSubmit={handleSubmit}>
        <textarea
          className={textAreaClassName}
          placeholder='Message English Pal'
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



  return (
    <div className={className}>
      <ChatHeader className='chatheader'>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <FiSidebar style={{
            color: "hsl(25 5.3% 44.7%)",
            fontSize: '1.5em'
          }}
            onClick={toggleSideBar} />
        </div>
      </ChatHeader>
      <MessagesArea className='messagesarea'></MessagesArea>
      <Textarea
        formClassName="messageinput"
        textAreaClassName="textarea"
      ></Textarea>
    </div>
  )

}

