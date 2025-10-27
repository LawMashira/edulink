import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import AttendanceList from './components/Attendance/AttendanceList';
import FeeManagement from './components/Fees/FeeManagement';
import ResultsManagement from './components/Results/ResultsManagement';
import NoticesList from './components/Notices/NoticesList';
import SchoolSetup from './components/SchoolSetup/SchoolSetup';
import StudentsList from './components/Students/StudentsList';
import TeachersList from './components/Teachers/TeachersList';
import ClassesList from './components/Classes/ClassesList';
import HomeworkList from './components/Homework/HomeworkList';
import MyClassesList from './components/MyClasses/MyClassesList';
import ReportsList from './components/Reports/ReportsList';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import SchoolsList from './components/Schools/SchoolsList';
import SupportCenter from './components/Support/SupportCenter';
import MyResultsList from './components/MyResults/MyResultsList';
import LandingPage from './components/Landing/LandingPage';
import AIAnalyticsDashboard from './components/Analytics/AIAnalyticsDashboard';
import HealthManagement from './components/Health/HealthManagement';
import EducationalMarketplace from './components/Marketplace/EducationalMarketplace';
import SchoolBranding from './components/Customization/SchoolBranding';
import InviteUser from './components/Auth/InviteUser';
import './App.css';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <SignUp />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute>
            <Layout>
              <AttendanceList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/fees"
        element={
          <ProtectedRoute>
            <Layout>
              <FeeManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <Layout>
              <ResultsManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notices"
        element={
          <ProtectedRoute>
            <Layout>
              <NoticesList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/school-setup"
        element={
          <ProtectedRoute>
            <Layout>
              <SchoolSetup />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute>
            <Layout>
              <StudentsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teachers"
        element={
          <ProtectedRoute>
            <Layout>
              <TeachersList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <ProtectedRoute>
            <Layout>
              <ClassesList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/homework"
        element={
          <ProtectedRoute>
            <Layout>
              <HomeworkList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-classes"
        element={
          <ProtectedRoute>
            <Layout>
              <MyClassesList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <ReportsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <AnalyticsDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/schools"
        element={
          <ProtectedRoute>
            <Layout>
              <SchoolsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <Layout>
              <SupportCenter />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-results"
        element={
          <ProtectedRoute>
            <Layout>
              <MyResultsList />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-analytics"
        element={
          <ProtectedRoute>
            <Layout>
              <AIAnalyticsDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/health"
        element={
          <ProtectedRoute>
            <Layout>
              <HealthManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute>
            <Layout>
              <EducationalMarketplace />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/branding"
        element={
          <ProtectedRoute>
            <Layout>
              <SchoolBranding />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/invite"
        element={
          <ProtectedRoute>
            <InviteUser />
          </ProtectedRoute>
        }
      />
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
