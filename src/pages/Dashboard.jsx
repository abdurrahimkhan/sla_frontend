import BaseLayout from '../components/BaseLayout/BaseLayout';
import Container from '../components/Common/Container';
import FlexDiv from '../components/Common/FlexDiv';
import Loader from '../components/Common/Loader';
import Home from '../components/Home/Home';
import BulkUploader from '../components/TicketManagement/BulkUpload/BulkUpload';
import Calendar from '../components/TicketManagement/CalendarComponent/Calendar';
import CreateTicket from '../components/TicketManagement/CreateTicket/CreateTicket';
// import NotificationsPanel from '../components/TicketManagement/Notifications/NotificationsPanel';
import PendingTickets from '../components/TicketManagement/PendingTickets/PendingTickets';
import SearchTicket from '../components/TicketManagement/SearchTicket/SearchTicket';
// import Head from 'next/head';
// import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
// import useAuth from '../auth/useAuth'
import { useNavigate } from 'react-router-dom';
import MiddlewareProvider from '../middleware/AuthMiddleware';
import CreateUser from '../components/UserManagement/CreateUser';
import UserProfile from '../components/UserManagement/UserProfile';
import TicketsFullView from '../components/Tables/TicketsFullView';




export default function Dashboard() {
    // const router = useRouter();
    // const { session, status, signIn, signOut } = useAuth();



    return (
        <MiddlewareProvider>
            <BaseLayout >
                <Container>
                    <Home />
                </Container>
            </BaseLayout>
        </MiddlewareProvider>
    )
}