import { Navigation } from '@/components/navigation'
import { EvaluationPlayground } from '@/components/evaluation-playground'

export default function EvaluationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <EvaluationPlayground />
    </div>
  )
}
