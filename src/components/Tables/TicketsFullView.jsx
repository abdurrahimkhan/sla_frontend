import React, { useState, useEffect } from 'react'
import FlexDiv from '../Common/FlexDiv'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // AG Grid styles
import 'ag-grid-community/styles/ag-theme-alpine.css'; // AG Grid theme styles
import { BASE_URL } from '../../constants/constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Common/Loader';



export default function TicketsFullView({ setOpen, sidebarOpen, setSidebarOpen }) {
  const [columnDefs, setColumnDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const storedSession = JSON.parse(localStorage.getItem('session'));
  const navigate = useNavigate();

  const getAllTickets = async () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/ticket/tickets-by-status?status=SPOC Validation`,
      headers: {
        'Authorization': storedSession.Authorization,
      }
    };
    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = response.data.data;
        if (response.data.count > 0) {
          const columns = Object.keys(data[0]).map(key => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize headers
            filter: 'agSetColumnFilter'
          }));
          setColumnDefs(columns);
        }
        setRowData(data);
        setTotalCount(response.data.count);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }


  useEffect(() => {
    console.log("is this even working");
    console.log(storedSession)
    if (storedSession) {
      getAllTickets();
    }
  }, [])

  const handleRowClick = (event) => {
    const rowId = event.data.PR_ID; // Assuming 'id' is the key for unique row IDs
    navigate(`/ticket/${rowId}`); // Navigate to /ticket/id
  };

  if (loading) return (
    <FlexDiv classes='w-screen h-screen'>
      <Loader />
    </FlexDiv>
  )
  return (
    <FlexDiv>

      <div className="ag-theme-alpine" style={{ height: 536, width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10} // Set pagination to 10 rows per page
          defaultColDef={{ sortable: true, filter: true }}
          onRowClicked={handleRowClick}

        />
      </div>
    </FlexDiv>
  )
}
