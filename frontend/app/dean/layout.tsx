import ProtectedRoute from "@/components/ProtectedRoute"

export default function DeanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['college_dean']}>
      {children}
    </ProtectedRoute>
  )
}
