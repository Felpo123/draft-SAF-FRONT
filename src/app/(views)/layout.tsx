import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <Header />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
export default DashboardLayout
