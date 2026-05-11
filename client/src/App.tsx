import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Auth
import LandingPage from './features/LandingPage'
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'

// Admin
import DashboardPage from './features/admin/DashboardPage'

import PendingReportsPage from './features/admin/PendingReportsPage'
import AlertsPage from './features/admin/AlertsPage'
import ActivityHistoryPage from './features/admin/ActivityHistoryPage'
import ProfilePage from './features/admin/ProfilePage'
import EditProfile from './features/admin/EditProfile'

// Student
import StudentDashboard from './features/student/StudentDashboard'
import StudentProfile from './features/student/StudentProfile'
import StudentEditProfile from './features/student/StudentEditProfile'
import StudentCreateReport from './features/student/CreateReport'
import StudentReports from './features/student/Reports'

// Accessibility
import AccessibilityDashboard from './features/accessibility/AccessibilityDashboard'
import AccessibilityProfile from './features/accessibility/AccessibilityProfile'
import AccessibilityEditProfile from './features/accessibility/AccessibilityEditProfile'
import AccessibilityAlertPage from './features/accessibility/AlertPage'
import AccessibilityNavegationSettings from './features/accessibility/NavegationSettings'
import AccessibilityAudioSettings from './features/accessibility/AudioSettings'
import AccessibilityVibrationSettings from './features/accessibility/VibrationSettings'
import NavegationDashboard from './features/accessibility/NavegationDashboard'

const App = () => {
  const { token, user } = useAuth()
  const role = user?.role
  const isAdmin = token && role === 'admin'
  const isStudent = token && role === 'student'
  const isAccessibility = token && role === 'accessibility'

  return (
    <Routes>
      <Route path="/"          element={<LandingPage />} />
      <Route path="/login"     element={<LoginPage />} />
      <Route path="/register"  element={<RegisterPage />} />

      <Route path="/admin/dashboard"    element={isAdmin ? <DashboardPage />       : <Navigate to="/login" />} />

      <Route path="/admin/reports"      element={isAdmin ? <PendingReportsPage />  : <Navigate to="/login" />} />
      <Route path="/admin/alerts"       element={isAdmin ? <AlertsPage />          : <Navigate to="/login" />} />
      <Route path="/admin/activity"     element={isAdmin ? <ActivityHistoryPage /> : <Navigate to="/login" />} />
      <Route path="/admin/profile"      element={isAdmin ? <ProfilePage />         : <Navigate to="/login" />} />
      <Route path="/admin/profile/edit" element={isAdmin ? <EditProfile />         : <Navigate to="/login" />} />


      <Route path="/student/dashboard"      element={isStudent ? <StudentDashboard />     : <Navigate to="/login" />} />
      <Route path="/student/profile"        element={isStudent ? <StudentProfile />       : <Navigate to="/login" />} />
      <Route path="/student/profile/edit"   element={isStudent ? <StudentEditProfile />   : <Navigate to="/login" />} />
      <Route path="/student/reports/create" element={isStudent ? <StudentCreateReport />  : <Navigate to="/login" />} />
      <Route path="/student/reports"        element={isStudent ? <StudentReports />       : <Navigate to="/login" />} />


      <Route path="/accessibility/dashboard"              element={isAccessibility ? <AccessibilityDashboard />          : <Navigate to="/login" />} />
      <Route path="/accessibility/profile"                element={isAccessibility ? <AccessibilityProfile />            : <Navigate to="/login" />} />
      <Route path="/accessibility/profile/edit"           element={isAccessibility ? <AccessibilityEditProfile />        : <Navigate to="/login" />} />
      <Route path="/accessibility/alerts"                 element={isAccessibility ? <AccessibilityAlertPage />          : <Navigate to="/login" />} />
      <Route path="/accessibility/settings/navigation"    element={isAccessibility ? <AccessibilityNavegationSettings /> : <Navigate to="/login" />} />
      <Route path="/accessibility/settings/audio"         element={isAccessibility ? <AccessibilityAudioSettings />      : <Navigate to="/login" />} />
      <Route path="/accessibility/settings/vibration"     element={isAccessibility ? <AccessibilityVibrationSettings />  : <Navigate to="/login" />} />
      <Route path="/accessibility/navegation"             element={isAccessibility ? <NavegationDashboard />          : <Navigate to="/login" />} />

      <Route path="*" element={<Navigate to={token ? '/admin/dashboard' : '/login'} />} />
    </Routes>
  )
}

export default App