import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./screens/home/Home";
import FeaturesPage from "./screens/features/FeaturesPage";
import ContactPage from "./screens/contact/ContactPage";
import DemoPage from "./screens/demo/DemoPage";
import Footer from "./components/Footer";

// Admin Screens
import Login from "./screens/admin/Login";
import Dashboard from "./screens/admin/Dashboard";
import Products from "./screens/admin/Products";
import Users from "./screens/admin/Users";
import Community from "./screens/admin/Community";
import Orders from "./screens/admin/Orders";
import Payments from "./screens/admin/Payments";
import Reviews from "./screens/admin/Reviews";
import Settings from "./screens/admin/Settings";
import FarmingGuides from "./screens/admin/FarmingGuides";
import CreatePost from "./screens/admin/CreatePost";
import SendNotification from "./screens/admin/SendNotification";
import Notifications from "./screens/admin/Notifications";

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen">
      {!isAdminPath && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/demo" element={<DemoPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/payments" element={<Payments />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/reviews" element={<Reviews />} />
        <Route path="/admin/community" element={<Community />} />
        <Route path="/admin/farming-guides" element={<FarmingGuides />} />
        <Route path="/admin/create-post" element={<CreatePost />} />
        <Route path="/admin/send-notification" element={<SendNotification />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        {/* Existing Service Routes */}
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
      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;
