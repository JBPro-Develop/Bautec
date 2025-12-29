import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import OptimizeForm from './components/OptimizeForm';

export default function AiInsightsPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Feeding Insights</CardTitle>
          <CardDescription>
            Generate optimized feeding recipe recommendations. Provide details about your pen's current conditions,
            past performance, and ingredient availability to receive AI-driven insights for improving growth and cost-efficiency.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <OptimizeForm />
        </CardContent>
      </Card>
    </div>
  );
}
