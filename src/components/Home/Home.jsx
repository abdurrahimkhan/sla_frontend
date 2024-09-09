// import { useRouter } from 'next/navigation';
import React from 'react'
import {  IoAddCircleSharp, IoCalendarSharp, IoCreateSharp, IoShareSharp, IoTicketSharp } from 'react-icons/io5';
import FlexDiv from '../Common/FlexDiv';
import { MdAccountCircle } from 'react-icons/md';


const panels = [
  {
    name: 'Create Ticket',
    link: '/dashboard#Create',
    icon: <IoCreateSharp className=" text-4xl font-medium" />
  },
  {
    name: 'View Pending Tickets',
    link: '/dashboard#View',
    icon: <IoTicketSharp className=" text-4xl font-medium" />,
  },
  {
    name: 'Upload Bulk Tickets',
    link: '/dashboard#Import',
    icon: <IoAddCircleSharp className="text-4xl font-medium" />
    
  },
  {
    name: 'Calendar',
    link: '/dashboard#Calendar',
    icon: <IoCalendarSharp className="text-4xl font-medium" />,

  },
  {
    name: 'My Profile',
    link: '/dashboard#Profile',
    icon: <MdAccountCircle className='text-4xl' />

  },
  {
    name: 'Feedback',
    link: '/dashboard#Feedback',
    icon: <IoShareSharp className="text-4xl font-medium" />,
  }
]
export default function Home() {
  // const router = useRouter();

  const handlePanelClick = (link) => {
    window.location.href = link;

    window.location.reload();
  }

  return (
    <div className='w-full h-full grid grid-cols-3 gap-5 p-5'>
      {panels.map((panel, index) => (
        <div onClick={() => handlePanelClick(panel.link)} key={index} className='flex justify-center items-center'>
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
