import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
// import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, ConfigProvider, Input, Space, Table } from 'antd';
// import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
// import { useRouter } from 'next/navigation';
import { CONTRACTOR } from '../../../constants/constants';
import { Excel } from 'antd-table-saveas-excel';
import FlexDiv from '../../Common/FlexDiv';
import { useNavigate } from 'react-router-dom';


const TicketsTable = ({ data, searchTicket }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  // const router = useRouter();
  const navigate = useNavigate();

  const handleSearch = (
    selectedKeys,
    confirm,
    dataIndex,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };


  const clearFilters = () => {
    window.location.reload();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined style={{ color: '#000' }} />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys)[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#fff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value).toLowerCase()),

    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#00c48c', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: 'Ticket Number',
      dataIndex: 'PR_ID',
      key: 'PR_ID',
      ...getColumnSearchProps('PR_ID'),
    },
    {
      title: 'Domain',
      dataIndex: 'Domain',
      key: 'Domain',
      ...getColumnSearchProps('Domain'),
    },
    {
      title: 'Severity',
      dataIndex: 'Priority',
      key: 'Priority',
      ...getColumnSearchProps('Priority'),
    },
    {
      title: 'Service Impacted',
      dataIndex: 'Service_Impacted',
      key: 'Service_Impacted',
      ...getColumnSearchProps('Service_Impacted'),
    },
    {
      title: 'PTL PassFail',
      dataIndex: 'PTL_PassFail',
      key: 'PTL_PassFail',
      ...getColumnSearchProps('PTL_PassFail'),
    },
    {
      title: 'PTL Objective',
      dataIndex: 'ptl',
      key: 'ptl',
      ...getColumnSearchProps('ptl'),
    },
    {
      title: 'MTTR PassFail',
      dataIndex: 'MTTR_PassFail',
      key: 'MTTR_PassFail',
      ...getColumnSearchProps('MTTR_PassFail'),
    },
    {
      title: 'MTTR Objective',
      dataIndex: 'mttr',
      key: 'mttr',
      ...getColumnSearchProps('mttr'),
    },
    {
      title: 'Restoration Duration',
      dataIndex: 'Restoration_Duration',
      key: 'Restoration_Duration',
      ...getColumnSearchProps('Restoration_Duration'),
    },
    {
      title: 'Huawei Hubtime',
      dataIndex: 'Huawei_Hubtime',
      key: 'Huawei_Hubtime',
      ...getColumnSearchProps('Huawei_Hubtime'),
    },
    {
      title: 'Huawei Exclusion Requested Time',
      dataIndex: 'Exclusion_Time',
      key: 'Exclusion_Time',
      ...getColumnSearchProps('Exclusion_Time'),
    },
    {
      title: 'Huawei Exclusion Reason',
      dataIndex: 'Exclusion_Reason',
      key: 'Exclusion_Reason',
      ...getColumnSearchProps('Exclusion_Reason'),
    },

    {
      title: 'Huawei Remarks',
      dataIndex: 'Huawei_Remarks',
      key: 'Huawei_Remarks',
      ...getColumnSearchProps('Huawei_Remarks'),
    },
    {
      title: 'STC Regional Final Acceptance',
      dataIndex: 'STC_Regional_Final_Acceptance',
      key: 'STC_Regional_Final_Acceptance',
      ...getColumnSearchProps('STC_Regional_Final_Acceptance'),
    },
    {
      title: 'STC Region Handler',
      dataIndex: 'STC_Region_Handler',
      key: 'STC_Region_Handler',
      ...getColumnSearchProps('STC_Region_Handler'),
    },
    {
      title: 'STC Regional Agreed Time',
      dataIndex: 'STC_Regional_Accepted_Time',
      key: 'STC_Regional_Accepted_Time',
      ...getColumnSearchProps('STC_Regional_Accepted_Time'),
    },
    {
      title: 'STC Regional Remarks',
      dataIndex: 'STC_Remarks',
      key: 'STC_Remarks',
      ...getColumnSearchProps('STC_Remarks'),
    },
    {
      title: 'STC NOC Acceptance',
      dataIndex: 'Exclusion_Time_Agreed',
      key: 'Exclusion_Time_Agreed',
      ...getColumnSearchProps('Exclusion_Time_Agreed'),
    },
    {
      title: 'STC NOC Handler',
      dataIndex: 'STC_NOC_Handler',
      key: 'STC_NOC_Handler',
      ...getColumnSearchProps('STC_NOC_Handler'),
    },
    {
      title: 'Root Cause',
      dataIndex: 'Root_Cause',
      key: 'Root_Cause',
      ...getColumnSearchProps('Root_Cause'),
    },
    {
      title: 'Root Cause Detail',
      dataIndex: 'Root_Cause_Detail',
      key: 'Root_Cause_Detail',
      ...getColumnSearchProps('Root_Cause_Detail'),
    },
    {
      title: 'Ticket Closed Date',
      dataIndex: 'Ticket_Closed_Date',
      key: 'Ticket_Closed_Date',
      ...getColumnSearchProps('Ticket_Closed_Date'),
    },
    {
      title: 'Site ID',
      dataIndex: 'Site_ID',
      key: 'Site_ID',
      ...getColumnSearchProps('Site_ID'),
    },
    {
      title: 'Site Name',
      dataIndex: 'Site_Name',
      key: 'Site_Name',
      ...getColumnSearchProps('Site_Name'),
    },
    {
      title: 'Technology',
      dataIndex: 'Technology',
      key: 'Technology',
      ...getColumnSearchProps('Technology'),
    },
    {
      title: `Hua Referrals`,
      dataIndex: 'Hua_Referrals',
      key: 'Hua_Referrals',
      ...getColumnSearchProps('Hua_Referrals'),
    },
    {
      title: 'Last_Modified_Date',
      dataIndex: 'Last_Modified_Date',
      key: 'Last_Modified_Date',
      ...getColumnSearchProps('Last_Modified_Date'),
    },
    {
      title: 'Last_Modified_By',
      dataIndex: 'Last_Modified_By',
      key: 'Last_Modified_By',
      ...getColumnSearchProps('Last_Modified_By'),
    },
    {
      title: 'Exclusion Status',
      dataIndex: 'Exclusion_Status',
      key: 'Exclusion_Status',
      ...getColumnSearchProps('Exclusion_Status'),
    },
    {
      title: 'Parent TT',
      dataIndex: 'Parent_TT',
      key: 'Parent_TT',
      ...getColumnSearchProps('Parent_TT'),
    },
    {
      title: 'Longest Hua Group',
      dataIndex: 'Longest_Hua_Group',
      key: 'Longest_Hua_Group',
      ...getColumnSearchProps('Longest_Hua_Group'),
    },

  ];

  const handleExport = () => {
    const excel = new Excel();

    excel.addSheet('Data').addColumns(columns).addDataSource(
      data, {
      str2Percent: true,
    }
    ).saveAs('SLA-Dump.xlsx')
  }

  return (
    <ConfigProvider
      theme={
        {
          components: {
            Table: {
              rowHoverBg: '#ff375e',
              colorLinkHover: '#fff',
              headerBg: '#4f008c',
              headerColor: '#fff',
              headerFilterHoverBg: '#ff375e',
              headerSortHoverBg: '#ff375e',
              headerSortActiveBg: '#ff375e',
            }
          }
        }
      }>
      <FlexDiv justify='space-between'>
        <Space>
          <Button onClick={clearFilters}>Clear filters</Button>
        </Space>

        <span>
          Total Tickets: {data.length}
        </span>

        <button className='bg-stc-purple text-white rounded-md px-3 py-2 ' onClick={handleExport}>Export to Excel</button>
      </FlexDiv>
      <div className='w-full overflow-x-scroll'>
        <div className='w-[4050px] '>
          <Table 
            columns={columns} 
            dataSource={data} 
            pagination={{ position: ['bottomLeft'] }} 
            rowClassName={'cursor-pointer'}
            rowKey={(record) => record.PR_ID} // Added rowKey to ensure each row has a unique key
            onRow={(record, index) => {
              return {
                onClick: () => {
                  if (searchTicket) {
                    navigate(`/ticket/view/${record.PR_ID}`)
                  } else {
                    navigate(`/ticket/${record.PR_ID}?source=pending`)
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </ConfigProvider>
  )
};

export default TicketsTable;