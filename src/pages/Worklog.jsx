import React, { useState, useEffect } from 'react';
import FlexDiv from '../components/Common/FlexDiv';
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
import Cookie from 'js-cookie';

const Worklog = ({ setOpen, sidebarOpen, setSidebarOpen }) => {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Combined error state
  const session = Cookie.get("session");
  const storedSession = session ? JSON.parse(session) : null;
  const pr_id = window.location.pathname.split('/').pop();
  const navigate = useNavigate();

  // Fetch worklog data for the ticket
  const getWorklogOfTicket = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/worklog/fetch-ticket-worklog?ticketId=${pr_id}`,
        {
          headers: {
            Authorization: 'Bearer ' + storedSession.Authorization,
            'Content-Type': 'application/json',
          },
        }
      );
      
      const data = response.data.data;
      
      if (response.data.count > 0) {
        // Filter out unwanted columns and sort them
        const omitColumns = ["Worklog_ID", "PR_ID", "Log_Type"];
        const columnOrder = ["Modified_Date", "Modified_By", "Exclusion_Status", "Old_Exclusion_Status", "Notes", "Remarks", "STC_Exclude", "STC_Exclude_Time"];
        
        const columns = Object.keys(data[0])
          .filter(key => !omitColumns.includes(key)) // Omit columns
          .sort((a, b) => columnOrder.indexOf(a) - columnOrder.indexOf(b)) // Rearrange columns
          .map(key => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize headers
            filter: 'agSetColumnFilter',
          }));
          
        setColumnDefs(columns);
      }

      setRowData(data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 403) {
        setError({ message: "Not Authorized", type: "auth" });
      } else if (error.response?.status === 401) {
        navigate("/");
      } else {
        setError({ message: error.response?.data?.message || "Something went wrong", type: "general" });
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storedSession) {
      getWorklogOfTicket();
    } else {
      navigate('/');
    }
  }, [storedSession, pr_id, navigate]);

  useEffect(() => {
    if (error && error.type === 'auth') {
      setError(prev => ({ ...prev, message: "Not Authorized" }));
    }
  }, [error]);

  if (loading) {
    return (
      <FlexDiv classes="w-full h-screen">
        <Loader />
      </FlexDiv>
    );
  }

  return (
    <BaseLayout activeTab="worklog" setActiveTab={setOpen}>
      <Container definedClasses="w-full py-10 pl-40">
        {error ? (
          <FlexDiv classes="mt-[12%]">
            <ErrorResult text={error.message} onClick={() => navigate('/dashboard#Home')} />
          </FlexDiv>
        ) : (
          <>
            <FlexDiv>SLA History log for PR ID: {pr_id}</FlexDiv>
            <FlexDiv>
              <div className="ag-theme-alpine" style={{ height: '75vh', width: '100%' }}>
                <AgGridReact
                  rowData={rowData}
                  columnDefs={columnDefs}
                  pagination={true}
                  paginationPageSize={15} // Set pagination to 15 rows per page
                  defaultColDef={{ sortable: true, filter: true }}
                />
              </div>
            </FlexDiv>
            {error?.type === "general" && <ErrorModal heading="Something went wrong!" body={error.message} open={true} close={() => setError(null)} />}
          </>
        )}
      </Container>
    </BaseLayout>
  );
};

export default Worklog;
