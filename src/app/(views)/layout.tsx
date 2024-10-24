import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { auth } from '@/lib/auth-config';

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user.role;
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar isAdmin={role === 'ADMIN'} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
export default DashboardLayout;
