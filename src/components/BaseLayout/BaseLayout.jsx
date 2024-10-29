import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import FlexDiv from "../Common/FlexDiv";
import Header from "../Header/Header";
import SlideOver from "../SlideOver/SlideOver";
import { useState } from "react";
import { TicketCountProvider } from "../../context/TicketNotifications/GlobalProvider";

export default function BaseLayout({
    children,
}) {
    const [open, setOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);


    return (
        <TicketCountProvider>
            {

                <React.Fragment>
                    <div className="fixed w-full h-16 z-10">
                        <Header setOpen={setOpen} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    </div>
                    <div className="flex min-h-screen ">
                        <div className="mt-16 ">
                            <Sidebar opened={sidebarOpen} />
                        </div>
                        <FlexDiv alignment="start" classes="w-full pt-16 pb-10 px-16">
                            {children}
                        </FlexDiv>
                    </div>

                    <SlideOver open={open} setOpen={setOpen} />
                </React.Fragment>
            }
        </TicketCountProvider>


    )
}