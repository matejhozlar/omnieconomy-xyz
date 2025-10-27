import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "@omnieconomy/shared-components";
import WikiLayout from "./components/WikiLayout/WikiLayout";
import HomePage from "./pages/HomePage/HomePage";
import WikiPage from "./pages/WikiPage/WikiPage";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import SearchPage from "./pages/SearchPage/SearchPage";

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

function AppWithRouter() {
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
    </>
  );
}

export default App;
