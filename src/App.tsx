import React, { useState, useEffect, Suspense, lazy } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Order, Template, Customer } from './types';
import {
  getStoredOrders,
  getStoredTemplates,
  getStoredCustomers,
  updateOrderInStorage,
  addChangeRequestToOrder
} from './lib/storage';
import { AIAssistantDrawer } from './modules/admin';
import { auth } from './lib/firebase';

// Code-split Lazy Component Imports for optimal bundle separation
const LandingPage = lazy(() => import('./pages/LandingPage'));

const AdminLayout = lazy(() => import('./layouts/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage'));
const AdminCustomersPage = lazy(() => import('./pages/admin/AdminCustomersPage'));
const AdminTemplatesPage = lazy(() => import('./pages/admin/AdminTemplatesPage'));
const AdminPublishedPage = lazy(() => import('./pages/admin/AdminPublishedPage'));
const AdminCheckInPage = lazy(() => import('./pages/admin/AdminCheckInPage'));
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'));
const AdminEditorPage = lazy(() => import('./pages/admin/AdminEditorPage'));
const AdminInvitationsPage = lazy(() => import('./pages/admin/AdminInvitationsPage'));

const CustomerLayout = lazy(() => import('./layouts/CustomerLayout').then(m => ({ default: m.CustomerLayout })));
const CustomerLoginPage = lazy(() => import('./pages/customer/CustomerLoginPage'));
const CustomerDashboardPage = lazy(() => import('./pages/customer/CustomerDashboardPage'));

const GuestLayout = lazy(() => import('./layouts/GuestLayout').then(m => ({ default: m.GuestLayout })));
const GuestInvitationPage = lazy(() => import('./pages/guest/GuestInvitationPage'));
const GuestWallPage = lazy(() => import('./pages/guest/GuestWallPage'));
const GuestLivePage = lazy(() => import('./pages/guest/GuestLivePage'));

const CheckInConsolePage = lazy(() => import('./pages/checkin/CheckInConsolePage'));

// Elegant loading spinner component
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-[#0f0c0a] flex items-center justify-center p-6 text-center">
    <div className="space-y-3">
      <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto" />
      <p className="text-xs font-serif text-[#f9e5af] uppercase tracking-widest animate-pulse">
        ЗАЛЛАГА — АЧААЛЖ БАЙНА...
      </p>
    </div>
  </div>
);

