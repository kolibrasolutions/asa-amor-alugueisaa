import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminRecentActivityProps {
  recentActivity?: Array<{
    id: string;
    created_at: string;
    customers?: {
      full_name: string;
    };
  }>;
}

export const AdminRecentActivity = ({ recentActivity }: AdminRecentActivityProps) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Atividade Recente</CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center p-2 border-b">
                <span>Aluguel para {activity.customers?.nome}</span>
                <span className="text-sm text-gray-500">
                  {new Date(activity.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">Nenhuma atividade recente.</p>
        )}
      </CardContent>
    </Card>
  );
};
