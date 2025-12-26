import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { checkAuth } from './redux/slices/authSlices.js';
import LoginPage from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import VerifyOtp from './pages/Auth/VerifyOtp';
import ErrorBoundary from './pages/Common/ErrorBoundary';
import NotFound from './pages/Common/NotFound';

// Owner Pages
import OwnerDashboardPage from './pages/Owner/OwnerDashboardPage';
import OwnerCreateHostelPage from './pages/Owner/OwnerCreateHostelPage';
import OwnerHostelsPage from './pages/Owner/OwnerHostelsPage';
import OwnerHostelRoomsPage from './pages/Owner/OwnerHostelRoomsPage';
import OwnerRequestsPage from './pages/Owner/OwnerRequestsPage';
import OwnerStaysPage from './pages/Owner/OwnerStaysPage';
import OwnerNotificationsPage from './pages/Owner/OwnerNotificationsPage';
import OwnerSettings from './pages/Owner/OwnerSettings';
import OwnerEditHostelPage from './pages/Owner/OwnerEditHostelPage';
import LandingPage from './pages/LandingPage';
import OwnerLayout from './pages/Owner/Layout/OwnerLayout';
import UserProfile from './pages/Owner/UserProfile';

// Hosteller pages
import BrowseHostels from './pages/Common/BrowseHostels';
import MyStay from './pages/Hosteller/MyStay';
import HostellerProfile from './pages/Hosteller/HostellerProfile';
import HostelDetail from './pages/Common/HostelDetail';
import MyRequests from './pages/Hosteller/MyRequests';
import HostellerDashboard from './pages/Hosteller/HostellerDashboard';
// import HostellerLayout from './pages/Hosteller/Layout/hostellerLayout';
import HostellerLayout from './pages/Hosteller/Layout/HostellerLayout';
import HostelResidents from './pages/Common/HostelResidents';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check auth status on app load to resolve initial loading state
    dispatch(checkAuth());
  }, [dispatch]);

    return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          
          {/* Hosteller Routes */}
          <Route element={<HostellerLayout />}>
            <Route path="/hosteller/dashboard" element={<HostellerDashboard />} />
            <Route path="/hosteller/browse" element={<BrowseHostels />} />
            <Route path="/hosteller/stay" element={<MyStay />} />
            <Route path="/hosteller/profile" element={<HostellerProfile />} /> 
            <Route path="/hosteller/hostel/:id" element={<HostelDetail />} />
            <Route path="/hosteller/hostel/:hostelId/residents" element={<HostelResidents />} />
            <Route path="/hosteller/requests" element={<MyRequests />} />
          </Route>

          {/* Owner Routes */}
          <Route element={<OwnerLayout />}>
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/owner/browse" element={<BrowseHostels />} />
            <Route path="/owner/hostels" element={<OwnerHostelsPage />} />
            <Route path="/owner/hostel/:id" element={<HostelDetail />} />
            <Route path="/owner/hostel/:hostelId/residents" element={<HostelResidents />} />
            <Route path="/owner/create-hostel" element={<OwnerCreateHostelPage />} />
            <Route path="/owner/edit-hostel/:id" element={<OwnerEditHostelPage />} />
            <Route path="/owner/hostels/:hostelId/rooms" element={<OwnerHostelRoomsPage />} />
            <Route path="/owner/stays" element={<OwnerStaysPage />} />
            <Route path="/owner/requests" element={<OwnerRequestsPage />} />
            <Route path="/owner/notifications" element={<OwnerNotificationsPage />} />
            <Route path="/owner/settings" element={<OwnerSettings />} />
            <Route path="/user/profile" element={<UserProfile />} />
          </Route>
          
          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0c0a09',
            color: '#fef3c7',
            border: '1px solid #1c1917',
            padding: '10px 14px',
            fontWeight: 600,
          },
          iconTheme: {
            primary: '#f97316',
            secondary: '#0c0a09',
          },
          success: { duration: 3200 },
          error: { duration: 4000 },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
