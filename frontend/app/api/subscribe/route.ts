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
        { message: 'Server configuration error: Supabase credentials not found. Please check Cloudflare Pages environment variables.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    console.log('Newsletter subscription attempt:', email);

    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingSubscriber) {
      return NextResponse.json(
        { message: 'This email is already subscribed to our newsletter' },
        { status: 400 }
      );
    }

    // Create new subscriber
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        {
          email: email.toLowerCase(),
          status: 'active',
          created_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);
      
      // Handle duplicate key error
      if (error.code === '23505' || error.message.includes('duplicate')) {
        return NextResponse.json(
          { message: 'This email is already subscribed to our newsletter' },
          { status: 400 }
        );
      }

      // Check if table doesn't exist
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.error('Table does not exist - run supabase_newsletter.sql');
        return NextResponse.json(
          { message: 'Database not configured. Please run the setup SQL files in Supabase.' },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { message: `Failed to subscribe: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Newsletter subscriber created:', data);

    return NextResponse.json(
      { 
        message: 'Successfully subscribed to our newsletter! Thank you for your interest.',
        data: data?.[0]
      },
      { status: 201 }
    );
  } catch (error: Error | unknown) {
    console.error('Newsletter subscription error:', error);
    
    // Better error messages
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('JSON.parse')) {
      return NextResponse.json(
        { message: 'Invalid request format. Please try again.' },
        { status: 400 }
      );
    }
    
    if (errorMessage.includes('Supabase')) {
      return NextResponse.json(
        { message: 'Database connection error. Please check server configuration.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: 'Error subscribing to newsletter. Please try again later.' },
      { status: 500 }
    );
  }
}
