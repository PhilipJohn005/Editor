import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, CirclePlay } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Hero02 = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute left-24 bottom-2 right-24 h-px bg-border" />
      <div className="max-w-(--breakpoint-xl) w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 pt-12">
        <div>
          <Badge
            variant="secondary"
            className="rounded-full py-1 border-border"
            asChild
          >
            <Button onClick={() => navigate("/login")} className="hover:text-secondary">
              Login <ArrowUpRight className="ml-1 size-4" />
            </Button>
          </Badge>

          <h1 className="mt-6 max-w-[17ch] text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-semibold leading-[1.2]! tracking-tighter text-secondary">
            Customized Shadcn UI Blocks & Components
          </h1>

          <p className="mt-6 max-w-[60ch] sm:text-lg text-primary">
            Explore a collection of Shadcn UI blocks and components, ready to
            preview and copy. Streamline your development workflow with
            easy-to-implement examples.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <Button
              size="lg"
              className="rounded-full text-base"
              onClick={() => navigate("/login")}
            >
              Get Started <ArrowUpRight className="h-5! w-5!" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full text-base shadow-none"
            >
              <CirclePlay className="h-5! w-5!" /> Watch Demo
            </Button>
          </div>
        </div>

        <div className="w-full aspect-video bg-accent rounded-xl" />
      </div>
    </div>
  );
};

export default Hero02;
