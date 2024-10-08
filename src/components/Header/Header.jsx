import React, { useState, useEffect } from 'react'
import FlexDiv from '../Common/FlexDiv'
// import { signOut, useSession } from 'next-auth/react';
import { FaCaretDown, FaRegBell, FaBars } from "react-icons/fa";
import { MdOutlineApps, MdAccountCircle } from "react-icons/md";
import { IoLogOutOutline } from 'react-icons/io5';
import ClickAwayListener from 'react-click-away-listener';
import { Dropdown, MenuProps } from 'antd';
import { CONTRACTOR } from '../../constants/constants';
import useAuth from '../../auth/useAuth';
import axios from 'axios';
import { TICKET_PERMISSIONS } from '../../lib/permissions';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants/constants';
import Loader from '../Common/Loader';




export default function Header({ setOpen, sidebarOpen, setSidebarOpen, items }) {
  const [username, setUsername] = useState('')
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const storedSession = JSON.parse(localStorage.getItem('session'));

  console.log(items)

  const logOutUser = async () => {
    signOut();
  }

  useEffect(() => {
    console.log("is this even working");
    console.log(items)


    if (storedSession) {
      setUsername(storedSession.user?.email ?? '')
    }
  }, [])



  return (
    <FlexDiv justify='space-between' classes='w-full h-16 px-1 bg-stc-purple'>
      <FlexDiv justify='start' gapX={24} classes='w-1/2'>
        <img src='/images/logo.png' width={120} height={100} alt='logo' />
        <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} className='text-white text-2xl ml-2 cursor-pointer' />
      </FlexDiv>

      <FlexDiv classes='w-1/2 mr-2' justify='end' gapX={10}>
        {items.length > 0 ?
          <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <div className=' cursor-pointer'>
              <FaRegBell className='text-white text-2xl mr-4' />

              <div className='absolute ml-[11px] -mt-4 text-[10px] bg-stc-red text-white w-4 h-4 rounded-full flex justify-center items-center'>
                {items?.length}
              </div>

            </div>
          </Dropdown> :
          <FaRegBell className='text-white text-2xl mr-4' />
        }
        <div className='' onClick={() => setLogoutVisible(!logoutVisible)}>
          <FlexDiv classes='w-fit hover:bg-stc-red h-full py-2 px-2 cursor-pointer' gapX={10}>
            <MdAccountCircle className='text-white text-2xl' />
            {username && <div className=' text-white font-bold font-sans'>{username}</div>}
            <FaCaretDown className='text-white cursor-pointer' />
          </FlexDiv>
          {logoutVisible &&
            <div className='h-screen flex justify-end w-screen z-10 bg-black bg-opacity-30 fixed top-16 left-0'>
              <ClickAwayListener onClickAway={() => setLogoutVisible(false)}>
                <div className='mr-12 border-t-[3px] rounded-sm px-3 py-2 border-stc-purple w-[209px] bg-white h-fit'>
                  <FlexDiv classes='hover:bg-slate-100 px-2 py-1' justify='start' onClick={logOutUser} gapX={8}>
                    <IoLogOutOutline className='text-stc-red text-3xl mr-2 cursor-pointer rotate-180' />
                    <div className='text-stc-red cursor-pointer text-lg'>Logout</div>
                  </FlexDiv>
                </div>
              </ClickAwayListener>
            </div>
          }
        </div>
        <MdOutlineApps onClick={() => setOpen(true)} className='text-stc-red text-2xl ml-2 cursor-pointer' />
      </FlexDiv>
    </FlexDiv>
  )
}
