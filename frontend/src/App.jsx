import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import RegisterCitizen from "./pages/RegisterCitizen.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import PasswordUpdated from "./pages/PasswordUpdated";

import CitizenDashboard from "./pages/CitizenDashboard";
import AboutUs from "./pages/AboutUs";
import Notices from "./pages/Notices";
import HouseholdRegistration from "./pages/HouseholdRegistration";
import CertificateRequest from "./pages/CertificateRequest";
import CertificateSuccess from "./pages/CertificateSuccess";
import Complaints from "./pages/Complaints";
import ComplaintStatus from "./pages/ComplaintStatus";



import GNDashboard from "./pages/GNDashboard";
import HouseholdVerify from "./pages/HouseholdVerify";
import HouseholdDetail from "./pages/HouseholdDetail";
import GNCertificates from "./pages/GNCertificates";
import ComplaintManagement from "./pages/ComplaintManagement.jsx";
import PostNotice from "./pages/PostNotice";
import AllowancesAids from "./pages/AllowancesAids";
import GNSettings from "./pages/GNSettings";



import AdminStaffDashboard from "./pages/AdminStaffDashboard.jsx";
import AdminVerifyCertificates from "./pages/AdminVerifyCertificates.jsx";
import CertificateVerify from "./pages/CertificateVerify";

import GNAvailability from "./pages/GNAvailability";
import CitizenAvailability from "./pages/CitizenAvailability";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* default */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public certificate verification (no auth) */}
        <Route path="/verify/:certId" element={<CertificateVerify />} />

        {/* auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<RegisterCitizen />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/password-updated" element={<PasswordUpdated />} />

        {/* citizen */}
        <Route
          path="/citizen"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notices"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <Notices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/household"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <HouseholdRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificates"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <CertificateRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/certificate-success"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <CertificateSuccess />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <Complaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <AboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaint-status"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <ComplaintStatus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/availability"
          element={
            <ProtectedRoute roles={["CITIZEN"]}>
              <CitizenAvailability />
            </ProtectedRoute>
          }
        />

        {/* GN */}
        <Route
          path="/gn"
          element={
            <ProtectedRoute roles={["GN"]}>
              <GNDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gn-households"
          element={
            <ProtectedRoute roles={["GN"]}>
              <HouseholdVerify />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gn-certificates"
          element={
            <ProtectedRoute roles={["GN"]}>
              <GNCertificates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gn-households/detail"
          element={
            <ProtectedRoute roles={["GN"]}>
              <HouseholdDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gn-complaints"
          element={
            <ProtectedRoute roles={["GN"]}>
              <ComplaintManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gn-notices"
          element={
            <ProtectedRoute roles={["GN"]}>
              <PostNotice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gn-allowances"
          element={
            <ProtectedRoute roles={["GN"]}>
              <AllowancesAids />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gn/settings"
          element={
            <ProtectedRoute roles={["GN"]}>
              <GNSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gn-availability"
          element={
            <ProtectedRoute roles={["GN"]}>
              <GNAvailability />
            </ProtectedRoute>
          }
        />


        {/* Admin */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminStaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-verify-certificates"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminVerifyCertificates />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
