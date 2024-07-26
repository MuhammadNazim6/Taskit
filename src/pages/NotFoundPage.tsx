import React from 'react'
import Lottie from 'lottie-react'
import NotFoundAnim from '../assets/animations/404ErrorAnim.json'
import { Link } from 'react-router-dom'


function NotFoundPage() {
  return (
    <div className='flex justify-center items-center h-svh'>
     <div className="">
     <Lottie animationData={NotFoundAnim} className='h-60' />
     <Link to='/' className='text-center btn-link text-blue-400 cursor-pointer flex justify-center'><span>Go home</span></Link>
     </div>
    </div >
  )
}

export default NotFoundPage