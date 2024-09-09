'use client';
// import type { Dayjs } from 'dayjs';
import React from 'react';
import { Calendar, ConfigProvider, theme } from 'antd';
import Loader from '../../Common/Loader';
import FlexDiv from '../../Common/FlexDiv';
// import { SelectInfo } from 'antd/es/calendar/generateCalendar';


const CalendarComponent = () => {
  const { token } = theme.useToken();
  const [loading, setLoading] = React.useState(true);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);


  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);


  const handleSelect = (value, selectInfo) => {
    console.log(value.format('YYYY-MM-DD'), selectInfo);

    // If end date is less than start date, reset start and end date
    if (startDate !== null && value.format('YYYY-MM-DD') < startDate) {
      setStartDate(null);
      setEndDate(null);
    }

    if (endDate !== null) {
      setStartDate(null);
      setEndDate(null);
    }
    if (startDate === null) {
      setStartDate(value.format('YYYY-MM-DD'));
    } else if (startDate !== null) {
      setEndDate(value.format('YYYY-MM-DD'));
    }

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
  );
};

export default CalendarComponent;