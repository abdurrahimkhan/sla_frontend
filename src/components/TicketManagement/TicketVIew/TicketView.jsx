import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
// import type { GetRef, TableColumnsType, TableColumnType } from 'antd';
import { Button, ConfigProvider, Input, Space, Table } from 'antd';
// import type { FilterDropdownProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import { BASE_URL } from '../../../constants/constants';



const TicketView = ({ data }) => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [data1, setData] = useState();
    const storedSession = JSON.parse(localStorage.getItem('session'));

    useEffect(() => {
        console.log(data[0]['value']);
        const getTicketDetails = async () => {
            const res = await axios.get(
                `${BASE_URL}/view/get-user-filtered-data-from-view`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + storedSession.Authorization,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(res);
        }

        getTicketDetails();

    }, []);


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
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '30%',
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            width: '70%',
            ...getColumnSearchProps('value'),
        },
    ];

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
            {searchText !== '' &&
                <Space style={{ marginBottom: 16 }}>
                    <Button onClick={clearFilters}>Clear filters</Button>
                </Space>
            }
            <div className='w-full'>
                <Table columns={columns} dataSource={data} sticky pagination={false} rowClassName={'capitalize'} />
            </div>
        </ConfigProvider>
    )
};

export default TicketView;