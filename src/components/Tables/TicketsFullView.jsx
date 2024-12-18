import React, { useState, useEffect, useCallback } from 'react';
import FlexDiv from '../Common/FlexDiv';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // AG Grid styles
import 'ag-grid-community/styles/ag-theme-alpine.css'; // AG Grid theme styles
import { BASE_URL } from '../../constants/constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Common/Loader';
import ErrorModal from '../Common/ErrorModal';
import ErrorResult from '../Common/ErrorResult';
import Cookie from "js-cookie";

export default function TicketsFullView({ setOpen, sidebarOpen, setSidebarOpen }) {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorResult, setErrorResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const session = Cookie.get("session");
  const storedSession = session ? JSON.parse(session) : null;
  const navigate = useNavigate();

  // Function to handle the API request for all tickets
  const getAllTickets = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/ticket/tickets-by-status?status=Closed`, {
        headers: {
          Authorization: `Bearer ${storedSession.Authorization}`,
        },
      });
      const data = response.data.data;
      const columns = data.length > 0 ? Object.keys(data[0]).map(key => ({
        field: key,
        headerName: key.charAt(0).toUpperCase() + key.slice(1),
        filter: 'agSetColumnFilter',
      })) : [];
      
      setColumnDefs(columns);
      setRowData(data);
      setTotalCount(response.data.count);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [storedSession]);

  // Error handling function
  const handleError = (error) => {
    const message = error?.response?.data?.message || 'An unexpected error occurred';
    const statusCode = error?.response?.data?.statusCode;
    setErrorMessage(message);

    if (statusCode === 403) {
      setErrorResult(true);
    } else if (statusCode === 401) {
      navigate("/");
    } else {
      setErrorResult(true);
    }
  };

  // Fetch tickets when session is valid
  useEffect(() => {
    if (storedSession) {
      getAllTickets();
    } else {
      navigate('/');
    }
  }, [storedSession, getAllTickets, navigate]);

  // Row click handler to navigate to individual ticket view
  const handleRowClick = (event) => {
    const rowId = event.data.PR_ID; // Assuming 'id' is the key for unique row IDs
    navigate(`/ticket/${rowId}?source=ViewTicket`); // Navigate to /ticket/id
  };

  if (loading) {
    return (
      <FlexDiv classes="w-[calc(100vw-300px)] h-[calc(100vh-200px)]">
        <Loader />
      </FlexDiv>
    );
  }

  return (
    <>
      {errorResult ? (
        <FlexDiv classes="mt-[12%]">
          <ErrorResult text={errorMessage} onClick={() => navigate('/dashboard#Home')} />
        </FlexDiv>
      ) : (
        <FlexDiv>
          <div className="ag-theme-alpine" style={{ height: '75vh', width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={15} // Set pagination to 15 rows per page
              defaultColDef={{ sortable: true, filter: true }}
              onRowClicked={handleRowClick}
            />
          </div>

          {/* Error Modal */}
          {errorMessage && <ErrorModal heading="Something went wrong!" body={errorMessage} open={errorResult} close={() => setErrorResult(false)} />}
        </FlexDiv>
      )}
    </>
  );
}
