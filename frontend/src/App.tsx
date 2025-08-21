import React, { Suspense } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

// Lazy import main pages (adjust paths if needed)
const Login = React.lazy(() => import("./pages/Auth/Login"));
const Signup = React.lazy(() => import("./pages/Auth/Signup"));
const StudentDashboard = React.lazy(() => import("./pages/Student/Dashboard"));
const TeacherDashboard = React.lazy(() => import("./pages/Teacher/Dashboard"));
const DeptHeadDashboard = React.lazy(() => import("./pages/DeptHead/Dashboard"));
const DeanDashboard = React.lazy(() => import("./pages/Dean/Dashboard"));
// changed: eager import for Landing so it always shows instantly
import Landing from "./pages/Landing/Landing";

function RoleRedirect({ user }: { user: any }) {
  if (!user) return <Navigate to="/" replace />; // send unauth users back to landing
  const role = user.role || "";
  if (role === "student") return <Navigate to="/student" replace />;
  if (role === "teacher") return <Navigate to="/teacher" replace />;
  if (role === "department_head" || role === "dept_head") return <Navigate to="/depthead" replace />;
  if (role === "dean") return <Navigate to="/dean" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
}

function ProtectedRoute({ children, roles }: { children: React.ReactElement; roles?: string[] | undefined }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) {
    return <div style={{ padding: 24 }}>Checking session…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role ?? "")) {
    return <div style={{ padding: 24 }}>You do not have permission to view this page.</div>;
  }
  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading…</div>}>
      <Routes>
        {/* Public landing at root */}
        <Route path="/" element={<Landing />} />
        {/* Explicit redirect route for logged in users */}
        <Route path="/redirect" element={<RoleRedirect user={user} />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student area */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute roles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher area */}
        <Route
          path="/teacher/*"
          element={
            <ProtectedRoute roles={["teacher"]}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />

        {/* Department head */}
        <Route
          path="/depthead/*"
          element={
            <ProtectedRoute roles={["department_head", "dept_head"]}>
              <DeptHeadDashboard />
            </ProtectedRoute>
          }
        />

        {/* Dean */}
        <Route
          path="/dean/*"
          element={
            <ProtectedRoute roles={["dean"]}>
              <DeanDashboard />
            </ProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
      </Routes>
    </Suspense>
  );
}
