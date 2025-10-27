import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@omnieconomy/shared-components";
import WikiLayout from "./components/WikiLayout/WikiLayout";
import SearchModal from "./components/SearchModal/SearchModal";
import HomePage from "./pages/HomePage/HomePage";
import WikiPage from "./pages/WikiPage/WikiPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import SearchPage from "./pages/SearchPage/SearchPage";
import { useSearchShortcut } from "./hooks/useSearchShortcut";

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

function AppWithRouter() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  useSearchShortcut(() => setIsSearchModalOpen(true));

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<WikiLayout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path=":category" element={<CategoryPage />} />
          <Route path=":category/:page" element={<WikiPage />} />
        </Route>
      </Routes>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </>
  );
}

export default App;
