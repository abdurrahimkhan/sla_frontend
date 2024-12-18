import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import FlexDiv from '../Common/FlexDiv';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';

export default function StcNocForm({ ticket_number, currentState, requested_hours }) {
  const [acceptedExclusionTime, setAcceptedExclusionTime] = useState(parseFloat(requested_hours));
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const session = Cookie.get('session');
  const storedSession = session ? JSON.parse(session) : null;
  const navigate = useNavigate();

  // Helper function for API calls
  const handleTicketAction = async (actionType, payload) => {
    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/ticket/${actionType}`, payload, {
        headers: {
          Authorization: `Bearer ${storedSession.Authorization}`,
          'Content-Type': 'application/json',
        },
      });

      setStatus(200); // Success status
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || 'Something went wrong!';
      setErrorMessage(message);
      setStatus(500); // Error status
    } finally {
      setLoading(false);
    }
  };

  // Handle accept ticket
  const acceptTicket = () => {
    if (acceptedExclusionTime > 0 && remarks) {
      const payload = {
        ticketId: ticket_number,
        acceptedTime: acceptedExclusionTime,
        remarks,
        user: storedSession.user.email,
      };
      handleTicketAction('ticket-stc-governance-accept', payload);
    } else {
      setErrorMessage('Please add remarks and exclusion time.');
      setStatus(500);
    }
  };

  // Handle reject ticket
  const rejectTicket = () => {
    if (remarks) {
      const payload = {
        ticketId: ticket_number,
        remarks,
        acceptedTime: 0,
        user: storedSession.user.email,
      };
      handleTicketAction('ticket-stc-governance-reject', payload);
    } else {
      setErrorMessage('Please add remarks');
      setStatus(500);
    }
  };

  // Ensure session is available
  useEffect(() => {
    if (!storedSession) {
      navigate('/');
    }
  }, [storedSession, navigate]);

  return (
    <div className="flex flex-col gap-y-5">
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

      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Approved Requested Time</span>
        <input
          value={acceptedExclusionTime}
          max={acceptedExclusionTime}
          min={1}
          onChange={(e) => setAcceptedExclusionTime(parseFloat(e.target.value))}
          type="number"
          className="focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm"
          disabled={loading}
        />
      </FlexDiv>

      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Remarks</span>
        <textarea
          onChange={(e) => setRemarks(e.target.value)}
          className="focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1"
          disabled={loading}
        ></textarea>
      </FlexDiv>

      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <div>
          <span className="font-medium">Approve Request</span>
        </div>
        <button
          onClick={acceptTicket}
          className="bg-stc-green shadow-lg text-white py-2 px-3 rounded-md"
          disabled={loading}
        >
          Approve
        </button>
      </FlexDiv>

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
    </div>
  );
}
