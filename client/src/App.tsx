import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ProtectedRoute, RoleRoute } from '@/app/router/ProtectedRoute';

import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';

import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import JobListPage from '@/pages/JobListPage';
import JobDetailPage from '@/pages/JobDetailPage';

import CandidateDashboardPage from '@/pages/candidate/CandidateDashboardPage';
import CandidateProfilePage from '@/pages/candidate/CandidateProfilePage';
import CandidateApplicationsPage from '@/pages/candidate/CandidateApplicationsPage';
import CandidateBookmarksPage from '@/pages/candidate/CandidateBookmarksPage';

import RecruiterDashboardPage from '@/pages/recruiter/RecruiterDashboardPage';
import RecruiterJobsPage from '@/pages/recruiter/RecruiterJobsPage';
import RecruiterJobFormPage from '@/pages/recruiter/RecruiterJobFormPage';
import RecruiterApplicationsPage from '@/pages/recruiter/RecruiterApplicationsPage';

import AdminDashboardPage from '@/pages/admin/AdminDashboardPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminJobsPage from '@/pages/admin/AdminJobsPage';
import AdminApplicationsPage from '@/pages/admin/AdminApplicationsPage';

import NotFoundPage from '@/pages/NotFoundPage';

const candidateNav = [
  { to: '/candidate/dashboard', label: 'Dashboard' },
  { to: '/candidate/applications', label: 'My Applications' },
  { to: '/candidate/bookmarks', label: 'Saved Jobs' },
  { to: '/candidate/profile', label: 'Profile' },
];

const recruiterNav = [
  { to: '/recruiter/dashboard', label: 'Dashboard' },
  { to: '/recruiter/jobs', label: 'My Jobs' },
];

const adminNav = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/jobs', label: 'Jobs' },
  { to: '/admin/applications', label: 'Applications' },
];

export default function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/jobs" element={<JobListPage />} />
              <Route path="/jobs/:id" element={<JobDetailPage />} />
            </Route>

            {/* Candidate routes */}
            <Route element={<RoleRoute roles={['CANDIDATE']} />}>
              <Route element={<DashboardLayout navItems={candidateNav} />}>
                <Route path="/candidate/dashboard" element={<CandidateDashboardPage />} />
                <Route path="/candidate/applications" element={<CandidateApplicationsPage />} />
                <Route path="/candidate/bookmarks" element={<CandidateBookmarksPage />} />
                <Route path="/candidate/profile" element={<CandidateProfilePage />} />
              </Route>
            </Route>

            {/* Recruiter routes */}
            <Route element={<RoleRoute roles={['RECRUITER']} />}>
              <Route element={<DashboardLayout navItems={recruiterNav} />}>
                <Route path="/recruiter/dashboard" element={<RecruiterDashboardPage />} />
                <Route path="/recruiter/jobs" element={<RecruiterJobsPage />} />
                <Route path="/recruiter/jobs/new" element={<RecruiterJobFormPage mode="create" />} />
                <Route path="/recruiter/jobs/:id/edit" element={<RecruiterJobFormPage mode="edit" />} />
                <Route path="/recruiter/jobs/:jobId/applications" element={<RecruiterApplicationsPage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<RoleRoute roles={['ADMIN']} />}>
              <Route element={<DashboardLayout navItems={adminNav} />}>
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/jobs" element={<AdminJobsPage />} />
                <Route path="/admin/applications" element={<AdminApplicationsPage />} />
              </Route>
            </Route>

            {/* Fallback: authenticated but no role matched, or unknown route */}
            <Route element={<ProtectedRoute />}>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}
