import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Verify environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Supabase environment variables missing:', {
        url: supabaseUrl ? '✓ Set' : '✗ Missing',
        key: supabaseAnonKey ? '✓ Set' : '✗ Missing'
      });
      return NextResponse.json(
        { error: 'Server configuration error: Supabase credentials not found. Please check Cloudflare Pages environment variables.' },
        { status: 503 }
      );
    }

    const { name, email, phone, message } = await request.json();

    // Validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    console.log('Contact form submission:', { name, email, phone });

    // Insert into Supabase
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          name: name,
          email: email.toLowerCase(),
          phone: phone,
          message: message,
          status: 'new',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);

      // Check if table doesn't exist
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.error('Table does not exist - run supabase_contacts.sql');
        return NextResponse.json(
          { error: 'Database not configured. Please run the setup SQL files in Supabase.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: `Failed to send message: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Contact message saved:', data);

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! We will contact you soon.',
      data: data?.[0]
    });

  } catch (error: Error | unknown) {
    console.error('Contact API error:', error);
    
    // Better error messages
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('JSON.parse')) {
      return NextResponse.json(
        { error: 'Invalid request format. Please try again.' },
        { status: 400 }
      );
    }
    
    if (errorMessage.includes('Supabase') || errorMessage.includes('configuration')) {
      return NextResponse.json(
        { error: 'Database connection error. Please check server configuration.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
