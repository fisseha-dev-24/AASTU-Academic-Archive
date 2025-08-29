import ProtectedRoute from "@/components/ProtectedRoute"

export default function DepartmentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['department_head']}>
      {children}
    </ProtectedRoute>
  )
}
