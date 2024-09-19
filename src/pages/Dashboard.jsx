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
// import useAuth from '../Auth/useAuth'
import { useNavigate } from 'react-router-dom';
import MiddlewareProvider from '../Middleware/AuthMiddleware';
import CreateUser from '../components/UserManagement/CreateUser';
import UserProfile from '../components/UserManagement/UserProfile';
import TicketsFullView from '../components/Tables/TicketsFullView';


const tabs = [
    {
        name: 'Home',
        component: <Home />
    },
    {
        name: 'Notifications',
        component: <PendingTickets notification={true} type={'Both'} />
    },
    {
        name: 'Search',
        component: <SearchTicket />
    },
    {
        name: 'View',
        component: <PendingTickets />
    },
    {
        name: 'ViewMTTR',
        component: <PendingTickets notification={true} type={'MTTR'} />
    },
    {
        name: 'ViewPTL',
        component: <PendingTickets notification={true} type={'PTL'} />
    },
    {
        name: 'Calendar',
        component: <Calendar />
    },
    {
        name: 'Create',
        component: <CreateTicket />
    },
    {
        name: 'CreateUser',
        component: <CreateUser />
    },
    {
        name: 'Profile',
        component: <UserProfile />
    },
    {
        name: 'Import',
        component: <BulkUploader />
    },
    {
        component: <TicketsFullView />,
        name: 'AllTickets'
    }
];

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(tabs[0].name);
    // const router = useRouter();
    // const { session, status, signIn, signOut } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {

        const path = window.location.href;
        const pathArray = path.split('#');
        const tabName = pathArray[1];
        if (tabName) {
            setActiveTab(tabName);
        }
        console.log('wtf');
        setLoading(false);
        navigate(`/dashboard#${tabName}`);
    }, [window.location.href]);


    // useEffect(() => {
    //     console.log("done");
    //     console.log(activeTab);
    //     navigate(`/dashboard#${activeTab}`);
    // }, [activeTab]);




    if (loading) return (
        <FlexDiv classes='w-screen h-screen'>
            <Loader />
        </FlexDiv>
    )

    return (
        <MiddlewareProvider>
            <BaseLayout activeTab={activeTab} setActiveTab={setActiveTab}>
                <Container>
                    {tabs.map((tab, index) => {
                        if (tab.name === activeTab) {
                            return (
                                <div key={index}>
                                    {tab.component}
                                </div>
                            )
                        }
                    })}
                </Container>

            </BaseLayout>
        </MiddlewareProvider>
    )
}