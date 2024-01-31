import React from 'react'
import { Outlet} from 'react-router-dom'
import '../../assets/styles/AppLayout.css'
import Sidebar from '../common/Sidebar'

const AppLayout = () => {
  return (
    <div className='LayoutBox'>
        <Sidebar />
        <div className='LayoutBox__content'>
          <Outlet />
        </div>
    </div>
  )
}

export default AppLayout