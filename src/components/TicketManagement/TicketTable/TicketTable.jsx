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
import {  useNavigate  } from 'react-router-dom';


const TicketsTable = ({ data }) => {
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

  const getColumnSearchProps = (dataIndex)=> ({
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
      title: 'PR_ID',
      dataIndex: 'PR_ID',
      key: 'PR_ID',
      ...getColumnSearchProps('PR_ID'),
    },
    {
      title: 'Request Type',
      dataIndex: 'Request_Type',
      key: 'Request_Type',
      ...getColumnSearchProps('Request_Type'),
    },
    {
      title: 'Domain',
      dataIndex: 'Domain',
      key: 'Domain',
      ...getColumnSearchProps('Domain'),
    },
    {
      title: 'Priority',
      dataIndex: 'Priority',
      key: 'Priority',
      ...getColumnSearchProps('Priority'),
    },
    {
      title: 'Service_Impacted',
      dataIndex: 'Service_Impacted',
      key: 'Service_Impacted',
      ...getColumnSearchProps('Service_Impacted'),
    },
    {
      title: 'Root_Cause',
      dataIndex: 'Root_Cause',
      key: 'Root_Cause',
      ...getColumnSearchProps('Root_Cause'),
    },
    {
      title: 'Root_Cause_Detail',
      dataIndex: 'Root_Cause_Detail',
      key: 'Root_Cause_Detail',
      ...getColumnSearchProps('Root_Cause_Detail'),
    },
    {
      title: 'Ticket_Closed_Date',
      dataIndex: 'Ticket_Closed_Date',
      key: 'Ticket_Closed_Date',
      ...getColumnSearchProps('Ticket_Closed_Date'),
    },
    {
      title: 'Site_ID',
      dataIndex: 'Site_ID',
      key: 'Site_ID',
      ...getColumnSearchProps('Site_ID'),
    },

    {
      title: 'Site_Name',
      dataIndex: 'Site_Name',
      key: 'Site_Name',
      ...getColumnSearchProps('Site_Name'),
    },
    {
      title: 'District',
      dataIndex: 'District',
      key: 'District',
      ...getColumnSearchProps('District'),
    },
    {
      title: 'Region',
      dataIndex: 'Region',
      key: 'Region',
      ...getColumnSearchProps('Region'),
    },
    {
      title: 'Assigned District',
      dataIndex: 'Hua_District',
      key: 'Hua_District',
      ...getColumnSearchProps('Hua_District'),
    },
    {
      title: 'Assigned Department',
      dataIndex: 'Hua_Department',
      key: 'Hua_Department',
      ...getColumnSearchProps('Hua_Department'),
    },
    {
      title: 'Exclusion_Status',
      dataIndex: 'Exclusion_Status',
      key: 'Exclusion_Status',
      ...getColumnSearchProps('Exclusion_Status'),
    },
    {
      title: 'Exclusion_Time_Requested',
      dataIndex: 'Exclusion_Time_Requested',
      key: 'Exclusion_Time_Requested',
      ...getColumnSearchProps('Exclusion_Time_Requested'),
    },
    {
      title: 'Exclusion_Time_Agreed',
      dataIndex: 'Exclusion_Time_Agreed',
      key: 'Exclusion_Time_Agreed',
      ...getColumnSearchProps('Exclusion_Time_Agreed'),
    },
    {
      title: 'Exclusion_Reason',
      dataIndex: 'Exclusion_Reason',
      key: 'Exclusion_Reason',
      ...getColumnSearchProps('Exclusion_Reason'),
    },
    {
      title: 'Contractor_Remarks',
      dataIndex: 'Contractor_Remarks',
      key: 'Contractor_Remarks',
      ...getColumnSearchProps('Contractor_Remarks'),
    },
    {
      title: 'STC_Remarks_Gov',
      dataIndex: 'STC_Remarks_Gov',
      key: 'STC_Remarks_Gov',
      ...getColumnSearchProps('STC_Remarks_Gov'),
    },
    {
      title: 'Technology',
      dataIndex: 'Technology',
      key: 'Technology',
      ...getColumnSearchProps('Technology'),
    },
    {
      title: 'Parent_TT',
      dataIndex: 'Parent_TT',
      key: 'Parent_TT',
      ...getColumnSearchProps('Parent_TT'),
    },
    {
      title: `${CONTRACTOR} Referrals`,
      dataIndex: 'Contractor_Referrals',
      key: 'Contractor_Referrals',
      ...getColumnSearchProps('Contractor_Referrals'),
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
          <Table columns={columns} dataSource={data} pagination={{ position: ['bottomLeft'] }} rowClassName={'cursor-pointer'}
            onRow={(record, index) => {
              return {
                onClick: () => {
                  navigate(`/ticket/${record.PR_ID}?source=pending`)
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