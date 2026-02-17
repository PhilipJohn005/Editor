import React from 'react'
import Hero02 from './subComponents/HeroSection'
import Logos06Page from './subComponents/Logo'
import Features06Page from './subComponents/Features'
import Pricing03 from './subComponents/Pricing'
import FAQ05 from './subComponents/Faq'
import Testimonial05 from './subComponents/Testimonial'
import Cta from './subComponents/Cta'
import Footer04Page from './subComponents/Footer'
import Navbar04Page from './subComponents/Navbar'
import IntegrationsSection from './subComponents/Integrations'
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


const LandingPage = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const alreadyShown = localStorage.getItem("projectNoticeShown");
    if (!alreadyShown) {
      setOpen(true);
      localStorage.setItem("projectNoticeShown", "true");
    }
  }, []);

  return (
    <div className='relative'>
        <div className="absolute left-24 top-0 bottom-70 w-px bg-gray-300" />
        <div className="absolute right-24 top-0 bottom-70 w-px bg-gray-300" />

        <Navbar04Page/>
        <Hero02/>
        <Logos06Page/>
        <IntegrationsSection/>
        <Features06Page/>
        <Pricing03/>
        <FAQ05/>
        <Cta/>
        <Footer04Page/>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="rounded-2xl p-6">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Project Status
              </DialogTitle>
            </DialogHeader>

            <p className="text-gray-700 mt-2 leading-relaxed">
              This project is actively under development. Parts like 
              the canvas editor works
            </p>

            <DialogFooter className="mt-6">
              <Button onClick={() => setOpen(false)} className="w-full">
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    </div>
  )
}

export default LandingPage
