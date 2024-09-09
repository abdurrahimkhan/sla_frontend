import React, { useState, useEffect } from 'react'
import FlexDiv from '../Common/FlexDiv'
// import { signOut, useSession } from 'next-auth/react';
import { FaCaretDown, FaRegBell, FaBars } from "react-icons/fa";
import { MdOutlineApps, MdAccountCircle } from "react-icons/md";
import { IoLogOutOutline } from 'react-icons/io5';
import ClickAwayListener from 'react-click-away-listener';
import { Dropdown, MenuProps } from 'antd';
import { CONTRACTOR } from '../../constants/constants';
import useAuth from '../../Auth/useAuth';
import axios from 'axios';
import { TICKET_PERMISSIONS } from '../../lib/permissions';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants/constants';




export default function Header({ setOpen, sidebarOpen, setSidebarOpen }) {
  const [username, setUsername] = useState('')
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [items, setItems] = useState([]);
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const storedSession = JSON.parse(localStorage.getItem('session'));


  const logOutUser = async () => {
    signOut();
  }

  const searchPendingTickets = async () => {  

    if (storedSession) {
      try {
        const res = await axios.get(`${BASE_URL}/ticket/user-pending-tickets-for-action`,
          {
            headers: {
              Authorization: storedSession.Authorization,
            },
            params: {
              user_id: storedSession.user.id, 
            },
          }
        );
        
        console.log(res);
        
        const tickets = res.data;
        const tempItems = [];

        const my_obj = {
          key: '1',
          label: (
            <span onClick={() => { window.location.href = '/dashboard#ViewMTTR'; }} className='text-stc-red hover:text-white py-1 w-full px-3 hover:bg-stc-red'>
              {tickets.data.length} Requests ({CONTRACTOR})
            </span>
          )
        }
        tempItems.push(my_obj)
        setItems(tempItems);


      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error);
          if (error.response.status == 403) {
            alert("Session expired, Kindly Login Again.");
            signOut();
          }
        }
      }
    } else {
      alert("Kindly Login First.");
      navigate(`/`);
    }
  }


  useEffect(() => {
    console.log("is this even working");
    console.log(storedSession)
    
    
    if (storedSession) {
      setUsername(storedSession.user?.email ?? '')
      searchPendingTickets();
    }
  }, [])

  return (
    <FlexDiv justify='space-between' classes='w-full h-16 px-1 bg-stc-purple'>
      <FlexDiv justify='start' gapX={24} classes='w-1/2'>
        <img src='/images/logo.png' width={120} height={100} alt='logo' />
        <FaBars onClick={() => setSidebarOpen(!sidebarOpen)} className='text-white text-2xl ml-2 cursor-pointer' />
      </FlexDiv>

      <FlexDiv classes='w-1/2 mr-2' justify='end' gapX={10}>
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
          <div className=' cursor-pointer'>
            <FaRegBell className='text-white text-2xl mr-4' />
            {items.length > 0 &&
              <div className='absolute ml-[11px] -mt-4 text-[10px] bg-stc-red text-white w-4 h-4 rounded-full flex justify-center items-center'>
                {items?.length}
              </div>
            }
          </div>
        </Dropdown>
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
