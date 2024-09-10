import React from 'react'
import NavTab from './SubComponents/NavTab'
import FlexDiv from '../Common/FlexDiv'
import ExclusionForm from './SubComponents/UserForm'
import PreviewForm from './SubComponents/PreviewForm'
// import { useSession } from 'next-auth/react';
// import { UPDATE_PERMISSIONS } from '../../../lib/permissions';
import ErrorResult from '../Common/ErrorResult';
import Loader from '../Common/Loader'
import UserForm from './SubComponents/UserForm'
// import { useRouter } from 'next/navigation';

export default function CreateUser() {
  const [activeTab, setActiveTab] = React.useState(0);
  // const { data: session } = useSession();
  const [user, setUser] = React.useState(null);
  // const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const storedSession = JSON.parse(localStorage.getItem('session'));



  React.useEffect(() => {

    if (storedSession) {
      setLoading(false);
    }

  }, [])


  if (loading) {

    return (
      <FlexDiv classes='w-full h-screen'>
        <Loader />
      </FlexDiv>
    )
  }


  return (
    <FlexDiv >
      <div className='w-full bg-white h-full ticket-form rounded-md'>
        <FlexDiv>
          <UserForm />
        </FlexDiv>


        {/* <FlexDiv>
          <NavTab text='Request Exclusion' active={activeTab === 0} handleClick={() => setActiveTab(0)} />
          <NavTab text='Preview Details' active={activeTab === 1} handleClick={() => setActiveTab(1)} />
        </FlexDiv>

        {
          activeTab === 0 ?
            <ExclusionForm />
            :
            <PreviewForm />
        } */}

      </div>
    </FlexDiv>
  )
}
