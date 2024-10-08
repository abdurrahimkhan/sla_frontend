import React from 'react'
import FlexDiv from '../Common/FlexDiv'

export default function StcNocInfo(
    {
        accepted,
        approved_excluded_time,
        approved_rejected_by,
        remarks
    }
) {
    return (
        <div className='flex flex-col gap-y-5 '>
            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <span className='font-medium'>Accepted</span>
                <span>{accepted}</span>
            </FlexDiv>


            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <span className='font-medium'>Approved Excluded Time</span>
                <span>{approved_excluded_time}</span>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <span className='font-medium'>Approved/Rejected By</span>
                <span>{approved_rejected_by}</span>
            </FlexDiv>
            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                <div>
                    <span className='font-medium'>Governance  <br/> Remarks</span>
                </div>
                <textarea className='h-24 w-3/4 px-2 py-2 bg-slate-100 rounded-md' disabled>{remarks}</textarea>
            </FlexDiv>
        </div>
    )
}
