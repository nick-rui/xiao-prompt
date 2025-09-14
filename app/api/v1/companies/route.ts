import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schemas
const CreateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255),
  email: z.string().email('Valid email is required'),
  plan_type: z.enum(['free', 'pro', 'enterprise']).optional().default('free'),
  company_size: z.string().optional(),
  industry: z.string().optional()
})

const UpdateCompanySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  billing_email: z.string().email().optional(),
  company_size: z.string().optional(),
  industry: z.string().optional()
})

// POST /api/v1/companies - Create new company
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const validation = CreateCompanySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, email, plan_type, company_size, industry } = validation.data

    // Check if company with email already exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('email', email)
      .single()

    if (existingCompany) {
      return NextResponse.json(
        { error: 'Company with this email already exists' },
        { status: 409 }
      )
    }

    // Set monthly limits based on plan
    const monthlyLimits = {
      free: 1000,
      pro: 50000,
      enterprise: 1000000
    }

    // Create company
    const { data: company, error } = await supabase
      .from('companies')
      .insert({
        name,
        email,
        plan_type,
        monthly_limit: monthlyLimits[plan_type],
        company_size,
        industry
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating company:', error)
      return NextResponse.json(
        { error: 'Failed to create company' },
        { status: 500 }
      )
    }

    // Create initial API key
    const apiKey = `pk_${plan_type === 'free' ? 'test' : 'live'}_${company.id}_${Math.random().toString(36).substr(2, 16)}`
    
    const { error: keyError } = await supabase
      .from('api_keys')
      .insert({
        company_id: company.id,
        key_name: 'Initial API Key',
        api_key: apiKey
      })

    if (keyError) {
      console.error('Error creating API key:', keyError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json({
      success: true,
      company: {
        id: company.id,
        name: company.name,
        email: company.email,
        plan_type: company.plan_type,
        monthly_limit: company.monthly_limit,
        current_usage: company.current_usage,
        created_at: company.created_at
      },
      api_key: apiKey // Only return on creation
    }, { status: 201 })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET /api/v1/companies - List companies (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const plan_type = searchParams.get('plan_type')
    
    let query = supabase
      .from('companies')
      .select(`
        id,
        name,
        email,
        plan_type,
        monthly_limit,
        current_usage,
        billing_cycle_start,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (plan_type) {
      query = query.eq('plan_type', plan_type)
    }

    const { data: companies, error, count } = await query

    if (error) {
      console.error('Error fetching companies:', error)
      return NextResponse.json(
        { error: 'Failed to fetch companies' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      companies,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil((count || 0) / limit)
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
