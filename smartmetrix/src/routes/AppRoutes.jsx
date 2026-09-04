import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import UserDashboard from '../pages/UserDashboard';
import NewInspection from '../pages/NewInspection';
import InspectionPreview from '../pages/InspectionPreview';
import InspectionProcessing from '../pages/InspectionProcessing';
import InspectionResult from '../pages/InspectionResult';
import InspectionHistory from '../pages/InspectionHistory';
import InspectionDetails from '../pages/InspectionDetails';
import AdminDashboard from '../pages/AdminDashboard';
import AdminQueue from '../pages/AdminQueue';
import AdminReview from '../pages/AdminReview';
import AdminResult from '../pages/AdminResult';
import Reports from '../pages/Reports';
import Rules from '../pages/Rules';
import RulesRegistry from '../pages/RulesRegistry';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rules-registry" element={<RulesRegistry />} />
      </Route>

      {/* User / Enforcement Officer Routes */}
      <Route element={<UserLayout />}>
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/new-inspection" element={<NewInspection />} />
        <Route path="/user/inspection-preview" element={<InspectionPreview />} />
        <Route path="/user/inspection-processing/:id" element={<InspectionProcessing />} />
        <Route path="/user/inspection-result/:id" element={<InspectionResult />} />
        <Route path="/user/inspection-history" element={<InspectionHistory />} />
        <Route path="/user/inspection-details/:id" element={<InspectionDetails />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin / Verification Officer Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/queue" element={<AdminQueue />} />
        <Route path="/admin/review/:id" element={<AdminReview />} />
        <Route path="/admin/result/:id" element={<AdminResult />} />
        <Route path="/admin/rules" element={<Rules />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
