import React from "react";
import FlexDiv from "../Common/FlexDiv";
import { IoAddCircleOutline, IoCalendarOutline, IoCreateOutline, IoHomeOutline, IoNotificationsOutline, IoSearchCircleOutline, IoSearchOutline, IoTicketOutline } from "react-icons/io5";
import { FaTable } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const navItems = [
    {
        icon: <IoHomeOutline className="text-white text-2xl font-thin" />,
        text: 'Home',
        link: '/dashboard'
    },
    {
        icon: <IoNotificationsOutline className="text-white text-2xl font-thin" />,
        text: 'Notifications',
        link: '/notifications'
    },
    {
        icon: <IoSearchOutline className="text-white text-2xl font-thin" />,
        text: 'Search',
        link: '/search-ticket'
    },
    {
        icon: <FaTable className="text-white text-2xl font-thin" />,
        text: 'All Closed Tickets',
        link: '/all-tickets'
    }
]


export default function Sidebar({ opened }) {
    const navigate = useNavigate();
    
    return (
        <div className={`w-1/4  ${opened ? 'max-w-[200px]' : 'max-w-[60px]'} hover:max-w-[200px] duration-[200ms] group ease-in-out bg-purple min-h-screen fixed h-full py-16`}>
            <FlexDiv direction="column" alignment="center" gapY={30}>
                {navItems.map((item, index) => (
                    <FlexDiv key={index} justify={'start'} alignment="center" classes={`px-3 cursor-pointer hover:bg-[#3b0f66] hover:border-l-[3px] hover:border-stc-red py-2 ${item.text === 'red' ? 'border-l-[3px] border-stc-red' : 'border-l-[3px] border-stc-purple'}`} gapX={16}
                        onClick={() => navigate(item.link)}
                    >
                        {item.icon}
                        <span className={` ${opened ? 'inline' : 'hidden'} group-hover:inline text-base text-white font-semibold`}>{item.text}</span>
                    </FlexDiv>
                ))}
            </FlexDiv>
        </div>
    );
}
