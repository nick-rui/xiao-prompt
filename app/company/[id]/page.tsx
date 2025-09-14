import { CompanyDashboard } from '@/components/company-dashboard'
import { Navigation } from '@/components/navigation'

interface CompanyPageProps {
  params: {
    id: string
  }
}

export default function CompanyPage({ params }: CompanyPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <CompanyDashboard companyId={params.id} />
    </div>
  )
}
