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
        { 
          success: false, 
          error: 'Server configuration error: Supabase credentials not found. Please check Cloudflare Pages environment variables.'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, company, phone, projectType, message } = body;

    console.log('Business inquiry received:', { firstName, lastName, email, company, projectType });

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !projectType || !message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'All required fields must be filled',
          received: { firstName, lastName, email, company, projectType, message }
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert the business inquiry
    const { data, error } = await supabase
      .from('business_inquiries')
      .insert([
        {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim().toLowerCase(),
          company: company.trim(),
          phone: phone?.trim() || null,
          project_type: projectType.trim(),
          message: message.trim(),
          status: 'new'
        }
      ])
      .select();

    if (error) {
      console.error('Supabase insert error:', error);

      // Check if table doesn't exist
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.error('Table does not exist - run supabase_business_inquiries.sql');
        return NextResponse.json(
          { 
            success: false, 
            error: 'Database not configured. Please run the setup SQL files in Supabase.',
            details: 'Table not found'
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to save inquiry: ${error.message}`,
          details: error
        },
        { status: 500 }
      );
    }

    console.log('Business inquiry saved successfully:', data);

    return NextResponse.json({
      success: true,
      message: 'Business inquiry submitted successfully! We will contact you soon.',
      data: data?.[0]
    });

  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Better error messages
    if (errorMessage.includes('JSON.parse')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request format. Please try again.',
        },
        { status: 400 }
      );
    }
    
    if (errorMessage.includes('Supabase') || errorMessage.includes('configuration')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database connection error. Please check server configuration.',
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: `Internal server error: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
