// This layout intentionally does NOT include Navbar or CartDrawer
// so the admin panel renders as a standalone full-screen dashboard.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
