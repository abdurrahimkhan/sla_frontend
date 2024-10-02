import React, { useState } from 'react'
import FlexDiv from '../Common/FlexDiv'
// import { useSession } from 'next-auth/react';
import axios from 'axios';
import SuccessModal from '../Common/SuccessModal';
import ErrorModal from '../Common/ErrorModal';
import useAuth from '../../auth/useAuth';

export default function ContractorInfo(
    {
        ticket_number,
        restoration_duration,
        request_type,
        requested_time,
        exclusion_reason,
        exclusion_remarks,
        exclusion_status
    }
) {

    const [status, setStatus] = useState(0);
    const [errorMessage, setErrorMessage] = useState('')
    // const { data: session } = useSession();
    const { session } = useAuth();

    const handleClick = async () => {
        if (exclusion_status === 'Contractor Region') {
            if (session && session.user) {
                const res = await axios.post('/api/ticket/update/huawei_region', null, {
                    params: {
                        ticket_number: ticket_number,
                        handler: session.user.name,
                        current_state: exclusion_status,
                    }
                });
                setStatus(200);
            }
        }
        else if (exclusion_status === 'Contractor NOC') {
            if (session && session.user) {
                const res = await axios.post('/api/ticket/update/huawei_noc', null, {
                    params: {
                        ticket_number: ticket_number,
                        handler: session.user.name,
                        current_state: exclusion_status,
                    }
                });

                setStatus(200);
            }
        }
    }


    return (
        <div className='flex flex-col gap-y-5 '>
            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <span className='font-medium'>Restoration Duration</span>
                <span>{restoration_duration}</span>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <span className='font-medium'>Request Type</span>
                <span>{request_type}</span>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <span className='font-medium'>Requested Time</span>
                <span>{requested_time}</span>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <span className='font-medium'>Reason</span>
                <span className='ml-20 text-right'>{exclusion_reason}</span>
            </FlexDiv>
            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <div>
                    <span className='font-medium'>Exclusion <br /> Remarks</span>
                </div>
                <textarea className='h-24 w-3/4 px-2 py-2 bg-slate-100 rounded-md' disabled>{exclusion_remarks}</textarea>
            </FlexDiv>
            {(exclusion_status === 'Contractor Region' || exclusion_status === 'Contractor NOC') &&
                <FlexDiv justify='end' classes='border-b border-stc-black'>

                    <button onClick={handleClick} className='bg-stc-purple shadow-lg text-white py-2 px-3 rounded-md'>Submit Again</button>

                </FlexDiv>
            }
            {status === 200 && <SuccessModal heading='Success' body={'Response submitted successfully'} open={status === 200} close={() => window.location.href = '/dashboard'} />}

            {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}
        </div>
    )
}
