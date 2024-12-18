import React, { useState, useEffect } from 'react';
import FlexDiv from '../Common/FlexDiv';
import axios from 'axios';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';
import { BASE_URL } from '../../constants/constants';
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function SpocFinalForm({ ticket_number, Exclusion_Reason, Huawei_Remarks, requested_hours }) {
  const [exclusionTime, setExclusionTime] = useState(parseFloat(requested_hours));
  const [remarks, setRemarks] = useState(Huawei_Remarks);
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // For handling loading state
  const [exclusionReasons, setExclusionReasons] = useState([]);
  const [selectedExclusionReason, setSelectedExclusionReason] = useState(Exclusion_Reason);

  const session = Cookie.get('session');
  const storedSession = session ? JSON.parse(session) : null;
  const navigate = useNavigate();

  // Helper function to handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        setErrorMessage("Not Authorized");
      } else if (error.response.status === 401) {
        navigate('/');
      } else {
        setErrorMessage(error.response.data.message || 'Something went wrong');
      }
    } else {
      setErrorMessage("Network error. Please try again later.");
    }
    setStatus(500);
    setLoading(false);
  };

  // Close the ticket
  const closeTicket = async () => {
    if (!storedSession) return;

    setLoading(true); // Start loading
    try {
      const res = await axios.put(
        `${BASE_URL}/ticket/ticket-partial-acceptance-handler`,
        {
          ticketId: ticket_number,
          action: "Close",
          user: storedSession.user.email,
        },
        {
          headers: {
            Authorization: `Bearer ${storedSession.Authorization}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.status === 200) {
        setStatus(200);
      }
    } catch (error) {
      handleError(error);
    }
  };

  // Dispute the ticket
  const disputeTicket = async () => {
    if (!remarks) {
      setErrorMessage('Please add remarks');
      setStatus(500);
      return;
    }

    if (!storedSession) return;

    setLoading(true); // Start loading
    try {
      const res = await axios.put(
        `${BASE_URL}/ticket/ticket-partial-acceptance-handler`,
        {
          ticketId: ticket_number,
          action: "Dispute",
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
    } catch (error) {
      handleError(error);
    }
  };

  // Redirect to login page if no session exists
  useEffect(() => {
    if (!storedSession) {
      navigate('/');
    }
  }, [storedSession, navigate]);

  return (
    <div className='flex flex-col gap-y-5'>
      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Send to Dispute</span>
        <button
          onClick={disputeTicket}
          className='bg-stc-red shadow-lg text-white py-2 px-3 rounded-md'
          disabled={loading} // Disable button during loading
        >
          Dispute
        </button>
      </FlexDiv>

      <FlexDiv justify='space-between' classes='border-b border-stc-black'>
        <span className='font-medium'>Exclusion Time Considered</span>
        <button
          onClick={closeTicket}
          className='bg-stc-red shadow-lg text-white py-2 px-3 rounded-md'
          disabled={loading} // Disable button during loading
        >
          Close
        </button>
      </FlexDiv>

      {status === 200 && (
        <SuccessModal
          heading='Success'
          body={'Response submitted successfully'}
          open={status === 200}
          close={() => navigate('/dashboard#Home')}
        />
      )}

      {status === 500 && (
        <ErrorModal
          heading='Something went wrong!'
          body={errorMessage}
          open={status === 500}
          close={() => setStatus(0)}
        />
      )}
    </div>
  );
}
