import FlexDiv from '../../Common/FlexDiv';
import React, { useState } from 'react'
import { IoCloseCircleSharp } from 'react-icons/io5';

const Notifications = [
  {
    id: 1,
    title: 'Exclusion Request',
    description: 'The contractor has requested an exclusion for the following ticket: PR343212487123',
    date: '2021-08-31',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Exclusion Request',
    description: 'The contractor has requested an exclusion for the following ticket: PR343212487123',
    date: '2021-08-31',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Exclusion Request',
    description: 'The contractor has requested an exclusion for the following ticket: PR343212487123',
    date: '2021-08-31',
    status: 'pending',
  },
  {
    id: 4,
    title: 'Exclusion Request',
    description: 'The contractor has requested an exclusion for the following ticket: PR343212487123',
    date: '2021-08-31',
    status: 'pending',
  },
  {
    id: 5,
    title: 'Exclusion Request',
    description: 'The contractor has requested an exclusion for the following ticket: PR343212487123',
    date: '2021-08-31',
    status: 'pending',
  },
]

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState(Notifications);

  const markAsRead = (id) => {
    console.log(id);
    const updatedNotifications = notifications.map((notification) => {
      if (notification.id === id) {
        notification.status = 'read';
      }
      return notification;
    });
    setNotifications(updatedNotifications);
  }


  return (
    <div className='w-full bg-white rounded-md h-[75vh] overflow-y-scroll px-5 py-3'>
      <FlexDiv classes='mt-3 mb-5'>
        <span className='text-stc-purple font-bold text-2xl'>Notifications</span>
      </FlexDiv>
      
      <span className='text-stc-red font-medium text-xl'>
        Work in progress
      </span>
      
      {/* {notifications.map((notification, index) => (
        notification.status === 'pending' &&
        <div key={index} className='mb-5' id={notification.id}>
          <FlexDiv justify={'space-between'} alignment='start'>
            <FlexDiv justify='start' alignment='start' gapX={20}>
              <span>
                <IoCloseCircleSharp onClick={() => markAsRead(notification.id)} className='text-2xl text-stc-red' />
              </span>
              <div>
                <span className='text-sm font-medium bg-purple py-1 px-3 rounded-3xl'>
                  {notification.title}
                </span>
                <div className='text-sm text-stc-gray font-medium mt-2 pl-3'>
                  {notification.description}
                </div>
              </div>
            </FlexDiv>
            <div className='w-1/4 flex justify-end'>
              <span className='text-xs w-88 text-stc-red'>
                {notification.date}
              </span>
            </div>
          </FlexDiv>
        </div>
      ))} */}
    </div>
  )
}
