import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConstructionCatalogPage } from "./pages/ConstructionCatalogPage";
import { ConstructionFeedPage } from "./pages/ConstructionFeedPage";
import { AppLayout } from "./AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/construction/catalog" element={<ConstructionCatalogPage />} />
          <Route path="/construction/feed" element={<ConstructionFeedPage />} />
          <Route path="/construction/feed/:id" element={<ConstructionFeedPage />} />
          <Route path="*" element={<ConstructionCatalogPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;