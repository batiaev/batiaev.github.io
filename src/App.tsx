import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleTagManager } from "@/components/GoogleTagManager";

const Index = lazy(() => import("./pages/Index"));
const Advisory = lazy(() => import("./pages/Advisory"));
const Tools = lazy(() => import("./pages/Tools"));
const LearnIndex = lazy(() => import("./pages/learn/LearnIndex"));
const LearnRoute = lazy(() => import("./pages/learn/LearnRoute"));
const OptionsPnl = lazy(() => import("./pages/OptionsPnl"));
const TakeHome = lazy(() => import("./pages/TakeHome"));
const OfferCalculator = lazy(() => import("./pages/OfferCalculator"));
const Hedging = lazy(() => import("./pages/Hedging"));
const Smile = lazy(() => import("./pages/Smile"));
const Retirement = lazy(() => import("./pages/Retirement"));
const NotFound = lazy(() => import("./pages/NotFound"));

const LoadingFallback = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      gcTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GoogleTagManager />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/advisory" element={<Advisory />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/learn" element={<LearnIndex />} />
            <Route path="/learn/*" element={<LearnRoute />} />
            <Route path="/tools/options-pnl" element={<OptionsPnl />} />
            <Route path="/tools/take-home" element={<TakeHome />} />
            <Route path="/tools/offer" element={<OfferCalculator />} />
            <Route path="/tools/hedging" element={<Hedging />} />
            <Route path="/tools/smile" element={<Smile />} />
            <Route path="/tools/retirement" element={<Retirement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
