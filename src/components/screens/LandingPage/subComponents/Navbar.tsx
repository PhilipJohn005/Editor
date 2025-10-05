import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { NavMenu } from "../../../ui/navbarComponents/nav-menu";
import { NavigationSheet } from "../../../ui/navbarComponents/navigation-sheet";
import logo from '@/assets/sertify-logo-full.png'


const Navbar04Page = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0); 
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="">
      <nav
        className={`h-16 z-50 border bg-gray-50 dark:border-slate-700/70 max-w-[1329px] mx-auto transition-all duration-300 ${
          isScrolled
            ? "fixed top-0 inset-x-0"
            : "absolute top-6 inset-x-4"
        }`}
      >
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <img
            src={logo}
            className="w-auto h-10 object-contain"
          />

          <NavMenu className="hidden md:block" />

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:inline-flex rounded-full"
            >
              Sign In
            </Button>
            <Button className="rounded-full">Get Started</Button>

            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar04Page;
