import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "@omnieconomy/shared-components";
import Home from "./pages/Home/Home";

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
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
