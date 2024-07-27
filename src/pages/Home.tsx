import React from 'react'
import Navbar from '@/components/User/Navbar'
import Content from '@/components/DragAndDrop/Content'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import LandingPage from '@/components/User/LandingPage';


function Home() {

  const { taskUserLoggedIn } = useSelector((state: RootState) => state.auth)
  return (
    <>
      <Navbar />
      {taskUserLoggedIn ? <Content /> : <LandingPage />}

    </>
  )
}

export default Home