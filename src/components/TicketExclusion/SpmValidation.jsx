import React, { useState, useEffect } from 'react';
import FlexDiv from '../Common/FlexDiv';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';
import { BASE_URL } from '../../constants/constants';
import ErrorResult from '../Common/ErrorResult';
import Cookie from 'js-cookie';

export default function SpmValidation({ ticket_number, Exclusion_Reason, requested_hours, Huawei_Remarks }) {
  const [exclusionTime, setExclusionTime] = useState(parseFloat(requested_hours));
  const [remarks, setRemarks] = useState(Huawei_Remarks);
  const [exclusionReasons, setExclusionReasons] = useState([]);
  const [selectedExclusionReason, setSelectedExclusionReason] = useState(Exclusion_Reason);
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorResult, setErrorResult] = useState(false);
  const [loading, setLoading] = useState(false);  // Loading state for user feedback

  const session = Cookie.get('session');
  const storedSession = session ? JSON.parse(session) : null;
  const navigate = useNavigate();

  // Helper function to handle error responses
  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        setErrorMessage("Not Authorized");
      } else if (error.response.status === 401) {
        navigate("/");
      } else {
        setErrorMessage(error.response.data.message || "Something went wrong!");
      }
    } else {
      setErrorMessage("Network error. Please try again later.");
    }
    setErrorResult(true);
    setLoading(false);
  };

  const submitTicket = async () => {
    if (!storedSession) return;

    if (exclusionTime > 0 && remarks !== '') {
      setLoading(true);
      try {
        const response = await axios.put(`${BASE_URL}/ticket/ticket-spare-parts-validation-submit`, {
          ticketId: ticket_number,
          exclusionReason: selectedExclusionReason,
          exclusionTime: exclusionTime,
          huaweiRemarks: remarks,
          user: storedSession.user.email,
        }, {
          headers: {
            'Authorization': `Bearer ${storedSession.Authorization}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(response);
        setStatus(200);
        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    } else {
      setErrorMessage('Please add remarks and exclusion time.');
      setStatus(500);
    }
  };

  const returnTicket = async () => {
    if (!storedSession) return;

    setLoading(true);
    try {
      const response = await axios.put(`${BASE_URL}/ticket/ticket-spare-parts-validation-return`, {
        ticketId: ticket_number,
        spm: true,
        user: storedSession.user.email
      }, {
        headers: {
          'Authorization': `Bearer ${storedSession.Authorization}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(response);
      setStatus(200);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    if (!storedSession) return;

    const fetchExclusionReasons = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/exclusion-reason/fetch-all`, {
          headers: {
            Authorization: `Bearer ${storedSession.Authorization}`,
            'Content-Type': 'application/json'
          }
        });

        const exclusionReasonsData = response.data.map(item => ({
          id: item.id,
          value: item.exclusion_reason,
          label: `${item.exclusion_reason} (${item.region_noc})`,
        }));

        setExclusionReasons(exclusionReasonsData);
      } catch (error) {
        handleError(error);
      }
    };

    fetchExclusionReasons();
  }, [storedSession]);

  const handleExclusionReasonChange = (event) => {
    setSelectedExclusionReason(event.target.value);
  };

  return (
    <div className='flex flex-col gap-y-5'>
      {
        errorResult ? (
          <FlexDiv classes='mt-[12%]'>
            <ErrorResult text={errorMessage} onClick={() => navigate('/dashboard')} />
          </FlexDiv>
        ) : (
          <>
            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
              <div>
                <span className='font-medium'>Return to Requester</span>
              </div>
              <button
                onClick={returnTicket}
                className='bg-stc-red shadow-lg text-white py-2 px-3 rounded-md'
                disabled={loading}
              >
                Return
              </button>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
              <span className='font-medium'>Exclusion Time Requested</span>
              <input
                value={exclusionTime}
                onChange={(e) => setExclusionTime(parseFloat(e.target.value))}
                min={1}
                type='number'
                className='focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm'
                disabled={loading}
              />
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
              <span className='font-medium'>Exclusion Reason</span>
              <select
                id="exclusion-reason-dropdown"
                value={selectedExclusionReason}
                onChange={handleExclusionReasonChange}
                className='focus:outline-none border max-w-[260px] w-full border-slate-400 px-2 py-1 border-opacity-40 rounded-sm'
                disabled={loading}
              >
                <option value="" disabled>Select one</option>
                {exclusionReasons.map((reason) => (
                  <option key={reason.id} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
              <span className='font-medium'>Remarks</span>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className='focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1'
                disabled={loading}
              ></textarea>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
              <div>
                <span className='font-medium'>Submit</span>
              </div>
              <button
                onClick={submitTicket}
                className='bg-stc-green shadow-lg text-white py-2 px-3 rounded-md'
                disabled={loading}
              >
                Submit
              </button>
            </FlexDiv>

            {status === 200 && (
              <SuccessModal
                heading='Success'
                body={'TT submitted successfully'}
                open={status === 200}
                close={() => window.location.href = '/dashboard'}
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
          </>
        )
      }
    </div>
  );
}
