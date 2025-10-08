import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./screens/home/Home";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/features"
            element={
              <div className="p-8">
                <h1>Features Page</h1>
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="p-8">
                <h1>Contact Page</h1>
              </div>
            }
          />
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
      </div>
    </Router>
  );
}

export default App;
