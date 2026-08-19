import { useEffect } from 'react'
import AdminCustomers from '../components/admin/AdminCustomers'
import AdminDashboard from '../components/admin/AdminDashboard'
import AdminDiscounts from '../components/admin/AdminDiscounts'
import AdminLayout from '../components/admin/AdminLayout'
import AdminNotifications from '../components/admin/AdminNotifications'
import AdminOrders from '../components/admin/AdminOrders'
import AdminProducts from '../components/admin/AdminProducts'
import AdminReviews from '../components/admin/AdminReviews'
import AdminSettings from '../components/admin/AdminSettings'
import AdminTransactions from '../components/admin/AdminTransactions'
import { useAuth } from '../context/AuthContext'
import { adminSectionFromPath, navigateApp, type AdminSection } from '../lib/appRoutes'
import { scrollAppToTop } from '../lib/scrollControl'

function SectionView({ section }: { section: AdminSection }) {
  switch (section) {
    case 'customers':
      return <AdminCustomers />
    case 'products':
      return <AdminProducts />
    case 'transactions':
      return <AdminTransactions />
    case 'orders':
      return <AdminOrders />
    case 'reviews':
      return <AdminReviews />
    case 'discounts':
      return <AdminDiscounts />
    case 'notifications':
      return <AdminNotifications />
    case 'settings':
      return <AdminSettings />
    default:
      return <AdminDashboard />
  }
}

/** Admin control panel — light green / gold shell. */
export default function AdminPage() {
  const section = adminSectionFromPath(window.location.pathname)
  const { loading, isAdmin } = useAuth()

  useEffect(() => {
    document.title = 'Admin · Tasneem Mukhwas'
    scrollAppToTop(true)
    return () => {
      document.title = 'Tasneem Mukhwas'
    }
  }, [section])

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigateApp('/login')
    }
  }, [loading, isAdmin])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-[0.95rem] text-[#0a2e22]/80">
        Loading…
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <AdminLayout section={section}>
      <SectionView section={section} />
    </AdminLayout>
  )
}
