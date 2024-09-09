import ErrorModal from '../../Common/ErrorModal';
import ErrorResult from '../../Common/ErrorResult';
import FlexDiv from '../../Common/FlexDiv'
import Loader from '../../Common/Loader';
import axios from 'axios';
import React, { useState } from 'react'
import { IoSearchSharp } from 'react-icons/io5'
import TicketsTable from '../TicketTable/TicketTable';
import { BASE_URL } from '../../../constants/constants';



export default function SearchTicket() {
    const [ticketNumber, setTicketNumber] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [errorResult, setErrorResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState(null);
    const storedSession = JSON.parse(localStorage.getItem('session'));
    const searchTicket = async () => {
        if (ticketNumber === '' || !(ticketNumber.startsWith('PR')) || ticketNumber.length < 13) {
            setError(true)
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${BASE_URL}/ticket/fetch-tickets`,
                {
                    'prIDs': ticketNumber.split('\n').join(',')
                },
                {
                    'headers': {
                        'authorization': storedSession.Authorization,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(res);
            
            setLoading(false);
            setData(res.data.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error)
                setErrorMessage(!error.response.data)
                setErrorResult(true)
                setLoading(false)
            } else {
                setErrorMessage('Something went wrong!')
                setErrorResult(true)
                setLoading(false)
            }
        }
    }

    if (loading) {
        return (
            <FlexDiv classes='w-full h-screen'>
                <Loader />
            </FlexDiv>
        )
    }

    return (
        <FlexDiv classes='h-[80vh] bg-white p-10'>
            {errorResult ?
                <FlexDiv classes='mt-20'>
                    <ErrorResult text={errorMessage} onClick={() => setErrorResult(false)} />
                </FlexDiv> :
                <FlexDiv direction='column' classes='' gapY={20}>
                    <span className='text-3xl text-stc-purple font-medium '>Search Ticket</span>
                    <FlexDiv justify='end' classes='px-40'>
                        <textarea
                        defaultValue={ticketNumber}
                            onChange={(e) => setTicketNumber(e.target.value)}
                            type='text' placeholder='PRXXXXXXXXXXX' className='focus:outline-none border-2 rounded-md py-5 px-1 w-full border-stc-purple resize-vertical min-h-[100px] line-height-1.5' />
                        <IoSearchSharp onClick={searchTicket} className='absolute mr-3 text-2xl text-stc-purple cursor-pointer' />
                    </FlexDiv>
                    <button type='button' onClick={searchTicket} className='py-2 px-3 w-64 rounded-md bg-stc-red text-white'>
                        Search
                    </button>

                    {
                        data && <TicketsTable data={data} />
                    }

                </FlexDiv>
            }
            {
                error &&
                <ErrorModal open={error} heading='Error' body={'Invalid Ticket Number'} close={()=>setError(false)} />
            }
        </FlexDiv>
    )
}
