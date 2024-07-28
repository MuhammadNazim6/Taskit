import React from 'react'
import { Button } from '../ui/button'
import { NavLink } from 'react-router-dom'

function LandingPage() {
  return (
    <div className='flex justify-center items-center h-[500px]'>
      <div className="">
        <h1 className='text-6xl text-center'>Manage Tasks With Ease.</h1>
        <p className='pl-1 hidden md:block'>Get Started for Free</p>
        <section className='text-center'>
          <div className="mt-24">
            <div className='mb-10'>
              <h3>Drag-and-Drop</h3>
              <p>Move tasks seamlessly between statuses.</p>
            </div>
            <Button variant='default' className='text-xl'><NavLink to='/signup' className="p-2">Signup now</NavLink></Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LandingPage