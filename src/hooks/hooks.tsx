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

export async function useGetUser(session) {
  const { data, error } = await supabase
    .from('user')
    .select('id')
    .eq('auth_id', session.user.id);

  return data[0].id
}

export async function useChatGpt(userMessage, queryContext) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: queryContext
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });
  return completion.choices[0].message.content;
}

export async function useAddMessage(conversation_id, source, content) {
  return (
    await supabase.from('messages').insert({
      conversation_id: conversation_id,
      source: source,
      content: content,
    })
  )
}
