import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminRouteGuard } from './components/common/AdminRouteGuard';
import { ROUTES } from './config/routes';

// Pages
import { HomePage } from './pages/HomePage';
import { NumberAnalysisPage } from './pages/NumberAnalysisPage';
import { NumberResultPage } from './pages/NumberResultPage';
import { PersonalityTestPage } from './pages/PersonalityTestPage';
import { PersonalityResultPage } from './pages/PersonalityResultPage';
import { NumberDetailPage } from './pages/NumberDetailPage';
import { PersonalityTypesPage } from './pages/PersonalityTypesPage';
import { PersonalityTypeDetailPage } from './pages/PersonalityTypeDetailPage';
import { AboutPage } from './pages/AboutPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailedPage } from './pages/PaymentFailedPage';
import { ReportViewPage } from './pages/ReportViewPage';
import { SharePage } from './pages/SharePage';
import { AdminPlaceholderPage } from './pages/admin/AdminPlaceholderPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Application Routes */}
        <Route path={ROUTES.HOME} element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.NUMBER_ANALYSIS} element={<NumberAnalysisPage />} />
          <Route path={ROUTES.NUMBER_RESULT} element={<NumberResultPage />} />
          <Route path={ROUTES.PERSONALITY_TEST} element={<PersonalityTestPage />} />
          <Route path={ROUTES.PERSONALITY_TEST_TIER} element={<PersonalityTestPage />} />
          <Route path={ROUTES.PERSONALITY_RESULT} element={<PersonalityResultPage />} />
          <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={ROUTES.PAYMENT_SUCCESS} element={<PaymentSuccessPage />} />
          <Route path={ROUTES.PAYMENT_FAILED} element={<PaymentFailedPage />} />
          <Route path={ROUTES.REPORT} element={<ReportViewPage />} />
          <Route path={ROUTES.SHARE} element={<SharePage />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.PERSONALITY_TYPES} element={<PersonalityTypesPage />} />
          <Route path={ROUTES.PERSONALITY_TYPE_DETAIL} element={<PersonalityTypeDetailPage />} />
          <Route path={ROUTES.NUMBER_DETAIL} element={<NumberDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Protected Routes Architecture */}
        <Route
          path={ROUTES.ADMIN}
          element={
            <AdminRouteGuard>
              <AdminLayout />
            </AdminRouteGuard>
          }
        >
          <Route index element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_USERS} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_QUESTIONS} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_NUMBERS} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_PERSONALITY_TYPES} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_PRODUCTS} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_REPORTS} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_PAYMENTS} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_ANALYTICS} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_AI} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_AUDIT_LOGS} element={<AdminPlaceholderPage />} />
          <Route path={ROUTES.ADMIN_SETTINGS} element={<AdminPlaceholderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
