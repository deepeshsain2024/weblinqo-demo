import '@fontsource/poppins'; // Defaults to weight 400
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/auth/protected-route';
import PublicRoute from './components/auth/public-route';
import Login from './pages/auth/login';
import ForgotPassword from './pages/auth/forgot-password';
import Admin from './pages/admin/admin';
import SignupPage from './pages/auth/signup-page';
import VerifyOTPPage from './pages/auth/verify-otp-page';
import ProfilePage from './pages/user/onboarding/link-in-bio/profile-page';
import LinksPage from './pages/user/onboarding/link-in-bio/links-page';
import TemplatePage from './pages/user/onboarding/link-in-bio/template-page';
import PricingPage from './pages/user/onboarding/pricing-page';
import ChangePlan from './pages/user/change-plan';
import SlugPage from './pages/user/onboarding/slug-page';
import PaymentSuccessPage from './pages/user/onboarding/payment-success-page';
import PaymentCancelPage from './pages/user/onboarding/payment-cancel-page';
import GoalPage from './pages/user/onboarding/goal-page';
import NotFound from './pages/not-found';
import CategoryPage from './pages/user/onboarding/category-page';
import ModuleSelectionPage from './pages/user/onboarding/module-selection-page';
import DCIdentityPage from './pages/user/onboarding/digital-card/identity-page';
import DCContactPage from './pages/user/onboarding/digital-card/contact-page';
import DCSocialPage from './pages/user/onboarding/digital-card/social-page';
import DCTemplatePage from './pages/user/onboarding/digital-card/template-page';
import UserProfile from './pages/user/link-in-bio/user-profile';
import { Toaster } from 'react-hot-toast';
import AdminLogin from './pages/admin/admin-login';
import AdminProtectedRoute from './components/auth/admin-protected-route';
import Terms from './pages/terms';
import Privacy from './pages/privacy';
import Contact from './pages/auth/contact';
import WebLinqoLanding from './pages/user/landing-page';
import LandingPricingPage from './pages/user/landing-page/pricing';
import TemplatesPage from './pages/user/landing-page/templates';
import useTokenRefresher from './hooks/useTokenRefresh';
import GlobalLoader from './components/shared/global-loader';

// Layout components
import LandingLayout from './components/layouts/landing-layout';
import DashboardLayout from './components/layouts/dashboard-layout';

// Dashboard pages
import DCLinksPage from './pages/user/digital-card/links-page';
import DCAppearancePage from './pages/user/digital-card/appearance-page';
import DCAnalyticsPage from './pages/user/digital-card/analytics-page';
import SettingsPage from './pages/user/settings-page';
import DigitalCardWrapper from './components/user/digital-card/digital-card-wrapper';
import LinkInBioWrapper from './components/user/link-in-bio/link-in-bio-wrapper';
import DigitalCardTemp from './pages/user/landing-page/digital-card';
import DCUserProfile from './pages/user/digital-card/user-profile';
import AccountPage from './pages/user/account-page';
import PaymentPage from './pages/payment-page';
import About from './pages/user/about-us';

function App() {
  // Initialize token refresh hook for automatic token management
  useTokenRefresher();
  
  return (
    <>
      <GlobalLoader />
      <Toaster position="top-center" />
      <Routes>
        {/* Landing Layout Routes */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<WebLinqoLanding />} />
          <Route path="pricing" element={<LandingPricingPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="terms" element={<Terms />} />
          <Route path="digital-card-templates" element={<DigitalCardTemp />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="contact" element={<Contact />} />
          <Route path="about" element={<About />} />
          <Route path="signup" element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          } />
          <Route path="login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="forgot-password" element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } />
          <Route path="verify" element={<VerifyOTPPage />} />
        </Route>

        {/* Dashboard Layout Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<LinkInBioWrapper />} />
          <Route path="appearance" element={<LinkInBioWrapper />} />
          <Route path="analytics" element={<LinkInBioWrapper />} />
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Digital Card Routes */}
          <Route path="digital-card" element={<DigitalCardWrapper />}>
            <Route index element={<DCLinksPage />} />
            <Route path="links" element={<DCLinksPage />} />
            <Route path="appearance" element={<DCAppearancePage />} />
            <Route path="analytics" element={<DCAnalyticsPage />} />
          </Route>
        </Route>

        {/* Module Selection Route */}
        <Route path="/onboarding/module-selection" element={
          <ProtectedRoute>
            <ModuleSelectionPage />
          </ProtectedRoute>
        } />

        {/* Digital Card Onboarding Routes */}
        <Route path="/onboarding/card-identity" element={
          <ProtectedRoute>
            <DCIdentityPage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/card-contact" element={
          <ProtectedRoute>
            <DCContactPage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/card-social-web" element={
          <ProtectedRoute>
            <DCSocialPage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/card-template" element={
          <ProtectedRoute>
            <DCTemplatePage />
          </ProtectedRoute>
        } />

        {/* Link-in-Bio Onboarding Routes */}
        <Route path="/onboarding/slug" element={
          <ProtectedRoute>
            <SlugPage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/goal" element={
          <ProtectedRoute>
            <GoalPage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/category" element={
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/pricing" element={
          <ProtectedRoute>
            <PricingPage />
          </ProtectedRoute>
        } />
        <Route path="/change-plan" element={
          <ProtectedRoute>
            <ChangePlan />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/template" element={
          <ProtectedRoute>
            <TemplatePage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/links" element={
          <ProtectedRoute>
            <LinksPage />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/account" element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        } />
        <Route path="/payment-card" element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="/link/:slug" element={<UserProfile />} />
        <Route path="/card/:slug" element={<DCUserProfile />} />

        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/cancel" element={<PaymentCancelPage />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={
          <AdminProtectedRoute>
            <Admin />
          </AdminProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
