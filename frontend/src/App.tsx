import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { IDEPage } from "./pages/IDEPage";
import { LoginPage } from "./pages/LoginPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { GalleryPage } from "./pages/GalleryPage";
import { PublicProjectPage } from "./pages/PublicProjectPage";
import { Navigate, RouterProvider, usePath } from "./lib/router";

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function CurrentRoute() {
  const path = usePath();

  if (path === "/login") {
    return <LoginPage />;
  }

  if (path === "/gallery") {
    return <GalleryPage />;
  }

  if (path.startsWith("/p/")) {
    return <PublicProjectPage />;
  }

  if (path === "/projects") {
    return (
      <RequireAuth>
        <ProjectsPage />
      </RequireAuth>
    );
  }

  if (path.startsWith("/app/")) {
    return (
      <RequireAuth>
        <IDEPage />
      </RequireAuth>
    );
  }

  return <Navigate to="/projects" replace />;
}

function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <CurrentRoute />
      </RouterProvider>
    </AuthProvider>
  );
}

export default App;
