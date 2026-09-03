import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './authStore'
import { Layout } from './components'
import { HomePage } from './pages'
import {
  MatchPage,
  SchedulePage,
  TournamentPage,
  TournamentsPage,
} from './pagesExtra'
import { LibraryPage, LoginPage, ProfilePage, SearchPage } from './pagesProfile'
import { PrivacyPage, TermsPage } from './pagesLegal'
import { UserProvider } from './userStore'
import './index.css'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { signedIn } = useAuth()
  if (!signedIn) return <Navigate to="/login" replace />
  return children
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="schedule" element={<SchedulePage />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="tournaments" element={<TournamentsPage />} />
              <Route path="tournament/:id" element={<TournamentPage />} />
              <Route path="match/:id" element={<MatchPage />} />
              <Route
                path="profile"
                element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                }
              />
              <Route
                path="library"
                element={
                  <RequireAuth>
                    <LibraryPage />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)
