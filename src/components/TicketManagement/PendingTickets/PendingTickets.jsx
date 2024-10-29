import FlexDiv from '../../Common/FlexDiv'
import SuccessResults from '../../Common/SuccessResult';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import TicketsTable from '../TicketTable/TicketTable';
import Loader from '../../Common/Loader';
import { TICKET_PERMISSIONS } from '../../../lib/permissions';
// import { useSession } from 'next-auth/react';
import useAuth from '../../../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../../constants/constants';
import ErrorResult from '../../Common/ErrorResult';



export default function PendingTickets(
    { notification, type }
) {
    console.log("PT");
    const [tickets, setTickets] = useState();
    const [loading, setLoading] = useState(true);
    // const { data: session } = useSession();
    const { session, signOut } = useAuth();
    const [errorMessage, setErrorMessage] = useState('')
    const [errorResult, setErrorResult] = useState(false);
    const navigate = useNavigate();
    const storedSession = JSON.parse(localStorage.getItem('session'));


    const searchPendingTickets = async () => { 

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${BASE_URL}/ticket/user-pending-tickets-for-action`,
            headers: {
                'Authorization': storedSession.Authorization,
                'Content-Type': 'application/json'
            },
            params: {
                user_id: storedSession.user.id,
            }
        };

        axios.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                if (notification) {
                    setTickets(response.data.data);
                    setLoading(false);
                }
                else {
                    setTickets(response.data.data);
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
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
            })
            .finally(() => {
                setLoading(false)
            });

    }


    useEffect(() => {
        if (storedSession && !tickets) {
            searchPendingTickets();
        } else {
            navigate(`/`);
        }
    }, [])

    if (loading) return (
        <FlexDiv classes='w-[calc(100vw-300px)] h-[calc(100vh-200px)]'>
            <Loader />
        </FlexDiv>
    )
    return (
        <div>
            <FlexDiv classes='min-h-[80vh] bg-white p-10' alignment='start'>
                {
                    errorResult ?
                        <FlexDiv classes='mt-20'>
                            <ErrorResult text={errorMessage} onClick={() => setErrorResult(false)} />
                        </FlexDiv> :
                        tickets?.length === 0 ?
                            <FlexDiv classes='mt-[15%]'>
                                <SuccessResults text={'No pending tickets'} />
                            </FlexDiv> :
                            <FlexDiv direction='column' classes='' gapY={20}>
                                {
                                    tickets && <TicketsTable data={tickets} />
                                }
                            </FlexDiv>
                }
            </FlexDiv>
        </div>
    )
}
