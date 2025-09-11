import React from "react";
import { Button } from "@/components/ui/button";

const Cta = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="relative text-center px-8 py-12 rounded-2xl max-w-3xl w-full overflow-hidden bg-gray-900 shadow-2xl"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.02) 1px, transparent 1px), #1a1a1a",
          backgroundSize: "100% 100%, 100% 100%, 40px 40px, 40px 40px",
        }}
      >
        {/* Grid overlay effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(180deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Experience?
          </h1>
          <p className="text-gray-300 mb-8 text-lg">
            Take your workflow to the next level with Shadcn UI Blocks. Sign up
            today and start exploring!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="default" 
              className="px-8 py-3 bg-white text-black hover:bg-gray-100 font-medium rounded-full text-base"
            >
              Get Started ↗
            </Button>
            <Button 
              variant="default" 
              className="px-8 py-3 border-gray-600 text-white hover:bg-gray-800 font-medium rounded-full text-base"
            >
              Discover More ↗
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cta;