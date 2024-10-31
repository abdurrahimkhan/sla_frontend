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
        mttrCount: 0,
        ptlCount: 0
    };
    const [state, dispatch] = useReducer(ticketReducer, initialState);
    const storedSession = JSON.parse(localStorage.getItem('session'));

    const fetchTicketStats = async () => {
        const cookieNameMttr = 'mttrCount';
        const cookieNamePtl = 'ptlCount';
        const cookieMttr = document.cookie.split('; ').find(row => row.startsWith(cookieNameMttr));
        const cookiePtl = document.cookie.split('; ').find(row => row.startsWith(cookieNamePtl));

        if (cookieMttr && cookiePtl) {
            const mttrCount = parseInt(cookieMttr.split('=')[1], 10);
            const ptlCount = parseInt(cookiePtl.split('=')[1], 10);
            dispatch({ type: 'UPDATE_TICKET_STATS', payload: { mttrCount, ptlCount } });
        } else {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${BASE_URL}/ticket/fetch-ticket-stats-by-user`,
                headers: {
                    'Authorization': `Bearer ${storedSession.Authorization}`,
                    'Content-Type': 'application/json'
                }
            };

            try {
                const response = await axios.request(config);
                console.log(response.data.data);
                const { mttr, ptl } = response.data.data;
                dispatch({ type: 'UPDATE_TICKET_STATS', payload: { mttrCount: mttr, ptlCount: ptl } });

                const expiryDate = new Date();
                expiryDate.setTime(expiryDate.getTime() + (1 * 60 * 1000)); // 1 minute
                document.cookie = `${cookieNameMttr}=${mttr}; expires=${expiryDate.toUTCString()}; path=/`;
                document.cookie = `${cookieNamePtl}=${ptl}; expires=${expiryDate.toUTCString()}; path=/`;
            } catch (error) {
                console.error(error);
            }
        }
    };

    const processTicket = () => {
        // Delete the cookies
        document.cookie = 'mttrCount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'ptlCount=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

        fetchTicketStats();  
    }

    useEffect(() => {
        if (storedSession) {
            fetchTicketStats();
        }
    }, []);

    return (
        <TicketCountContext.Provider value={{
            mttrCount: state.mttrCount,
            ptlCount: state.ptlCount,
            processTicket
        }}>
            {children}
        </TicketCountContext.Provider>
    );
};
