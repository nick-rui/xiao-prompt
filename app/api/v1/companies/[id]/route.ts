import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Validation schema
const UpdateCompanySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  billing_email: z.string().email().optional(),
  company_size: z.string().optional(),
  industry: z.string().optional(),
  plan_type: z.enum(['free', 'pro', 'enterprise']).optional()
})

// GET /api/v1/companies/[id] - Get company details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    const { data: company, error } = await supabase
      .from('companies')
      .select(`
        id,
        name,
        email,
        plan_type,
        monthly_limit,
        current_usage,
        billing_cycle_start,
        billing_email,
        company_size,
        industry,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Company not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching company:', error)
      return NextResponse.json(
        { error: 'Failed to fetch company' },
        { status: 500 }
      )
    }

    return NextResponse.json({ company })

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

// PUT /api/v1/companies/[id] - Update company
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params
    const body = await request.json()
    
    const validation = UpdateCompanySchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.errors },
        { status: 400 }
      )
    }

    // Check if company exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id, plan_type')
      .eq('id', id)
      .single()

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // If changing plan type, update monthly limit
    let updateData = { ...validation.data }
    if (validation.data.plan_type) {
      const monthlyLimits = {
        free: 1000,
        pro: 50000,
        enterprise: 1000000
      }
      updateData.monthly_limit = monthlyLimits[validation.data.plan_type]
    }

    const { data: company, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating company:', error)
      return NextResponse.json(
        { error: 'Failed to update company' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      company 
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

// DELETE /api/v1/companies/[id] - Delete company (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { id } = params

    // Check if company exists
    const { data: existingCompany } = await supabase
      .from('companies')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Delete company (cascade will handle related records)
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting company:', error)
      return NextResponse.json(
        { error: 'Failed to delete company' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: 'Company deleted successfully' 
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
