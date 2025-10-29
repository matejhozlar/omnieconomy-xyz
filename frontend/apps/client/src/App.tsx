import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Header } from "@omnieconomy/shared-components";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
// import InitialLoader from "./components/InitialLoader/InitialLoader";
// import { useEffect, useState } from "react";

function App() {
  return (
    <Router>
      <AppWithRouter />
    </Router>
  );
}

function AppWithRouter() {
  // const [showLoader, setShowLoader] = useState(true);
  // const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // useEffect(() => {
  //   const hasShownLoader = sessionStorage.getItem("hasShownLoader");

  //   if (hasShownLoader === "true") {
  //     setShowLoader(false);
  //     setHasLoadedOnce(true);
  //   }
  // }, []);

  // const handleLoaderComplete = () => {
  //   setShowLoader(false);
  //   setHasLoadedOnce(true);

  //   sessionStorage.setItem("hasShownLoader", "true");
  // };

  return (
    <>
      {/* {showLoader && <InitialLoader onComplete={handleLoaderComplete} />}

      <div
        style={{ opacity: hasLoadedOnce ? 1 : 0, transition: "opacity 0.5s" }}
      > */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* </div> */}
    </>
  );
}

export default App;
