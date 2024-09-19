import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import FlexDiv from "../Common/FlexDiv";
import Header from "../Header/Header";
import SlideOver from "../SlideOver/SlideOver";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL, CONTRACTOR } from "../../constants/constants";
import Loader from "../Common/Loader";
import ErrorResult from "../Common/ErrorResult";

export default function BaseLayout({
    children,
    activeTab,
    setActiveTab
}) {
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('')
    const [errorResult, setErrorResult] = useState(false);
    const storedSession = JSON.parse(localStorage.getItem('session'));

    const getTicketCount = async () => {
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
                const tickets = response.data;
                const tempItems = [];
                const my_obj = {
                    key: '1',
                    label: (
                        <span onClick={() => { window.location.href = '/dashboard#ViewMTTR'; }} className='text-stc-red hover:text-white py-1 w-full px-3 hover:bg-stc-red'>
                            {tickets.data.length} Requests ({CONTRACTOR})
                        </span>
                    )
                }
                tempItems.push(my_obj);
                console.log(tempItems);
                
                setItems(tempItems);
                setLoading(false);
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
            });
    }

    useEffect(() => {
        if (storedSession) {
            getTicketCount();
        }
    }, [])

    if (loading) return (
        <FlexDiv classes='w-screen h-screen'>
            <Loader />
        </FlexDiv>
    )

    return (
        <>
            {
                errorResult ?
                    <FlexDiv classes='mt-20'>
                        <ErrorResult text={errorMessage} onClick={() => setErrorResult(false)} />
                    </FlexDiv> :
                    <React.Fragment>
                        <div className="fixed w-full h-16 z-10">
                            <Header setOpen={setOpen} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} items={items} />
                        </div>
                        <div className="flex min-h-screen ">
                            <div className="mt-16 ">
                                <Sidebar active={activeTab} setActive={setActiveTab} opened={sidebarOpen} />
                            </div>
                            <FlexDiv alignment="start" classes="w-full pt-16 pb-10 px-16">
                                {children}
                            </FlexDiv>
                        </div>

                        <SlideOver open={open} setOpen={setOpen} />
                    </React.Fragment>
            }
        </>


    )
}