import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { RoleGuard } from "@/components/RoleGuard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import ChoosePath from "./pages/ChoosePath";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Auth from "./pages/Auth";

import TravellerOnboarding from "./pages/traveller/TravellerOnboarding";
import TravellerDiscover from "./pages/traveller/TravellerDiscover";
import TravellerMap from "./pages/traveller/TravellerMap";
import GovernorateDetail from "./pages/traveller/GovernorateDetail";
import TripPlanner from "./pages/traveller/TripPlanner";
import TravellerChat from "./pages/traveller/TravellerChat";

import InvestorMap from "./pages/investor/InvestorMap";
import InvestorForecast from "./pages/investor/InvestorForecast";
import OpportunityDetail from "./pages/investor/OpportunityDetail";
import InvestmentSimulator from "./pages/investor/InvestmentSimulator";
import Tenders from "./pages/investor/Tenders";

import BusinessOnboarding from "./pages/business/BusinessOnboarding";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import FlashOffer from "./pages/business/FlashOffer";
import EmergencyOffer from "./pages/business/EmergencyOffer";
import BusinessAnalytics from "./pages/business/BusinessAnalytics";
import BusinessChat from "./pages/business/BusinessChat";

const queryClient = new QueryClient();

const T = ({ children }: { children: React.ReactNode }) => <RoleGuard allow="traveller">{children}</RoleGuard>;
const I = ({ children }: { children: React.ReactNode }) => <RoleGuard allow="investor">{children}</RoleGuard>;
const B = ({ children }: { children: React.ReactNode }) => <RoleGuard allow="business">{children}</RoleGuard>;

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/path" element={<ChoosePath />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />

            <Route path="/traveller/onboarding" element={<TravellerOnboarding />} />
            <Route path="/traveller/discover" element={<T><TravellerDiscover /></T>} />
            <Route path="/traveller/map" element={<T><TravellerMap /></T>} />
            <Route path="/traveller/destination/:id" element={<T><GovernorateDetail /></T>} />
            <Route path="/traveller/plan" element={<T><TripPlanner /></T>} />
            <Route path="/traveller/chat" element={<T><TravellerChat /></T>} />
            <Route path="/traveller/profile" element={<T><Profile /></T>} />

            <Route path="/investor/map" element={<I><InvestorMap /></I>} />
            <Route path="/investor/forecast" element={<I><InvestorForecast /></I>} />
            <Route path="/investor/opportunity/:id" element={<I><OpportunityDetail /></I>} />
            <Route path="/investor/simulator" element={<I><InvestmentSimulator /></I>} />
            <Route path="/investor/tenders" element={<I><Tenders /></I>} />
            <Route path="/investor/profile" element={<I><Profile /></I>} />

            <Route path="/business/onboarding" element={<BusinessOnboarding />} />
            <Route path="/business/dashboard" element={<B><BusinessDashboard /></B>} />
            <Route path="/business/offer" element={<B><FlashOffer /></B>} />
            <Route path="/business/emergency" element={<B><EmergencyOffer /></B>} />
            <Route path="/business/analytics" element={<B><BusinessAnalytics /></B>} />
            <Route path="/business/chat" element={<B><BusinessChat /></B>} />
            <Route path="/business/profile" element={<B><Profile /></B>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
