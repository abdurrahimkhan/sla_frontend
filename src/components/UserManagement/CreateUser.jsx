import React from 'react'
import FlexDiv from '../Common/FlexDiv'
import UserForm from './SubComponents/UserForm'
// import { useRouter } from 'next/navigation';

export default function CreateUser() {

  return (
    <FlexDiv >
      <div className='w-full bg-white h-full ticket-form rounded-md'>
        <FlexDiv>
          <UserForm />
        </FlexDiv>
      </div>
    </FlexDiv>
  )
}
