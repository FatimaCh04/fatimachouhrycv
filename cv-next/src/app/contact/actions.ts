'use server';

import { createClient } from '@/lib/supabase/server';

export type ContactFormState = {
  success: boolean;
  message: string;
};

export async function submitContactMessage(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const message = (formData.get('message') as string)?.trim();

  if (!name || !email || !message) {
    return { success: false, message: 'Name, email aur message zaroori hain.' };
  }

  if (name.length < 2) {
    return { success: false, message: 'Name kam az kam 2 characters hona chahiye.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Valid email address likhein.' };
  }

  if (message.length < 10) {
    return { success: false, message: 'Message kam az kam 10 characters hona chahiye.' };
  }

  try {
    const supabase = createClient();
    if (!supabase) {
      return { success: false, message: 'Server not configured. Please set Supabase env vars.' };
    }

    const { error } = await supabase.from('contact_messages').insert({
      name,
      email,
      message,
    });

    if (error) {
      console.error('Contact form error:', error);
      return { success: false, message: 'Message save nahi ho saka. Baad mein dubara try karein ya direct email karein.' };
    }

    return { success: true, message: 'Message bhej diya gaya! Jald reply karungi.' };
  } catch (err) {
    console.error('Contact form error:', err);
    return { success: false, message: 'Koi error aayi. Dubara try karein ya fatimachoudhry94@gmail.com par email karein.' };
  }
}
