import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./screens/home/Home";
import FeaturesPage from "./screens/features/FeaturesPage";
import ContactPage from "./screens/contact/ContactPage";
import DemoPage from "./screens/demo/DemoPage";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/demo" element={<DemoPage />} />
          <Route
            path="/services/crop-management"
            element={
              <div className="p-8">
                <h1>Crop Management</h1>
              </div>
            }
          />
          <Route
            path="/services/soil-analysis"
            element={
              <div className="p-8">
                <h1>Soil Analysis</h1>
              </div>
            }
          />
          <Route
            path="/services/weather"
            element={
              <div className="p-8">
                <h1>Weather Monitoring</h1>
              </div>
            }
          />
          <Route
            path="/services/pest-control"
            element={
              <div className="p-8">
                <h1>Pest Control</h1>
              </div>
            }
          />
          <Route
            path="/services/irrigation"
            element={
              <div className="p-8">
                <h1>Irrigation Planning</h1>
              </div>
            }
          />
        </Routes>
        <Footer />{" "}
      </div>
    </Router>
  );
}

export default App;
