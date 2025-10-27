import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "@omnieconomy/shared-components";

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
        <Route></Route>
      </Routes>
    </>
  );
}

export default App;
