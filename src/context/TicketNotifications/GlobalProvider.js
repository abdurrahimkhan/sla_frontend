import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/constants';
import ticketReducer from './Reducer';

export const TicketCountContext = createContext();

export const useTicket = () => {
    return useContext(TicketCountContext);
};

export const TicketCountProvider = ({ children }) => {
    const initialState = {
        ticketCount: 0
    };
    const [state, dispatch] = useReducer(ticketReducer, initialState);
    const storedSession = JSON.parse(localStorage.getItem('session'));

    const fetchTicketCount = async () => {
        const cookieName = 'ticketCount';
        const cookie = document.cookie.split('; ').find(row => row.startsWith(cookieName));

        if (cookie) {
            const ticketCount = parseInt(cookie.split('=')[1], 10);
            dispatch({ type: 'UPDATE_TICKET_COUNT', payload: ticketCount });
        } else {
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

            try {
                const response = await axios.request(config);
                const tickets = response.data;
                const ticketCount = tickets.data.length;
                // Update the ticket count with the number of pending tickets
                dispatch({ type: 'UPDATE_TICKET_COUNT', payload: ticketCount });

                // Set a cookie with the ticket count and expiry time of 5 minutes
                const expiryDate = new Date();
                expiryDate.setTime(expiryDate.getTime() + (5 * 60 * 1000)); // 5 minutes
                document.cookie = `${cookieName}=${ticketCount}; expires=${expiryDate.toUTCString()}; path=/`;
            } catch (error) {
                console.error(error);
            }
        }
    };

    const processTicket = () => {
        dispatch({ type: 'PROCESS_TICKET' });

        // Update the cookie with the new ticket count
        const cookieName = 'ticketCount';
        const ticketCount = state.ticketCount - 1;
        const expiryDate = new Date();
        expiryDate.setTime(expiryDate.getTime() + (5 * 60 * 1000)); // 5 minutes
        document.cookie = `${cookieName}=${ticketCount}; expires=${expiryDate.toUTCString()}; path=/`;
    }

    useEffect(() => {
        if (storedSession) {
            fetchTicketCount();
        }
    }, []);

    return (
        <TicketCountContext.Provider value={{
            ticketCount: state.ticketCount,
            processTicket
        }}>
            {children}
        </TicketCountContext.Provider>
    );
};
