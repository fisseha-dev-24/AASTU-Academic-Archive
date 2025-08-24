#!/usr/bin/env python3
"""
create_tree.py

Run this in the folder where you want to create the frontend scaffold.
Usage:
    python3 create_tree.py

This script creates a React + TypeScript frontend file structure with placeholder files
so you can begin filling them one at a time.

Author: scaffold generator
"""

import os
from pathlib import Path

BASE = Path("frontend")

structure = {
    # Top-level files
    BASE / ".gitignore": """node_modules/
dist/
.env
.DS_Store
""",
    BASE / "package.json": """{
  "name": "aastu-archive-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "start": "vite",
    "build": "vite build",
    "dev": "vite",
    "lint": "eslint . --ext .ts,.tsx"
  }
}
""",
    BASE / "tsconfig.json": """{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "moduleResolution": "node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": "src"
  },
  "include": ["src"]
}
""",
    BASE / "public" / "index.html": """<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AASTU Archive System</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
""",
    BASE / "public" / "favicon.ico": "",

    # src top-level
    BASE / "src" / "index.tsx": """// Placeholder entry. Will be replaced with full implementation later.
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/global.css";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
""",
    BASE / "src" / "App.tsx": """// Placeholder App component
import React from "react";
export default function App() {
  return <div id="app-root">AASTU Archive - Frontend (placeholder)</div>;
}
""",

    # assets
    BASE / "src" / "assets" / "logo.svg": "<!-- logo placeholder -->",
    BASE / "src" / "assets" / "aastu.jpg": "",

    # styles
    BASE / "src" / "styles" / "variables.css": """/* Color variables for AASTU theme - fill with actual values later */
:root {
  --aastu-primary: #0b3d91; /* example: deep blue - adjust to match logo */
  --aastu-accent: #f0c419; /* example accent (use logo palette only) */
  --aastu-bg: #ffffff;
  --text-default: #1f2937;
  --muted: #6b7280;
  --success: #16a34a;
  --danger: #dc2626;
}
""",
    BASE / "src" / "styles" / "global.css": """@import "./variables.css";
/* Global resets and base styles - expand later */
html, body, #root {
  height: 100%;
  margin: 0;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  background: var(--aastu-bg);
  color: var(--text-default);
}
a { color: inherit; text-decoration: none; }
""",

    # components and layout placeholders
    BASE / "src" / "components" / "common" / "Button.tsx": """import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export default function Button({ children, onClick, className = "" }: Props) {
  return (
    <button
      onClick={onClick}
      className={`aastu-btn ${className}`}
      style={{
        background: "var(--aastu-primary)",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
""",
    BASE / "src" / "components" / "common" / "Input.tsx": """import React from "react";

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
};

export default function Input({ value = "", onChange, placeholder = "", type = "text" }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      style={{
        padding: "8px 10px",
        borderRadius: 6,
        border: "1px solid #e5e7eb",
        width: "100%",
      }}
    />
  );
}
""",
    BASE / "src" / "components" / "common" / "Navbar.tsx": """import React from "react";

export default function Navbar() {
  return (
    <nav style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
      <img src="/src/assets/logo.svg" alt="AASTU" style={{ height: 40 }} />
      <div style={{ fontWeight: 600 }}>AASTU Archive</div>
      <div style={{ marginLeft: "auto" }}>
        {/* Auth links will go here */}
      </div>
    </nav>
  );
}
""",
    BASE / "src" / "components" / "common" / "Sidebar.tsx": """import React from "react";

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  return (
    <aside style={{ width: 260, padding: 16, borderRight: "1px solid #e5e7eb" }}>
      {children}
    </aside>
  );
}
""",
    BASE / "src" / "components" / "layout" / "MainLayout.tsx": """import React from "react";
import Navbar from "../common/Navbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main style={{ padding: 20 }}>{children}</main>
    </div>
  );
}
""",

    # pages - placeholders
    BASE / "src" / "pages" / "Landing" / "Landing.tsx": """import React from "react";

export default function Landing() {
  return (
    <div>
      <header style={{ display: "flex", alignItems: "center", gap: 20, padding: 24 }}>
        <img src="/src/assets/aastu.jpg" alt="AASTU" style={{ maxHeight: 120, borderRadius: 8 }} />
        <div>
          <h1>AASTU Archive System</h1>
          <p>Official Archive system for AASTU documents, theses, exams and videos.</p>
        </div>
      </header>
    </div>
  );
}
""",
    BASE / "src" / "pages" / "Auth" / "Login.tsx": """import React from "react";

export default function Login() {
  return <div>Login (placeholder)</div>;
}
""",
    BASE / "src" / "pages" / "Auth" / "Signup.tsx": """import React from "react";

export default function Signup() {
  return <div>Signup (students only) - placeholder</div>;
}
""",
    # role dashboards (placeholders)
    BASE / "src" / "pages" / "Student" / "Dashboard.tsx": """import React from "react";

export default function StudentDashboard() {
  return <div>Student Dashboard - placeholder</div>;
}
""",
    BASE / "src" / "pages" / "Teacher" / "Dashboard.tsx": """import React from "react";

export default function TeacherDashboard() {
  return <div>Teacher Dashboard - placeholder</div>;
}
""",
    BASE / "src" / "pages" / "DeptHead" / "Dashboard.tsx": """import React from "react";

export default function DeptHeadDashboard() {
  return <div>Department Head Dashboard - placeholder</div>;
}
""",
    BASE / "src" / "pages" / "Dean" / "Dashboard.tsx": """import React from "react";

export default function DeanDashboard() {
  return <div>College Dean Dashboard - placeholder</div>;
}
""",
    BASE / "src" / "pages" / "Admin" / "Dashboard.tsx": """import React from "react";

export default function AdminDashboard() {
  return <div>Admin Dashboard - placeholder</div>;
}
""",

    # services/hooks/utils/types
    BASE / "src" / "services" / "api.ts": """// API client placeholder - will wire to Laravel backend later
export const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";
""",
    BASE / "src" / "services" / "auth.ts": """// auth helper placeholder
export function isLoggedIn() {
  return false;
}
""",
    BASE / "src" / "hooks" / "useAuth.ts": """// placeholder hook for auth management
import { useState } from "react";
export function useAuth() {
  const [user, setUser] = useState(null);
  return { user, setUser };
}
""",
    BASE / "src" / "routes" / "AppRouter.tsx": """import React from "react";
export default function AppRouter() {
  return <div>Routes placeholder</div>;
}
""",
    BASE / "src" / "types" / "index.d.ts": """// project-wide types placeholder
export type Role = "student" | "teacher" | "department_head" | "dean" | "admin";
""",
    BASE / "src" / "utils" / "constants.ts": """export const ROLES = ["student", "teacher", "department_head", "dean", "admin"] as const;
""",
    BASE / "src" / "utils" / "format.ts": """export function truncate(s: string, n = 100) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}
""",

    # README at repo root
    Path("README.md"): """# AASTU Archive - Frontend scaffold

This scaffold creates a React + TypeScript frontend structure for the AASTU Archive System.

Run `python3 create_tree.py` to create the frontend tree under ./frontend with placeholder files.

Next steps:
- Run the script to create files.
- Tell me which file you want me to implement in full detail first (one file at a time). I recommend starting with the color variables and global styles or the Landing page component.
"""
}

def safe_write(path: Path, content: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        f.write(content)

def main():
    print(f"Creating frontend scaffold under: {BASE}")
    for p, content in structure.items():
        safe_write(p, content)
        print(f"  created: {p}")
    print("\nDone. Open frontend/ in your editor. Next: pick which file you want me to implement first (one file at a time).")

if __name__ == "__main__":
    main()