import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

function AppWithRouter() {
  return (
    <Routes>
      <Route path="/" element={<Header />} />
    </Routes>
  );
}

export default App;
