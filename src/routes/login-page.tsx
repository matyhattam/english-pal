import './../styles/login-page.css'
import { createClient } from '@supabase/supabase-js';
import { FormEvent, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);

export default function LoginPage() {
  const [emailButtonValue, setEmailButtonValue] = useState('');
  const [passwordButtonValue, setPasswordButtonValue] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise {
    e.preventDefault();

    if (e.nativeEvent.submitter.name == 'login') {
      console.log('login');
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailButtonValue,
        password: passwordButtonValue,
      });

      if (data.user.aud === 'authenticated') {
        console.log('authenticated');
        return navigate("/app");
      }

    } else {
      console.log('signup');
      const { data, error } = await supabase.auth.signUp({
        email: emailButtonValue,
        password: passwordButtonValue,
      });
      if (data.user.aud === 'authenticated') {
        console.log('authenticated');
        const { error } = await supabase
          .from('user')
          .insert({ email: emailButtonValue });
        return navigate("/app");
      }
    }
  }

  return (
    <div className="login-page">
      <h1>English Pal</h1>
      <p>Please log in to continue</p>
      <form
        onSubmit={handleSubmit}>
        <input type="text"
          placeholder='Email'
          onChange={(e) => { setEmailButtonValue(e.target.value) }} />
        <input type="text"
          placeholder='Password'
          onChange={(e) => { setPasswordButtonValue(e.target.value) }} />
        <button type="submit"
          name='login'>Login</button>
        <p className='signup'>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
}
