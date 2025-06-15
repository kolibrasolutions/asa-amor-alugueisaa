
import { AdminStats } from './AdminStats';
import { AdminQuickActions } from './AdminQuickActions';
import { AdminRecentActivity } from './AdminRecentActivity';
import { ProductAvailabilitySearch } from './ProductAvailabilitySearch';

interface AdminDashboardProps {
  stats: any;
  onSectionChange: (section: string) => void;
}

export const AdminDashboard = ({ stats, onSectionChange }: AdminDashboardProps) => {
  return (
    <main className="container mx-auto p-6 space-y-6">
      <AdminStats stats={stats} />
      <ProductAvailabilitySearch />
      <AdminQuickActions onSectionChange={onSectionChange} />
      <AdminRecentActivity recentActivity={stats?.recentActivity} />
    </main>
  );
};
