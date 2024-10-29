import React, { useContext, useState, useEffect } from 'react'
import FlexDiv from '../Common/FlexDiv'
// import { useSession } from 'next-auth/react';
import axios from 'axios';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';
import useAuth from '../../auth/useAuth';
import { BASE_URL } from '../../constants/constants';



export default function SpocFinalForm({ ticket_number, Exclusion_Reason, Huawei_Remarks, requested_hours }) {
  const [exclusionTime, setExclusionTime] = useState(parseFloat(requested_hours));
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('')
  const [remarks, setRemarks] = useState(Huawei_Remarks)
  // const { data: session } = useSession();
  // const { session } = useAuth();
  const [exclusionReasons, setExclusionReasons] = useState([]);
  const [selectedExclusionReason, setSelectedExclusionReason] = useState(Exclusion_Reason);
  const storedSession = JSON.parse(localStorage.getItem('session'));
  const { session, signOut } = useAuth();
  console.log(selectedExclusionReason);
  console.log(Exclusion_Reason);
  

  const closeTicket = async () => {
    const res = await axios.put(`${BASE_URL}/ticket/ticket-huawei-noc-handler`,
      {
        headers: {
          Authorization: storedSession.Authorization,
          'Content-Type': 'application/json'
        },
        data: {
          ticketId: ticket_number,
          action: "Close",
          user: storedSession.user.email,
        },
      }
    );
    if(res.status == 200) {
      setStatus(200);
    }
    else{
      setStatus(500);
      setErrorMessage("Something went wrong");
    }
    
  }

  const DisputeTicket = async () => {
    if (remarks !== '') {
      // return to spm guy
      const res = await axios.put(`${BASE_URL}/ticket/ticket-spm-validation-return`,
        {
          headers: {
            Authorization: storedSession.Authorization,
            'Content-Type': 'application/json'
          },
          data: {
            ticketId: ticket_number,
            spm: selectedExclusionReason.includes('Spare Parts') ? true : false,
            user: storedSession.user.email,
          },
        }
      );

      setStatus(200);
    } else {
      setErrorMessage('Please add remarks')
      setStatus(500)
    }
  }

  useEffect(() => {

    if (storedSession) {
      
    }
  }, [])



  return (
    <div className='flex flex-col gap-y-5 '>
      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Send to Dispute</span>
        <button onClick={DisputeTicket} className='bg-stc-red shadow-lg text-white py-2 px-3 rounded-md'>Dispute</button>
      </FlexDiv>

      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Exclusion Time Considered</span>
        <button onClick={closeTicket} className='bg-stc-red shadow-lg text-white py-2 px-3 rounded-md'>Close</button>
      </FlexDiv>

    

      {status === 200 && <SuccessModal heading='Success' body={'Response submitted successfully'} open={status === 200} close={() => window.location.href = '/dashboard#Home'} />}

      {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}
    </div>
  )
}
