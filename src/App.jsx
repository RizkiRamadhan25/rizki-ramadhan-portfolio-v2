import { Route, Routes } from "react-router";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/EditorialHomePage";
import NotFoundPage from "./pages/EditorialNotFoundPage";
import ProjectDetailPage from "./pages/EditorialProjectDetailPage";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          index
          element={<HomePage />}
        />

        <Route
          path="projects/:slug"
          element={<ProjectDetailPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Route>
    </Routes>
  );
}
