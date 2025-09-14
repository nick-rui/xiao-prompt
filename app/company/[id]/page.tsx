import { CompanyDashboard } from '@/components/company-dashboard'

interface CompanyPageProps {
  params: {
    id: string
  }
}

export default function CompanyPage({ params }: CompanyPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <CompanyDashboard companyId={params.id} />
    </div>
  )
}
