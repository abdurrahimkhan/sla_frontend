import React, { useContext, useEffect, useState } from 'react'
import FlexDiv from '../Common/FlexDiv'
// import { useSession } from 'next-auth/react';
import axios from 'axios';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';
import useAuth from '../../auth/useAuth';
import { BASE_URL } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import Cookie from "js-cookie";

export default function StcNocForm({ ticket_number, currentState, requested_hours }) {
  const [acceptedExculsionTime, setAcceptedExclusionTime] = useState(parseFloat(requested_hours));
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('')
  const [remarks, setRemarks] = useState('')
  // const { data: session } = useSession();
  const session = Cookie.get("session");
  const storedSession = JSON.parse(session);
  const [errorResult, setErrorResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();



  const acceptTicket = async () => {
    if (acceptedExculsionTime > 0 && remarks !== '') {
      try {
        const response = await axios.put(`${BASE_URL}/ticket/ticket-stc-governance-accept`,
          {
            ticketId: ticket_number,
            acceptedTime: acceptedExculsionTime,
            remarks: remarks,
            user: storedSession.user.email,
          },
          {
            headers: {
              'Authorization': `Bearer ${storedSession.Authorization}`,
              'Content-Type': 'application/json'
            }
          });
        console.log(response);
        setStatus(200);
      } catch (error) {
        if (error.response.status == 403) {
          setErrorMessage("Not Authorized");
          setErrorResult(true);
          setLoading(false);
        }
        else if (error.response.status == 401) {
          navigate("/");
        } else {
          setErrorMessage(error.response.data.message);
          setErrorResult(true);
          setLoading(false);
        }
      }

    } else {
      setErrorMessage('Please add remarks and exclusion time.')
      setStatus(500)
    }

  }


  const rejectTicket = async () => {

    if (remarks !== '') {
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
            Authorization: `Bearer ${storedSession.Authorization}`,
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

  useEffect(() => {
    if (!storedSession) {
      navigate("/");
    }
  }, [])

  return (
    <div className='flex flex-col gap-y-5 '>
      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Reject Request</span>
        <button onClick={rejectTicket} className='bg-stc-red shadow-lg text-white py-2 px-3 rounded-md'>Reject</button>
      </FlexDiv>


      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Approved Requested Time</span>
        <input defaultValue={acceptedExculsionTime} max={acceptedExculsionTime} min={1} onChange={(e) => setAcceptedExclusionTime(parseFloat(e.target.value))} type='number' className='focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm ' />
      </FlexDiv>

      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Remarks</span>
        <textarea onChange={(e) => setRemarks(e.target.value)} className='focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1' ></textarea>
      </FlexDiv>
      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <div>
          <span className='font-medium'>Approve Request</span>
        </div>
        <button onClick={acceptTicket} className='bg-stc-green shadow-lg text-white py-2 px-3 rounded-md'>Approve</button>
      </FlexDiv>

      {status === 200 && <SuccessModal heading='Success' body={'Response submitted successfully'} open={status === 200} close={() => window.location.href = '/dashboard#Home'} />}

      {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}
    </div>
  )
}
