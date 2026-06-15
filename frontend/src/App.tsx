import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { IDEPage } from "./pages/IDEPage";
import { LoginPage } from "./pages/LoginPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { GalleryPage } from "./pages/GalleryPage";
import { PublicProjectPage } from "./pages/PublicProjectPage";
import { AuthorPage } from "./pages/AuthorPage";
import { ProfilePage } from "./pages/ProfilePage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { FollowingPage } from "./pages/FollowingPage";
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

  if (path.startsWith("/u/")) {
    return <AuthorPage />;
  }

  if (path === "/projects") {
    return (
      <RequireAuth>
        <ProjectsPage />
      </RequireAuth>
    );
  }

  if (path === "/profile") {
    return (
      <RequireAuth>
        <ProfilePage />
      </RequireAuth>
    );
  }

  if (path === "/favorites") {
    return (
      <RequireAuth>
        <FavoritesPage />
      </RequireAuth>
    );
  }

  if (path === "/following") {
    return (
      <RequireAuth>
        <FollowingPage />
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
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <RouterProvider>
            <CurrentRoute />
          </RouterProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
