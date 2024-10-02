import React from "react";
import FlexDiv from "../Common/FlexDiv";
import { IoAddCircleOutline, IoCalendarOutline, IoCreateOutline, IoHomeOutline, IoNotificationsOutline, IoSearchCircleOutline, IoSearchOutline, IoTicketOutline } from "react-icons/io5";
import { FaTable } from "react-icons/fa";



const navItems = [
    {
        icon: <IoHomeOutline className="text-white text-2xl font-thin" />,
        text: 'Home'
    },
    {
        icon: <IoNotificationsOutline className="text-white text-2xl font-thin" />,
        text: 'Notifications'
    },
    {
        icon: <IoSearchOutline className="text-white text-2xl font-thin" />,
        text: 'Search'
    },
    // {
    //     icon: <IoTicketOutline className="text-white text-2xl font-thin" />,
    //     text: 'View'
    // },
    // {
    //     icon: <IoCalendarOutline className="text-white text-2xl font-thin" />,
    //     text: 'Calendar'
    // },
    // {
    //     icon: <IoCreateOutline className="text-white text-2xl font-thin" />,
    //     text: 'Create'
    // },
    // {
    //     icon: <IoAddCircleOutline className="text-white text-2xl font-thin" />,
    //     text: 'Import'
    // },
    {
        icon: <FaTable className="text-white text-2xl font-thin" />,
        text: 'AllTickets'
    }
]



export default function Sidebar({ opened, active, setActive }) {
    console.log(active);
    console.log('sidebar')

    return (
        <div className={`w-1/4  ${opened ? 'max-w-[200px]' : 'max-w-[60px]'} hover:max-w-[200px] duration-[200ms] group ease-in-out bg-purple min-h-screen fixed h-full py-16`}>
            <FlexDiv direction="column" alignment="center" gapY={30}>
                {navItems.map((item, index) => (
                    <FlexDiv key={index} justify={'start'} alignment="center" classes={`px-3 cursor-pointer hover:bg-[#3b0f66] hover:border-l-[3px] hover:border-stc-red py-2 ${item.text === active ? 'border-l-[3px] border-stc-red' : 'border-l-[3px] border-stc-purple'}`} gapX={16}
                        onClick={() => setActive(item.text)}
                    >
                        {item.icon}
                        <span className={` ${opened ? 'inline' : 'hidden'} group-hover:inline text-base text-white font-semibold`}>{item.text}</span>
                    </FlexDiv>
                ))}
            </FlexDiv>
        </div>
    );
}
