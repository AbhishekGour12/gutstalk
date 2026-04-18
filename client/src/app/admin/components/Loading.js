import { HeartPulse } from "lucide-react";

export const PageLoader = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18606D] mx-auto mb-4"></div>
      <HeartPulse className="text-[#18606D] w-8 h-8 mx-auto animate-pulse" />
      <p className="text-[#18606D] mt-2 font-medium">Loading admin panel...</p>
    </div>
  </div>
);