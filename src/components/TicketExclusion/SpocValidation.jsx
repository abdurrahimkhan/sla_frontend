import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import FlexDiv from '../Common/FlexDiv';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';

export default function SpocValidationForm({ ticket_number, Exclusion_Reason, Huawei_Remarks, requested_hours }) {
  const [exclusionTime, setExclusionTime] = useState(parseFloat(requested_hours));
  const [remarks, setRemarks] = useState(Huawei_Remarks);
  const [selectedExclusionReason, setSelectedExclusionReason] = useState(Exclusion_Reason);
  const [exclusionReasons, setExclusionReasons] = useState([]);
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for async operations
  const navigate = useNavigate();

  const session = Cookie.get('session');
  const storedSession = session ? JSON.parse(session) : null;

  // Fetch exclusion reasons
  const fetchExclusionReasons = async () => {
    if (!storedSession) return;
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/exclusion-reason/fetch-all`, {
        headers: {
          Authorization: `Bearer ${storedSession.Authorization}`,
          'Content-Type': 'application/json',
        },
      });
      const ERArray = response.data.map((item) => ({
        id: item.id,
        value: item.exclusion_reason,
        label: `${item.exclusion_reason} (${item.region_noc})`,
      }));
      setExclusionReasons(ERArray);
    } catch (error) {
      console.error('Error fetching exclusion reasons:', error);
      setErrorMessage('Failed to load exclusion reasons.');
      setStatus(500);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!storedSession) {
      navigate('/');
      return;
    }
    fetchExclusionReasons();
  }, [storedSession, navigate]);

  // Consolidated API call function
  const apiCall = async (url, payload) => {
    setLoading(true);
    try {
      const response = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${storedSession.Authorization}`,
          'Content-Type': 'application/json',
        },
      });
      return response;
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Something went wrong!');
      setStatus(500);
      throw error; // Propagate the error
    } finally {
      setLoading(false);
    }
  };

  // Handle form submissions
  const handleSubmit = async (action) => {
    if (!exclusionTime || !remarks || !selectedExclusionReason) {
      setErrorMessage('Please fill out all fields.');
      setStatus(500);
      return;
    }

    const payload = {
      ticketId: ticket_number,
      exclusionReason: selectedExclusionReason,
      exclusionTime: exclusionTime,
      huaweiRemarks: remarks,
      user: storedSession.user.email,
    };

    let url = '';
    if (action === 'submit') {
      url = `${BASE_URL}/ticket/ticket-spoc-validation-submit`;
    } else if (action === 'return') {
      url = `${BASE_URL}/ticket/ticket-spoc-validation-return`;
    } else if (action === 'close') {
      url = `${BASE_URL}/ticket/close-ticket`;
    } else if (action === 'returnToSPM') {
      url = `${BASE_URL}/ticket/ticket-spm-validation-return`;
    }

    try {
      const response = await apiCall(url, payload);
      if (response.status === 200) {
        setStatus(200);
      }
    } catch (error) {
      // Already handled inside apiCall
    }
  };

  // Change handler for exclusion reason
  const handleExclusionReasonChange = (event) => {
    setSelectedExclusionReason(event.target.value);
  };

  return (
    <div className="flex flex-col gap-y-5">
      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Return to Requestor</span>
        <button
          onClick={() => handleSubmit('return')}
          className="bg-stc-red shadow-lg text-white py-2 px-3 rounded-md"
        >
          Return
        </button>
      </FlexDiv>

      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Mark Request as No exclusion Required</span>
        <button
          onClick={() => handleSubmit('close')}
          className="bg-stc-red shadow-lg text-white py-2 px-3 rounded-md"
        >
          Close
        </button>
      </FlexDiv>

      {Exclusion_Reason?.includes('Spare Parts') && (
        <FlexDiv justify="space-between" classes="border-b border-stc-black">
          <span className="font-medium">Return to SPM</span>
          <button
            onClick={() => handleSubmit('returnToSPM')}
            className="bg-stc-red shadow-lg text-white py-2 px-3 rounded-md"
          >
            Return
          </button>
        </FlexDiv>
      )}

      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Exclusion Time Requested</span>
        <input
          value={exclusionTime}
          max={exclusionTime}
          min={1}
          onChange={(e) => setExclusionTime(parseFloat(e.target.value))}
          type="number"
          className="focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm"
        />
      </FlexDiv>

      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Exclusion Reason</span>
        <select
          value={selectedExclusionReason}
          onChange={handleExclusionReasonChange}
          className="focus:outline-none border max-w-[260px] w-full border-slate-400 px-2 py-1 border-opacity-40 rounded-sm"
        >
          <option value="">Select one</option>
          {exclusionReasons.map((reason) => (
            <option key={reason.id} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
      </FlexDiv>

      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <span className="font-medium">Remarks</span>
        <textarea
          onChange={(e) => setRemarks(e.target.value)}
          value={remarks}
          className="focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1"
        ></textarea>
      </FlexDiv>

      <FlexDiv justify="space-between" classes="border-b border-stc-black">
        <div>
          <span className="font-medium">Submit To STC</span>
        </div>
        <button
          onClick={() => handleSubmit('submit')}
          className="bg-stc-green shadow-lg text-white py-2 px-3 rounded-md"
        >
          Submit
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