export function AppContent() {
  // Admin access is granted only after Firebase Authentication is verified by the server.
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Customer Auth State (localStorage with default fallback for direct access)
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string>(() => {
    return localStorage.getItem('customer_login_email') || 'bolor@gmail.com';
  });

  // Global Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // AI Assistant State
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [activeEditorOrderId, setActiveEditorOrderId] = useState<string | null>(null);

  // Initial Data Load
  useEffect(() => {
    setOrders(getStoredOrders());
    setTemplates(getStoredTemplates());
    setCustomers(getStoredCustomers());
  }, []);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    if (!user) setIsAdminAuthenticated(false);
  }), []);

  const handleAdminLogout = async () => {
    await signOut(auth);
    setIsAdminAuthenticated(false);
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem('customer_login_email');
    setAuthenticatedEmail('');
  };

  // Order Handlers
  const handleSaveOrder = (updatedOrder: Order) => {
    const updatedList = updateOrderInStorage(updatedOrder);
    setOrders([...updatedList]);
  };

  const handlePublishOrder = (updatedOrder: Order) => {
    const published: Order = {
      ...updatedOrder,
      status: 'Published'
    };
    handleSaveOrder(published);
  };

  const handleCreateOrder = (newOrder: Order) => {
    const updatedList = updateOrderInStorage(newOrder);
    setOrders([...updatedList]);
  };

  const handleCustomerRequestChange = (orderId: string, note: string) => {
    const updated = addChangeRequestToOrder(orderId, note);
    if (updated) {
      setOrders(getStoredOrders());
    }
  };

  const editingOrder = orders.find(o => o.id === activeEditorOrderId) || orders[0];

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        {/* PUBLIC LANDING PAGE */}
        <Route
          path="/"
          element={
            <LandingPage
              templates={templates}
              onCreateOrder={handleCreateOrder}
            />
          }
        />

        {/* ADMIN SUBSYSTEM ROUTES */}
        <Route
          path="/admin/login"
          element={
            <AdminLoginPage
              onLoginSuccess={() => setIsAdminAuthenticated(true)}
            />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminLayout
              isAdminAuthenticated={isAdminAuthenticated}
              onLogout={handleAdminLogout}
              onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
            />
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <AdminDashboardPage
                orders={orders}
                templates={templates}
                customers={customers}
              />
            }
          />
          <Route
            path="orders"
            element={
              <AdminOrdersPage
                orders={orders}
                templates={templates}
                onCreateOrder={handleCreateOrder}
                onUpdateOrder={handleSaveOrder}
              />
            }
          />
          <Route
            path="customers"
            element={
              <AdminCustomersPage
                customers={customers}
                orders={orders}
              />
            }
          />
          <Route
            path="templates"
            element={
              <AdminTemplatesPage
                templates={templates}
                orders={orders}
                onCreateOrder={handleCreateOrder}
              />
            }
          />
          <Route
            path="published"
            element={
              <AdminPublishedPage orders={orders} />
            }
          />
          <Route
            path="checkin"
            element={
              <AdminCheckInPage
                orders={orders}
                onUpdateOrder={handleSaveOrder}
              />
            }
          />
          <Route
            path="analytics"
            element={
              <AdminAnalyticsPage orders={orders} />
            }
          />
          <Route
            path="invitations"
            element={
              <AdminInvitationsPage />
            }
          />
          <Route
            path="editor/:orderId"
            element={
              <AdminEditorPage
                orders={orders}
                onSaveOrder={handleSaveOrder}
                onPublishOrder={handlePublishOrder}
                onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
              />
            }
          />
        </Route>

        {/* CUSTOMER PORTAL SUBSYSTEM ROUTES */}
        <Route path="/costumer" element={<Navigate to="/customer" replace />} />
        <Route path="/costumer/*" element={<Navigate to="/customer" replace />} />

        <Route
          path="/customer/login"
          element={
            <CustomerLoginPage
              orders={orders}
              onLoginSuccess={(email) => setAuthenticatedEmail(email)}
            />
          }
        />

        <Route
          path="/customer"
          element={
            authenticatedEmail ? (
              <CustomerLayout
                authenticatedEmail={authenticatedEmail}
                onLogout={handleCustomerLogout}
              />
            ) : (
              <Navigate to="/customer/login" replace />
            )
          }
        >
          <Route
            index
            element={
              <CustomerDashboardPage
                orders={orders}
                onRequestChange={handleCustomerRequestChange}
                onOpenGuestView={(ord) => window.open(`/invite/${ord.uniqueSlug || ord.id}`, '_blank')}
                onUpdateOrder={handleSaveOrder}
              />
            }
          />
        </Route>

        {/* GUEST PUBLIC INVITATION SUBSYSTEM ROUTES */}
        <Route path="/invite" element={<Navigate to="/invite/demo" replace />} />
        <Route element={<GuestLayout />}>
          <Route
            path="/invite/:slug"
            element={<GuestInvitationPage orders={orders} />}
          />
          <Route
            path="/wall/:slug"
            element={<GuestWallPage orders={orders} />}
          />
        </Route>

        {/* STANDALONE LIVE SCREEN & CHECK-IN ROUTES */}
        <Route
          path="/live/:slug"
          element={<GuestLivePage orders={orders} />}
        />
        <Route
          path="/checkin/:slug"
          element={
            <CheckInConsolePage
              orders={orders}
              onUpdateOrder={handleSaveOrder}
            />
          }
        />
        <Route
          path="/checkin"
          element={
            <CheckInConsolePage
              orders={orders}
              onUpdateOrder={handleSaveOrder}
            />
          }
        />

        {/* FALLBACK CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* GLOBAL AI ASSISTANT DRAWER FOR ADMIN */}
      {editingOrder && isAiAssistantOpen && (
        <AIAssistantDrawer
          isOpen={isAiAssistantOpen}
          onClose={() => setIsAiAssistantOpen(false)}
          invitationData={editingOrder.invitationData}
          aiCallCount={editingOrder.aiCallCount || 0}
          onIncrementAiCallCount={() => {
            const updated = {
              ...editingOrder,
              aiCallCount: (editingOrder.aiCallCount || 0) + 1
            };
            handleSaveOrder(updated);
          }}
          onApplyGeneratedText={(field, value) => {
            const updatedInv = {
              ...editingOrder.invitationData,
              [field]: value
            };
            handleSaveOrder({
              ...editingOrder,
              invitationData: updatedInv
            });
          }}
          onApplyTemplateData={(data) => {
            const updatedInv = {
              ...editingOrder.invitationData,
              ...data
            };
            handleSaveOrder({
              ...editingOrder,
              invitationData: updatedInv
            });
          }}
        />
      )}
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
