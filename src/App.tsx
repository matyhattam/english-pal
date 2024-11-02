import {  useState } from 'react'

import { SideBar } from './components/SideBar/SideBar'
import { Chat } from './components/Chat/Chat'
import './App.css'

function App() {
  const [showSideBar, setShowSideBar] = useState<boolean>(true)

  function toggleSideBar() {
    setShowSideBar(!showSideBar);
    console.log(showSideBar)
  }
   
  return (
    <>
      <div className='container'>
        {showSideBar && (
          <SideBar className='sidebar'>
          </SideBar>)}
        <Chat className='chat' toggleSideBar={toggleSideBar}>
          
        </Chat>
      </div>
    </>
  )
}

export default App
