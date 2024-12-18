import React, { useState, useEffect } from 'react';
import FlexDiv from '../Common/FlexDiv';
import axios from 'axios';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';
import { BASE_URL } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import ErrorResult from '../Common/ErrorResult';
import Cookie from 'js-cookie';

export default function HuaDepartment({ ticket_number, currentState, requested_hours }) {
  const [exclusionTime, setExclusionTime] = useState(parseFloat(requested_hours));
  const [remarks, setRemarks] = useState('');
  const [exclusionReasons, setExclusionReasons] = useState([]);
  const [selectedExclusionReason, setSelectedExclusionReason] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [status, setStatus] = useState(null); // `status` can be simplified
  const session = Cookie.get('session');
  const storedSession = session ? JSON.parse(session) : null;
  const navigate = useNavigate();

  // Fetch exclusion reasons on component mount
  useEffect(() => {
    if (storedSession) {
      const fetchExclusionReasons = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/exclusion-reason/fetch-all`, {
            headers: {
              Authorization: `Bearer ${storedSession.Authorization}`,
              'Content-Type': 'application/json',
            },
          });
          const formattedExclusionReasons = response.data.map(item => ({
            id: item.id,
            value: item.exclusion_reason,
            label: `${item.exclusion_reason} (${item.region_noc})`,
          }));
          setExclusionReasons(formattedExclusionReasons);
        } catch (error) {
          setErrorMessage('Error fetching exclusion reasons');
          setStatus(500);
        }
      };
      fetchExclusionReasons();
    } else {
      navigate('/');
    }
  }, [storedSession, navigate]);

  const handleExclusionTimeChange = (e) => {
    setExclusionTime(parseFloat(e.target.value));
  };

  const handleExclusionReasonChange = (e) => {
    setSelectedExclusionReason(e.target.value);
  };

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const submitTicket = async () => {
    if (storedSession && exclusionTime > 0 && remarks) {
      try {
        const response = await axios.put(
          `${BASE_URL}/ticket/ticket-exclusion-submission`,
          {
            ticketId: ticket_number,
            exclusionReason: selectedExclusionReason,
            exclusionTime,
            huaweiRemarks: remarks,
            user: storedSession.user.email,
          },
          {
            headers: {
              Authorization: `Bearer ${storedSession.Authorization}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setStatus(200);
      } catch (error) {
        handleError(error);
      }
    } else {
      setErrorMessage('Please add remarks and exclusion time.');
      setStatus(500);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        setErrorMessage('Not Authorized');
      } else if (error.response.status === 401) {
        navigate('/');
      } else {
        setErrorMessage(error.response.data.message || 'Something went wrong');
      }
    } else {
      setErrorMessage('Network error. Please try again later.');
    }
    setStatus(500);
  };

  return (
    <div className="flex flex-col gap-y-5">
      {status === 500 && errorMessage && (
        <FlexDiv classes="mt-[12%]">
          <ErrorResult text={errorMessage} onClick={() => navigate('/dashboard')} />
        </FlexDiv>
      )}

      {status === 200 && (
        <SuccessModal heading="Success" body="Ticket submitted successfully" open={status === 200} close={() => navigate('/dashboard#Home')} />
      )}

      {/* Exclusion Time Field */}
      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Exclusion Time Requested</span>
        <input
          type="number"
          min={1}
          max={exclusionTime}
          value={exclusionTime}
          onChange={handleExclusionTimeChange}
          className="focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm"
        />
      </FlexDiv>

      {/* Exclusion Reason Dropdown */}
      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Exclusion Reason</span>
        <select
          value={selectedExclusionReason}
          onChange={handleExclusionReasonChange}
          className="focus:outline-none border max-w-[260px] w-full border-slate-400 px-2 py-1 border-opacity-40 rounded-sm"
        >
          <option value="" disabled>
            Select one
          </option>
          {exclusionReasons.map((exclusionReason) => (
            <option key={exclusionReason.id} value={exclusionReason.value}>
              {exclusionReason.label}
            </option>
          ))}
        </select>
      </FlexDiv>

      {/* Remarks Field */}
      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Remarks</span>
        <textarea
          value={remarks}
          onChange={handleRemarksChange}
          className="focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1"
        />
      </FlexDiv>

      {/* Submit Button */}
      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <div>
          <span className="font-medium">Submit to SPOC</span>
        </div>
        <button onClick={submitTicket} className="bg-stc-green shadow-lg text-white py-2 px-3 rounded-md">
          Submit
        </button>
      </FlexDiv>
    </div>
  );
}
