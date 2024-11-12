import { createContext, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import './index.css'
import { createClient } from '@supabase/supabase-js';

const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);
const SessionContext = createContext(null)

export default function Wrapper() {
  const [session, setSession] = useState(null)
  const navigate = useNavigate();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          console.log(session);
          setSession(null)
          navigate('/login', { replace: true });

        } else if (session) {
          console.log(session);
          setSession(session)
          navigate('/app', { replace: true });

        } else if (!session) {
          console.log(session);
          setSession(null)
          navigate('/login', { replace: true });
        }
      })

    return () => {
      subscription.unsubscribe()
    }
  }, []);

  return (
    <SessionContext.Provider value={session}>
    </SessionContext.Provider>
  );
}
