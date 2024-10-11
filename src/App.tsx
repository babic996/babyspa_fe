import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import BabyPage from "./pages/BabyPage/BabyPage";
import ArrangementPage from "./pages/ArrangementPage/ArrangementPage";
import { ToastContainer } from "react-toastify";
import ServicePackagePage from "./pages/ServicePackagePage/ServicePackagePage";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="/baby" element={<BabyPage />} />
            <Route path="/service-package" element={<ServicePackagePage />} />
            <Route path="/arrangement" element={<ArrangementPage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
