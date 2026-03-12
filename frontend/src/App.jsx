import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { api } from './api/client';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Navbar } from './components/layout/Navbar';
import { OwnerSubnav } from './components/layout/OwnerSubnav';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { ToastViewport } from './components/shared/ToastViewport';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ItemDetailPage } from './pages/ItemDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { LoginPage } from './pages/owner/LoginPage';
import { DashboardPage } from './pages/owner/DashboardPage';
import { ProductsPage } from './pages/owner/ProductsPage';
import { ProductEditorPage } from './pages/owner/ProductEditorPage';
import { LeadsPage } from './pages/owner/LeadsPage';
import { AnalyticsPage } from './pages/owner/AnalyticsPage';
import { ReviewsPage } from './pages/owner/ReviewsPage';
import { SettingsPage } from './pages/owner/SettingsPage';

function PublicLayout({ profile, children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AnnouncementBar text={profile?.announcementText || 'Local mobile sales, accessories, and service support.'} />
      <Navbar profile={profile} />
      <main className="pb-32 lg:pb-24">{children}</main>
      <Footer profile={profile} />
      <MobileBottomNav />
    </div>
  );
}

function OwnerLayout({ profile, children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar profile={profile} />
      <main className="container-shell pb-32 pt-8">
        <OwnerSubnav />
        {children}
      </main>
      <MobileBottomNav owner />
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/store/profile').then((data) => setProfile(data.profile)).catch(() => undefined);
  }, []);

  return (
    <>
      <ToastViewport />
      <Routes>
        <Route path="/" element={<PublicLayout profile={profile}><HomePage profile={profile} /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout profile={profile}><CatalogPage itemType="" title="All products and services" /></PublicLayout>} />
        <Route path="/mobiles" element={<PublicLayout profile={profile}><CatalogPage itemType="mobile" title="Mobiles" /></PublicLayout>} />
        <Route path="/accessories" element={<PublicLayout profile={profile}><CatalogPage itemType="accessory" title="Accessories" /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout profile={profile}><CatalogPage itemType="service" title="Services" /></PublicLayout>} />
        <Route path="/item/:slug" element={<PublicLayout profile={profile}><ItemDetailPage profile={profile} /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout profile={profile}><AboutPage profile={profile} /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout profile={profile}><ContactPage profile={profile} /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout profile={profile}><PrivacyPage /></PublicLayout>} />
        <Route path="/owner/login" element={<LoginPage />} />
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute>
              <OwnerLayout profile={profile}>
                <DashboardPage />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/products"
          element={
            <ProtectedRoute>
              <OwnerLayout profile={profile}>
                <ProductsPage />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/products/new"
          element={
            <ProtectedRoute>
              <OwnerLayout profile={profile}>
                <ProductEditorPage />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/products/:id/edit"
          element={
            <ProtectedRoute>
              <OwnerLayout profile={profile}>
                <ProductEditorPage />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/reviews"
          element={
            <ProtectedRoute>
              <OwnerLayout profile={profile}>
                <ReviewsPage />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/leads"
          element={
            <ProtectedRoute>
              <OwnerLayout profile={profile}>
                <LeadsPage />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/analytics"
          element={
            <ProtectedRoute>
              <OwnerLayout profile={profile}>
                <AnalyticsPage />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/settings"
          element={
            <ProtectedRoute>
              <OwnerLayout profile={profile}>
                <SettingsPage profile={profile} setProfile={setProfile} />
              </OwnerLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
