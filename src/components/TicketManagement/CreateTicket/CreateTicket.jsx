import React from 'react'
import NavTab from './SubComponents/NavTab'
import FlexDiv from '../../Common/FlexDiv'
import ExclusionForm from './SubComponents/ExclusionForm'
import PreviewForm from './SubComponents/PreviewForm'
// import { useSession } from 'next-auth/react';
import { UPDATE_PERMISSIONS } from '../../../lib/permissions';
import ErrorResult from '../../Common/ErrorResult';
import Loader from '../../Common/Loader'
import useAuth from '../../../auth/useAuth'
// import { useRouter } from 'next/navigation';

export default function CreateTicket() {
  const [activeTab, setActiveTab] = React.useState(0);
  // const { data: session } = useSession();
  const { session } = useAuth();
  const [user, setUser] = React.useState(null);
  // const router = useRouter();
  const [loading, setLoading] = React.useState(true);


  React.useEffect(() => {

    if (session) {
      console.log("ct if");
      console.log(session);
      setLoading(false);
    }

  }, [session])


  if (loading) {
    
    return (
      <FlexDiv classes='w-full h-screen'>
        <Loader />
      </FlexDiv>
    )
  }
console.log("user check");
console.log(session.user.email);
  // if (!UPDATE_PERMISSIONS[!user.user_type].includes('Create Ticket')) {
  //   return (
  //     <FlexDiv classes='h-[80vh]'>
  //       <ErrorResult text={'You are not authorised to access this page.'} onClick={() => window.location.href = '/dashboard'} />
  //     </FlexDiv>
  //   )
  // }


  return (
    <FlexDiv >
      <div className='w-full bg-white h-full ticket-form rounded-md'>
        <FlexDiv>
          <NavTab text='Request Exclusion' active={activeTab === 0} handleClick={() => setActiveTab(0)} />
          <NavTab text='Preview Details' active={activeTab === 1} handleClick={() => setActiveTab(1)} />
        </FlexDiv>

        {
          activeTab === 0 ?
            <ExclusionForm />
            :
            <PreviewForm />
        }

      </div>
    </FlexDiv>
  )
}
