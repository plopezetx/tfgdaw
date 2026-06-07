import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { IDEPage } from "./pages/IDEPage";
import { LoginPage } from "./pages/LoginPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { GalleryPage } from "./pages/GalleryPage";
import { PublicProjectPage } from "./pages/PublicProjectPage";
import { useAuth } from "./context/AuthContext";
import type { ReactNode } from "react";

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/p/:slug" element={<PublicProjectPage />} />
          <Route
            path="/projects"
            element={
              <RequireAuth>
                <ProjectsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/app/:projectId"
            element={
              <RequireAuth>
                <IDEPage />
              </RequireAuth>
            }
          />
          <Route path="/" element={<Navigate to="/projects" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
