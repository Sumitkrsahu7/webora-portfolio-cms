import { Navigate, Route, Routes } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import Home from './pages/Home'
import AboutPage from './pages/About'
import ServicesPage from './pages/Services'
import ServiceDetailPage from './pages/ServiceDetail'
import PricingPage from './pages/Pricing'
import OurWorkPage from './pages/OurWork'
import RequestQuotePage from './pages/RequestQuote'
import FaqPage from './pages/Faq'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Resume from './pages/Resume'
import ExperiencePage from './pages/Experience'
import {
  Skills,
  Testimonials,
  Contact,
  Profile,
  NotFound
} from './pages/StaticPages'
import './pages.css'

export default function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/our-work" element={<OurWorkPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/request-quote" element={<RequestQuotePage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/careers" element={<Navigate to="/experience" replace />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/cv" element={<Navigate to="/resume" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SiteLayout>
  )
}