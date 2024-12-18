import React, { useState, useEffect } from 'react';
import FlexDiv from '../Common/FlexDiv';
import SuccessModal from '../Common/SuccessModal';
import ErrorModal from '../Common/ErrorModal';
import { BASE_URL } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import Cookie from "js-cookie";
import axios from 'axios';

export default function StcRegionalForm({ ticket_number, initialRejection, currentState, requested_hours }) {
  const [acceptedExclusionTime, setAcceptedExclusionTime] = useState(parseFloat(requested_hours) || 0);
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);  // Set the loading state to show progress
  const session = Cookie.get("session");
  const storedSession = session ? JSON.parse(session) : null;
  const navigate = useNavigate();

  // Function to handle acceptance of the ticket
  const acceptTicket = async () => {
    if (acceptedExclusionTime > 0 && remarks.trim() !== '') {
      setLoading(true);
      try {
        const response = await axios.put(`${BASE_URL}/ticket/ticket-stc-regional-accept`, {
          ticketId: ticket_number,
          acceptedTime: acceptedExclusionTime,
          remarks: remarks,
          user: storedSession.user.email,
        }, {
          headers: {
            'Authorization': `Bearer ${storedSession.Authorization}`,
            'Content-Type': 'application/json',
          },
        });

        setStatus(200);  // Success
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    } else {
      setErrorMessage('Please add remarks and exclusion time.');
      setStatus(500);  // Error
    }
  };

  // Function to handle rejection of the ticket
  const rejectTicket = async () => {
    if (remarks.trim() !== '') {
      setLoading(true);
      try {
        const response = await axios.put(`${BASE_URL}/ticket/ticket-stc-regional-reject`, {
          ticketId: ticket_number,
          remarks: remarks,
          acceptedTime: 0,
          user: storedSession.user.email,
        }, {
          headers: {
            'Authorization': `Bearer ${storedSession.Authorization}`,
            'Content-Type': 'application/json',
          },
        });

        setStatus(200);  // Success
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    } else {
      setErrorMessage('Please add remarks.');
      setStatus(500);  // Error
    }
  };

  // Error handling
  const handleError = (error) => {
    setLoading(false);
    if (error.response) {
      if (error.response.status === 403) {
        setErrorMessage('Not Authorized');
      } else if (error.response.status === 401) {
        navigate('/');
      } else {
        setErrorMessage(error.response.data.message || 'Something went wrong.');
      }
    } else {
      setErrorMessage('Network Error: Please try again later.');
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!storedSession) {
      navigate('/');
    }
  }, [storedSession, navigate]);

  return (
    <div className='flex flex-col gap-y-5'>
      {/* Reject Request */}
      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Reject Request</span>
        <button 
          onClick={rejectTicket} 
          className="bg-stc-red shadow-lg text-white py-2 px-3 rounded-md"
          disabled={loading}
        >
          Reject
        </button>
      </FlexDiv>

      {/* Approved Requested Time */}
      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Approved Requested Time</span>
        <input 
          type="number" 
          value={acceptedExclusionTime} 
          min={1} 
          onChange={(e) => setAcceptedExclusionTime(parseFloat(e.target.value))} 
          className="focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm" 
          disabled={loading}
        />
      </FlexDiv>

      {/* Remarks */}
      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Remarks</span>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1"
          disabled={loading}
        />
      </FlexDiv>

      {/* Approve Request */}
      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Approve Request</span>
        <button 
          onClick={acceptTicket} 
          className="bg-stc-green shadow-lg text-white py-2 px-3 rounded-md"
          disabled={loading}
        >
          Approve
        </button>
      </FlexDiv>

      {/* Success and Error Modals */}
      {status === 200 && (
        <SuccessModal 
          heading="Success" 
          body="Response submitted successfully" 
          open={status === 200} 
          close={() => navigate('/dashboard#Home')}
        />
      )}

      {status === 500 && (
        <ErrorModal 
          heading="Something went wrong!" 
          body={errorMessage} 
          open={status === 500} 
          close={() => setStatus(0)}
        />
      )}

      {/* Show Loading Spinner */}
      {loading && <div className="loading-spinner">Loading...</div>}
    </div>
  );
}
