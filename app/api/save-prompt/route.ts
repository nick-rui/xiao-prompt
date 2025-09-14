import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const {
      original_prompt,
      optimized_prompt,
      original_tokens,
      optimized_tokens,
      tokens_saved,
      money_saved,
      energy_saved,
      emissions_saved,
      user_name
    } = await request.json()

    // Validate required fields
    if (!original_prompt || !optimized_prompt) {
      return NextResponse.json(
        { error: 'Original prompt and optimized prompt are required' },
        { status: 400 }
      )
    }

    // Create Supabase client
    const supabase = await createClient()

    // Insert the prompt data into the database
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        original_prompt,
        optimized_prompt,
        original_tokens: original_tokens || 0,
        optimized_tokens: optimized_tokens || 0,
        tokens_saved: tokens_saved || 0,
        money_saved: money_saved || 0,
        energy_saved: energy_saved || 0,
        emissions_saved: emissions_saved || 0,
        user_name: user_name || 'Anonymous'
      })
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save prompt to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data[0]
    })

  } catch (error) {
    console.error('Error saving prompt:', error)
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
