'use client';
// import type { Dayjs } from 'dayjs';
import React from 'react';
import axios from 'axios'
import { Calendar, ConfigProvider, theme } from 'antd';
import Loader from '../../Common/Loader';
import FlexDiv from '../../Common/FlexDiv';
import { BASE_URL } from '../../../constants/constants';
import SuccessModal from '../../Common/SuccessModal';
import ErrorModal from '../../Common/ErrorModal';
// import { SelectInfo } from 'antd/es/calendar/generateCalendar';


const CalendarComponent = () => {
  const { token } = theme.useToken();
  const [loading, setLoading] = React.useState(true);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [status, setStatus] = React.useState(0);
  const storedSession = JSON.parse(localStorage.getItem('session'));
  const [errorMessage, setErrorMessage] = React.useState('');
  const [slaDetails ,setSlaDetails] = React.useState('');
  // const [errorResult, setErrorResult] = React.useState(false);




  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);


  const handleSelect = (value, selectInfo) => {
    console.log(value.format('YYYY-MM-DD'), selectInfo);

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${BASE_URL}/ticket/tickets-by-closed-date?closed_date=${value.format('YYYY-MM-DD')}`,
      headers: {
        'Authorization': storedSession.Authorization,
        'Content-Type': 'application/json'
      },
    };

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setSlaDetails(response.data.count);
        setStatus(200);
        console.log("donereceived");
        
      })
      .catch((error) => {
        console.log(error);
        if (axios.isAxiosError(error)) {
          console.log(error)
          setErrorMessage(!error.response.data)
          // setErrorResult(true)
          setStatus(500)
          setLoading(false)
        } else {
          setErrorMessage('Something went wrong!')
          // setErrorResult(true)
          setStatus(500)
          setLoading(false)
        }
      });

    // If end date is less than start date, reset start and end date
    // if (startDate !== null && value.format('YYYY-MM-DD') < startDate) {
    //   setStartDate(null);
    //   setEndDate(null);
    // }

    // if (endDate !== null) {
    //   setStartDate(null);
    //   setEndDate(null);
    // }
    // if (startDate === null) {
    //   setStartDate(value.format('YYYY-MM-DD'));
    // } else if (startDate !== null) {
    //   setEndDate(value.format('YYYY-MM-DD'));
    // }

  };

  const wrapperStyle = {
    width: '100%',
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };

  function onFullRender(date) {
    const dateStr = date.format('DD');
    const selectedDate = date.format('YYYY-MM-DD');
    let style;
    if (selectedDate === startDate || selectedDate === endDate) {
      style = { background: "#ff375e", color: '#fff', borderTop: `0` };
    }
    return (
      <div style={style} className="ant-picker-cell-inner ant-picker-calendar-date">
        <div className="ant-picker-calendar-date-value">{dateStr}
        </div><div className="ant-picker-calendar-date-content">
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <FlexDiv classes='w-full h-[70vh]'>
        <Loader />
      </FlexDiv>
    );
  }

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Calendar: {
              fullBg: '#fff',
              colorText: '#4f008c',
              fontSize: 18,
              itemActiveBg: '#ff375e',
              colorTextDisabled: '#a1a1a1',
              colorPrimaryText: '#fff',
              monthControlWidth: 200,
              yearControlWidth: 200,
              colorPrimary: '#fff',
              colorLink: '#4f008c',
              colorLinkActive: '#ff375e',
            }
          }
        }}
      >
        <div style={wrapperStyle}>
          <Calendar onSelect={handleSelect} dateFullCellRender={onFullRender} />
        </div>
      </ConfigProvider>

      {status === 200 && <SuccessModal heading='Success' body={slaDetails} open={status === 200} close={() => {setStatus(0); setSlaDetails('')} } />}

      {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}

    </>

  );
};

export default CalendarComponent;