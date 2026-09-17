import { Toaster } from "@/components/ui/toaster";
import { BrowserRouter, Navigate, Routes, Route, useLocation, useSearchParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import FloatingActions from "./components/FloatingActions";
import SEOManager from "./components/SEOManager";
import Home from "./pages/Home";
import { SiteContentProvider } from "@/lib/siteContent";

const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminRegister = lazy(() => import("./pages/AdminRegister"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RouteFallback = () => (
  <div
    className="min-h-[40vh] flex items-center justify-center bg-slate-50 text-sm font-semibold text-slate-600"
    role="status"
    aria-live="polite"
  >
    Loading...
  </div>
);

const LegacyReviewRedirect = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim();
  const destination = token ? `/?reviewToken=${encodeURIComponent(token)}#reviews` : "/#reviews";

  return <Navigate to={destination} replace />;
};

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen relative">
      <SEOManager />
      {!isAdminRoute && <Navigation />}
      <main className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/write-review" element={<LegacyReviewRedirect />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingActions />}
      <Toaster />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <SiteContentProvider>
      <AppLayout />
    </SiteContentProvider>
  </BrowserRouter>
);

export default App;
