import React from 'react'
import { Button } from './components/ui/button'
import logo from "./assets/sertify-logo-full.png"
import { useNavigate } from 'react-router-dom'

const App = () => {

  const navigate=useNavigate()

  const handleClick=()=>{
    navigate('/login')
  }

  return (
    <div className='min-h-screen'>
      
        <header className='bg-white shadow-sm'>
            <div className='flex max-w-7xl py-4 items-center justify-between mx-auto'>
                <div>
                    <img src={logo} className='w-30'/>
                </div>

                <div className='flex space-x-1'>
                    <Button variant="secondary" className='hover:bg-gray-200 hover:cursor-pointer'>Features</Button>
                    <Button variant="secondary" className='hover:bg-gray-200 hover:cursor-pointer'>About us</Button>
                    <Button variant="secondary" className='hover:bg-gray-200 hover:cursor-pointer'>Pricing</Button>
                    <Button variant="secondary" className='hover:bg-gray-200 hover:cursor-pointer'>FAQ</Button>
                    <Button variant="secondary" className='hover:bg-gray-200 hover:cursor-pointer'>Contact</Button>
                </div>

                <div className='flex justify-end'>
                    <Button variant="secondary" className='bg-white shadow-md overflow-visible hover:bg-gray-50 hover:cursor-pointer mr-2'>Login {` >`}</Button>
                    <Button variant="destructive" className='bg-black hover:bg-gray-700 hover:cursor-pointer'>Signup {` >`}</Button>
                </div>
            </div>
            
        </header>

        <section className='py-40'>
            <div className='max-w-4xl flex mx-auto justify-center items-center'>
                <div className='flex flex-col justify-center items-center'>
                    <h1 className='text-6xl'>Placeholder text</h1>
                    <p className='pt-6 text-gray-400'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Magnam laudantium illo adipisci repellat! 
                        Debitis dolore totam facilis similique id repellat necessitatibus, incidunt adipisci vero sit distinctio 
                        eveniet ratione, quaerat fugiat!
                    </p>
                    <Button onClick={handleClick} variant="destructive" className='w-fit mt-8 bg-black hover:bg-gray-700 hover:cursor-pointer'>Get Started {` >`}</Button>
                </div>
            </div>
        </section>

    </div>
  )
}

export default App
