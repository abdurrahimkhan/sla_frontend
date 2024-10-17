import React, { useContext, useState } from 'react'
import FlexDiv from '../Common/FlexDiv'
// import { useSession } from 'next-auth/react';
import axios from 'axios';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';
import useAuth from '../../auth/useAuth';
import { BASE_URL } from '../../constants/constants';


export default function StcNocForm({ ticket_number, currentState, requested_hours }) {
  const [acceptedExculsionTime, setAcceptedExclusionTime] = useState(parseFloat(requested_hours));
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('')
  const [remarks, setRemarks] = useState('')
  // const { data: session } = useSession();
  const { session } = useAuth();
  const storedSession = JSON.parse(localStorage.getItem('session'));
  


  const acceptTicket = async () => {
    if (storedSession) {
      if (acceptedExculsionTime > 0 && remarks !== ''){

        
        let config = {
          method: 'put',
          maxBodyLength: Infinity,
          url: `${BASE_URL}/ticket/ticket-stc-governance-accept`,
          headers: {
            'Authorization': storedSession.Authorization,
            'Content-Type': 'application/json'
          },
          data: {
            ticketId: ticket_number,
            acceptedTime: acceptedExculsionTime,
            remarks: remarks,
            user: storedSession.user.email,
          }
        };
        axios.request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            setStatus(200);
          })
          .catch((error) => {
            console.log(error);
          });

      } else {
        setErrorMessage('Please add remarks and exclusion time.')
        setStatus(500)
      }
    }
  }


  const rejectTicket = async () => {
    if (session && session.user) {

      if (remarks !== ''){
        const res = await axios.put(
          `${BASE_URL}/ticket/ticket-stc-governance-reject`,
          {
            ticketId: ticket_number,
            remarks: remarks,
            acceptedTime: 0,
            user: storedSession.user.email,
          },
          {
            headers: {
              Authorization: storedSession.Authorization,
              'Content-Type': 'application/json'
            }
          }
        );

        setStatus(200);
      } else {
        setErrorMessage('Please add remarks')
        setStatus(500)
      }
    }
  }



  return (
    <div className='flex flex-col gap-y-5 '>
      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Reject Request</span>
        <button onClick={rejectTicket} className='bg-stc-red shadow-lg text-white py-2 px-3 rounded-md'>Reject</button>
      </FlexDiv>


      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Approved Requested Time</span>
        <input defaultValue={acceptedExculsionTime} max={acceptedExculsionTime} min={1} onChange={(e)=>setAcceptedExclusionTime(parseFloat(e.target.value))}  type='number' className='focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm ' />
      </FlexDiv>

      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Remarks</span>
        <textarea onChange={(e)=>setRemarks(e.target.value)} className='focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1' ></textarea>
      </FlexDiv>
      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <div>
          <span className='font-medium'>Approve Request</span>
        </div>
        <button onClick={acceptTicket} className='bg-stc-green shadow-lg text-white py-2 px-3 rounded-md'>Approve</button>
      </FlexDiv> 

      {status === 200 && <SuccessModal heading='Success' body={'Response submitted successfully'} open={status===200} close={()=>window.location.href='/dashboard#Home'} />}

      {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status===500} close={()=>setStatus(0)} />}
    </div>
  )
}
