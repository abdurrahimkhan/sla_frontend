import { Collapse, Divider } from 'antd'
import React, { useState } from 'react'
import FlexDiv from './FlexDiv'
import { FaMinus, FaPlus } from 'react-icons/fa'

export default function CollapseComponent(
    { headerText, children }
) {

    const [open, setOpen] = useState(true)
    
    return (
        <div className='accordian shadow-xl '>
            
            <FlexDiv justify='space-between' onClick={() => setOpen(!open)} classes={`header rounded-t-md py-3 px-3 text-white font-medium ${headerText.includes('STC') ? 'bg-stc-purple' : 'bg-stc-red' } cursor-pointer`}>
                <span>{headerText}</span>

                {open ? <FaMinus /> : <FaPlus />}
            </FlexDiv>
            {open &&
                <div className={`text-stc-black bg-white rounded-b-md py-3 px-4 ${open ? '' : ''}`}>
                    {children}
                </div>
            }

        </div>
    )
}
