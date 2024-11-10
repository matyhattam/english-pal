import './../styles/login-page.css'
import { createClient } from '@supabase/supabase-js';
import { FormEvent } from 'react';

const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);

export default function LoginPage() {
  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();


  }

  return (
    <div className="login-page">
      <h1>English Pal</h1>
      <p>Please log in to continue</p>
        <form
          onSubmit={handleSubmit}>
          <input type="text" placeholder='Email' />
          <input type="text" placeholder='Password' />
          <button type="submit">Login</button>
          <button type="submit"
            className='signup-button'>Sign Up</button>
        </form>

    </div>
  );
}
