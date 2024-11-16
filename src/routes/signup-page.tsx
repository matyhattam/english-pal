import './../styles/signup-page.css'
import { createClient } from '@supabase/supabase-js';
import { FormEvent, useState } from 'react';
import { useNavigate } from "react-router-dom";

const VITE_SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(VITE_SUPABASE_PROJECT_URL, VITE_SUPABASE_API_KEY);

export default function SignupPage() {
  const [firstNameButtonValue, setFirstNameButtonValue] = useState('');
  const [lastNameButtonValue, setLastNameButtonValue] = useState('');
  const [emailButtonValue, setEmailButtonValue] = useState('');
  const [passwordButtonValue, setPasswordButtonValue] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>): Promise {
    e.preventDefault();

    console.log('signup');
    const { data, error } = await supabase.auth.signUp({
      email: emailButtonValue,
      password: passwordButtonValue,
      options: {
        data: {
          first_name: firstNameButtonValue,
          last_name: lastNameButtonValue,
        }
      }
    });
    console.log(data);
    if (data.user.aud === 'authenticated') {
      const { error } = await supabase
        .from('user')
        .insert({
          first_name: firstNameButtonValue,
          last_name: lastNameButtonValue,
          email: emailButtonValue,
          auth_id: data.user.id,
        });
      return navigate("/app");
    }
  }

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <p>Please enter your details to continue</p>
      <form
        onSubmit={handleSubmit}>
        <input type="text"
          placeholder='First Name'
          onChange={(e) => { setFirstNameButtonValue(e.target.value) }} />
        <input type="text"
          placeholder='Last Name'
          onChange={(e) => { setLastNameButtonValue(e.target.value) }} />
        <input type="text"
          placeholder='Email'
          onChange={(e) => { setEmailButtonValue(e.target.value) }} />
        <input type="text"
          placeholder='Password'
          onChange={(e) => { setPasswordButtonValue(e.target.value) }} />
        <button type="submit"
          name='login'>Signup</button>
      </form>
    </div>
  );
}
