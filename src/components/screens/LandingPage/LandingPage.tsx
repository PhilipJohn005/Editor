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

const LandingPage = () => {
  return (
    <div className='relative'>
        <div className="absolute left-24 top-0 bottom-70 w-px bg-gray-300" />
        <div className="absolute right-24 top-0 bottom-70 w-px bg-gray-300" />

        <Navbar04Page/>
        <Hero02/>
        <Logos06Page/>
        <Features06Page/>
        <Pricing03/>
        <FAQ05/>
        <Testimonial05/>
        <Cta/>
        <Footer04Page/>
    </div>
  )
}

export default LandingPage
