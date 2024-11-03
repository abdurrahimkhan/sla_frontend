import React, { useState, useEffect } from 'react'
import FlexDiv from '../components/Common/FlexDiv'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // AG Grid styles
import 'ag-grid-community/styles/ag-theme-alpine.css'; // AG Grid theme styles
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Common/Loader';
import ErrorModal from '../components/Common/ErrorModal';
import ErrorResult from '../components/Common/ErrorResult';
import { BASE_URL } from '../constants/constants';



export default function Worklog({ setOpen, sidebarOpen, setSidebarOpen }) {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorResult, setErrorResult] = useState(false);
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('')
  const storedSession = JSON.parse(localStorage.getItem('session'));
  const navigate = useNavigate();

  const getWorklogOfTicket = async () => {
    const res = await axios.put(
        `${BASE_URL}/ticket/ticket-partial-acceptance-handler`,
        {
          ticketId: '',
          action: "Close",
          user: storedSession.user.email,
        },
        {
          headers: {
            Authorization: 'Bearer ' + storedSession.Authorization,
            'Content-Type': 'application/json'
          }
        }
      );
    //   making loading false
  }


  useEffect(() => {
    if (storedSession) {
      getWorklogOfTicket();
    }
  }, [])

  if (loading) return (
    <FlexDiv classes='w-[calc(100vw-300px)] h-[calc(100vh-200px)]'>
      {/* <Loader /> */}
    </FlexDiv>
  )

  return (

    <>
      {
        errorResult ?
          <FlexDiv classes='mt-[12%]'>
            <ErrorResult text={errorMessage} onClick={() => navigate('/dashboard#Home')} />
          </FlexDiv> :
          <FlexDiv>

            <div className="ag-theme-alpine" style={{ height: '75vh', width: '100%' }}>
              <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                pagination={true}
                paginationPageSize={15} // Set pagination to 10 rows per page
                defaultColDef={{ sortable: true, filter: true }}

              />
            </div>

            {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}

          </FlexDiv>
      }
    </>

  )
}
