/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DemoProvider } from './context/DemoContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ViewingModal } from './components/ViewingModal';
import { AskGNSWidget } from './components/AskGNSWidget';
import { PageTransition } from './components/PageTransitionOverlay';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AboutPage } from './pages/AboutPage';
import { TeamPage } from './pages/TeamPage';
import { ContactPage } from './pages/ContactPage';
import { DemoWorkspacePage } from './pages/DemoWorkspacePage';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  const [viewingModalOpen, setViewingModalOpen] = useState(false);
  const [viewingTarget, setViewingTarget] = useState<{ title?: string; id?: string }>({});

  const handleOpenViewingModal = (title?: string, id?: string) => {
    setViewingTarget({ title, id });
    setViewingModalOpen(true);
  };

  return (
    <DemoProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#202020] selection:bg-[#D6A536] selection:text-[#202020]">
          {/* Header */}
          <Header onOpenViewingModal={handleOpenViewingModal} />

          {/* Main Content Area */}
          <main className="flex-1">
            <PageTransition>
              <Routes>
                <Route
                  path="/"
                  element={<HomePage onOpenViewingModal={handleOpenViewingModal} />}
                />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route
                  path="/properties/:slug"
                  element={<PropertyDetailPage onOpenViewingModal={handleOpenViewingModal} />}
                />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/demo-workspace" element={<DemoWorkspacePage />} />

                {/* Fallback */}
                <Route
                  path="*"
                  element={<HomePage onOpenViewingModal={handleOpenViewingModal} />}
                />
              </Routes>
            </PageTransition>
          </main>

          {/* Footer */}
          <Footer />

          {/* Global Viewing Modal */}
          <ViewingModal
            isOpen={viewingModalOpen}
            onClose={() => setViewingModalOpen(false)}
            propertyTitle={viewingTarget.title}
            propertyId={viewingTarget.id}
          />

          {/* Ask GNS Floating Assistant Widget */}
          <AskGNSWidget onOpenViewingModal={handleOpenViewingModal} />
        </div>
      </BrowserRouter>
    </DemoProvider>
  );
}
