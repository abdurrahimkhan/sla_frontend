import React, { useState, useEffect } from 'react';
import FlexDiv from '../../Common/FlexDiv';
import SuccessResults from '../../Common/SuccessResult';
import axios from 'axios';
import Loader from '../../Common/Loader';
import Cookie from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../constants/constants';
import ErrorResult from '../../Common/ErrorResult';
import TicketsTable from '../TicketTable/TicketTable';

export default function PendingTickets({ notification, type }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorResult, setErrorResult] = useState(false);
  const navigate = useNavigate();
  const session = Cookie.get("session");
  const storedSession = session ? JSON.parse(session) : null;

  const fetchTickets = async (viewParams) => {
    try {
      const response = await axios.get(`${BASE_URL}/view/get-user-filtered-data-from-view`, {
        params: viewParams,
        headers: {
          'Authorization': `Bearer ${storedSession?.Authorization}`,
          'Content-Type': 'application/json'
        }
      });
      setTickets(response.data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response.status === 403) {
      setErrorMessage("Not Authorized");
      setErrorResult(true);
    } else if (error.response.status === 401) {
      navigate("/");
    } else {
      setErrorMessage(error.response.data.message || 'An error occurred');
      setErrorResult(true);
    }
  };

  const searchPendingTickets = () => {
    const params = {
      view_name: 'tickets_full_view',
      columns: type === 'Both' ? 'MTTR_PassFail,PTL_PASSFAIL' : `${type.toUpperCase()}_PassFail`,
      values: 'Fail',
      expression: type === 'Both' ? '=,=' : '=',
      condition: type === 'Both' ? 'OR' : undefined,
    };
    fetchTickets(params);
  };

  useEffect(() => {
    if (storedSession) {
      searchPendingTickets();
    } else {
      navigate('/');
    }
  }, [storedSession, type, navigate]);

  if (loading) {
    return (
      <FlexDiv classes='w-[calc(100vw-300px)] h-[calc(100vh-200px)]'>
        <Loader />
      </FlexDiv>
    );
  }

  return (
    <div>
      <FlexDiv classes='min-h-[80vh] bg-white p-10' alignment='start'>
        {errorResult ? (
          <FlexDiv classes='mt-20'>
            <ErrorResult text={errorMessage} onClick={() => setErrorResult(false)} />
          </FlexDiv>
        ) : tickets.length === 0 ? (
          <FlexDiv classes='mt-[15%]'>
            <SuccessResults text={'No pending tickets'} />
          </FlexDiv>
        ) : (
          <FlexDiv direction='column' classes='' gapY={20}>
            <TicketsTable data={tickets} />
          </FlexDiv>
        )}
      </FlexDiv>
    </div>
  );
}
