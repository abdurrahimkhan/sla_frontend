import React, { useState } from 'react'
import FlexDiv from '../Common/FlexDiv'
// import { useSession } from 'next-auth/react';
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

    return (
        <div className='flex flex-col gap-y-5 '>
            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <span className='font-medium'>Restoration Duration</span>
                <span>{restoration_duration}</span>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <span className='font-medium'>SLA Type</span>
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
            
            {status === 200 && <SuccessModal heading='Success' body={'Response submitted successfully'} open={status === 200} close={() => window.location.href = '/dashboard'} />}

            {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}
        </div>
    )
}
