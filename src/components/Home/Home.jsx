// import { useRouter } from 'next/navigation';
import React from 'react'
import { IoAddCircleSharp, IoCalendarSharp, IoCreateSharp, IoShareSharp, IoTicketSharp } from 'react-icons/io5';
import FlexDiv from '../Common/FlexDiv';
import { MdAccountCircle } from 'react-icons/md';
import { FaTable } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const panels = [
  {
    name: 'Create User',
    link: '/create-user',
    icon: <IoCreateSharp className=" text-4xl font-medium" />
  },
  {
    name: 'View Pending Tickets',
    link: '/pending-tickets',
    icon: <IoTicketSharp className=" text-4xl font-medium" />,
  },
  // {
  //   name: 'Create Ticket',
  //   link: '/dashboard#Create',
  //   icon: <IoCreateSharp className=" text-4xl font-medium" />
  // },
  // {
  //   name: 'Upload Bulk Tickets',
  //   link: '/dashboard#Import',
  //   icon: <IoAddCircleSharp className="text-4xl font-medium" />

  // },
  {
    name: 'Calendar',
    link: '/calendar',
    icon: <IoCalendarSharp className="text-4xl font-medium" />,

  },
  {
    name: 'My Profile',
    link: '/profile',
    icon: <MdAccountCircle className='text-4xl' />

  },
  {
    name: 'Feedback',
    link: '/feedback',
    icon: <IoShareSharp className="text-4xl font-medium" />,
  }
  ,
  {
    name: 'All Closed Tickets',
    link: '/all-tickets',
    icon: <FaTable className="text-4xl font-medium" />,
  }
]
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className='w-full h-full grid grid-cols-3 gap-5 p-5'>
      {panels.map((panel, index) => (
        <div onClick={() => navigate(panel.link)} key={index} className='flex justify-center items-center'>
          <div className='w-[250px] h-[250px] cursor-pointer rounded-lg flex justify-center bg-[#fdfdfd] text-stc-purple hover:bg-stc-red hover:text-white shadow-lg items-center'>
            <FlexDiv gapY={10} direction='column'>
              <div>{panel.icon}</div>
              <div className='text-center text-2xl px-3'>{panel.name}</div>
            </FlexDiv>
          </div>
        </div>
      ))}
    </div>
  )
}
