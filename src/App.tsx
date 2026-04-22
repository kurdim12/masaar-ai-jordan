import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import ChoosePath from "./pages/ChoosePath";
import Profile from "./pages/Profile";

import TravellerOnboarding from "./pages/traveller/TravellerOnboarding";
import TravellerDiscover from "./pages/traveller/TravellerDiscover";
import TravellerMap from "./pages/traveller/TravellerMap";
import GovernorateDetail from "./pages/traveller/GovernorateDetail";
import TripPlanner from "./pages/traveller/TripPlanner";
import TravellerChat from "./pages/traveller/TravellerChat";

import InvestorMap from "./pages/investor/InvestorMap";
import OpportunityDetail from "./pages/investor/OpportunityDetail";
import InvestmentSimulator from "./pages/investor/InvestmentSimulator";
import Tenders from "./pages/investor/Tenders";
import InvestorChat from "./pages/investor/InvestorChat";

import BusinessOnboarding from "./pages/business/BusinessOnboarding";
import BusinessDashboard from "./pages/business/BusinessDashboard";
import FlashOffer from "./pages/business/FlashOffer";
import EmergencyOffer from "./pages/business/EmergencyOffer";
import BusinessAnalytics from "./pages/business/BusinessAnalytics";
import BusinessChat from "./pages/business/BusinessChat";

const queryClient = new QueryClient();

const App = () => (
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

            <Route path="/traveller/onboarding" element={<TravellerOnboarding />} />
            <Route path="/traveller/discover" element={<TravellerDiscover />} />
            <Route path="/traveller/map" element={<TravellerMap />} />
            <Route path="/traveller/destination/:id" element={<GovernorateDetail />} />
            <Route path="/traveller/plan" element={<TripPlanner />} />
            <Route path="/traveller/chat" element={<TravellerChat />} />
            <Route path="/traveller/profile" element={<Profile />} />

            <Route path="/investor/map" element={<InvestorMap />} />
            <Route path="/investor/opportunity/:id" element={<OpportunityDetail />} />
            <Route path="/investor/simulator" element={<InvestmentSimulator />} />
            <Route path="/investor/tenders" element={<Tenders />} />
            <Route path="/investor/chat" element={<InvestorChat />} />
            <Route path="/investor/profile" element={<Profile />} />

            <Route path="/business/onboarding" element={<BusinessOnboarding />} />
            <Route path="/business/dashboard" element={<BusinessDashboard />} />
            <Route path="/business/offer" element={<FlashOffer />} />
            <Route path="/business/emergency" element={<EmergencyOffer />} />
            <Route path="/business/analytics" element={<BusinessAnalytics />} />
            <Route path="/business/chat" element={<BusinessChat />} />
            <Route path="/business/profile" element={<Profile />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
