import { ReactNode } from 'react'
import { FiSidebar } from "react-icons/fi";
import { IoArrowUpCircleOutline } from "react-icons/io5";
import './Chat.css'

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
  className?: string;
}

export function Chat({ toggleSideBar, className }: ChatProps) {

  function ChatHeader({ children, className }: ChatHeaderProps) {
    return <div className={className}>
      {children}
    </div>
  }
  function MessagesArea({ className }: MessagesAreaProps) {
    return <div className={className}>
    </div>
  }
  function Textarea({ className }: TextareaProps) {
    return <textarea className={className} placeholder='Message English Pal'>
    </textarea>
  }

  return (
    <div className={className}>
      <ChatHeader className='chatheader'>
        <FiSidebar style={{
          color: "hsl(25 5.3% 44.7%)",
          fontSize: '1.5em'
        }}
          onClick={toggleSideBar} />
      </ChatHeader>
      <MessagesArea className='messagesarea'></MessagesArea>
      <div className='messageinput'>
        <Textarea className='textarea'></Textarea>
        <IoArrowUpCircleOutline style={{
          color: "hsl(25 5.3% 44.7%)",
          fontSize: '2.5em'
        }} />
      </div>
    </div>
  )

}

