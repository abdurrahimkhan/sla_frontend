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
import BaseLayout from '../components/BaseLayout/BaseLayout';
import Container from '../components/Common/Container';
import Cookie from "js-cookie";


export default function Worklog({ setOpen, sidebarOpen, setSidebarOpen }) {
  const [columnDefs, setColumnDefs] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorResult, setErrorResult] = useState(false);
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('')
  const session = Cookie.get("session");
  const storedSession = JSON.parse(session);
  const pr_id = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  const getWorklogOfTicket = async () => {

    try {
      const response = await axios.get(
        `${BASE_URL}/worklog/fetch-ticket-worklog?ticketId=${pr_id}`,
        {
          headers: {
            Authorization: 'Bearer ' + storedSession.Authorization,
            'Content-Type': 'application/json'
          }
        }
      );
      const data = response.data.data;
      console.log(data);
      if (response.data.count > 0) {
        // Define columns to omit
        const omitColumns = ["Worklog_ID", "PR_ID", "Log_Type"];

        // Define desired column order (only include columns you want, in the order you want them)
        const columnOrder = ["Modified_Date", "Modified_By", "Exclusion_Status", "Old_Exclusion_Status", "Notes", "Remarks", "STC_Exclude", "STC_Exclude_Time"];

        // Filter out unwanted columns and map to desired format
        const columns = Object.keys(data[0])
          .filter(key => !omitColumns.includes(key)) // Omit columns
          .sort((a, b) => columnOrder.indexOf(a) - columnOrder.indexOf(b)) // Rearrange columns
          .map(key => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize headers
            filter: 'agSetColumnFilter'
          }));

        setColumnDefs(columns);
      }
      setRowData(data);
      setTotalCount(response.data.count);
      setLoading(false);
      console.log(loading);
    } catch (error) {
      if (error.response.status == 403) {
        setErrorMessage("Not Authorized");
        setErrorResult(true);
        setLoading(false);
      }
      else if (error.response.status == 401) {
        navigate("/");
      } else {
        setErrorMessage(error.response.data.message);
        setErrorResult(true);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    if (activeTab !== '') {
      navigate(`/dashboard#${activeTab}`);
    }
  }, [activeTab]);


  useEffect(() => {
    if (storedSession) {
      getWorklogOfTicket();
    } else {
      navigate('/');
    }
  }, [])

  console.log(loading);
  if (loading) {
    console.log("loader true");

    return (
      <FlexDiv classes='w-full h-screen'>
        <Loader />
      </FlexDiv>
    )
  }

  return (

    <BaseLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Container definedClasses='w-full py-10 pl-40'>
        {
          errorResult ?
            <FlexDiv classes='mt-[12%]'>
              <ErrorResult text={errorMessage} onClick={() => navigate('/dashboard#Home')} />
            </FlexDiv> :
            <>
              <FlexDiv>
                SLA History log for PR ID: {pr_id}
              </FlexDiv>

              <FlexDiv>
                <div className="ag-theme-alpine" style={{ height: '75vh', width: '100%' }}>

                  {/* <h2>SLA History for : {pr_id}</h2> */}
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
            </>

        }
      </Container>

    </BaseLayout>

  )
}
