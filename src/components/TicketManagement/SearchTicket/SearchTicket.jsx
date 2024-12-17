import React, { useState, useEffect, useCallback } from 'react';
import { IoSearchSharp } from 'react-icons/io5';
import axios from 'axios';
import Cookie from "js-cookie";
import { useNavigate } from 'react-router-dom';

import FlexDiv from '../../Common/FlexDiv';
import Loader from '../../Common/Loader';
import ErrorModal from '../../Common/ErrorModal';
import ErrorResult from '../../Common/ErrorResult';
import TicketsTable from '../TicketTable/TicketTable';
import { BASE_URL } from '../../../constants/constants';

export default function SearchTicket() {
  const [ticketNumber, setTicketNumber] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorResult, setErrorResult] = useState(false);
  const navigate = useNavigate();

  const session = Cookie.get("session");
  const storedSession = session ? JSON.parse(session) : null;

  // Handle API request and error handling
  const handleError = useCallback((error) => {
    if (error.response?.status === 403) {
      setErrorMessage("Not Authorized");
      setErrorResult(true);
    } else if (error.response?.status === 401) {
      navigate("/");
    } else {
      setErrorMessage(error.response?.data?.message || 'An unexpected error occurred');
      setErrorResult(true);
    }
    setLoading(false);
  }, [navigate]);

  // Search for tickets
  const searchTicket = useCallback(async () => {
    if (ticketNumber === '' || !(ticketNumber.startsWith('PR')) || ticketNumber.length < 13) {
      setError(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/ticket/fetch-tickets`, 
        { 'prIDs': ticketNumber.split('\n').join(',') }, 
        { 
          headers: {
            'Authorization': `Bearer ${storedSession?.Authorization}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setData(response.data.data);
      setLoading(false);
    } catch (error) {
      handleError(error);
    }
  }, [ticketNumber, storedSession, handleError]);

  // Session check on component mount
  useEffect(() => {
    if (!storedSession) {
      navigate('/');
    }
  }, [storedSession, navigate]);

  if (loading) {
    return (
      <FlexDiv classes="w-full h-screen">
        <Loader />
      </FlexDiv>
    );
  }

  return (
    <FlexDiv classes="h-[80vh] bg-white p-10">
      {errorResult ? (
        <FlexDiv classes="mt-20">
          <ErrorResult text={errorMessage} onClick={() => setErrorResult(false)} />
        </FlexDiv>
      ) : (
        <FlexDiv direction="column" classes="" gapY={20}>
          <span className="text-3xl text-stc-purple font-medium">Search Ticket</span>
          <FlexDiv justify="end" classes="px-40 relative">
            <textarea
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              type="text"
              placeholder="PRXXXXXXXXXXX"
              className="focus:outline-none border-2 rounded-md py-5 px-1 w-full border-stc-purple resize-vertical min-h-[100px] line-height-1.5"
            />
            <IoSearchSharp 
              onClick={searchTicket}
              className="absolute mr-3 text-2xl text-stc-purple cursor-pointer" 
            />
          </FlexDiv>
          <button 
            type="button" 
            onClick={searchTicket} 
            className="py-2 px-3 w-64 rounded-md bg-stc-red text-white"
          >
            Search
          </button>

          {data && <TicketsTable data={data} searchTicket={true} />}
        </FlexDiv>
      )}
      
      {error && (
        <ErrorModal 
          open={error} 
          heading="Error" 
          body="Invalid Ticket Number" 
          close={() => setError(false)} 
        />
      )}
    </FlexDiv>
  );
}
