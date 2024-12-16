import React, { useContext, useState, useEffect } from 'react'
import FlexDiv from '../Common/FlexDiv'
// import { useSession } from 'next-auth/react';
import axios from 'axios';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';
import useAuth from '../../auth/useAuth';
import { BASE_URL } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import ErrorResult from '../Common/ErrorResult';
import Cookie from "js-cookie";


export default function HuaNocForm({ ticket_number, Exclusion_Reason, Huawei_Remarks, requested_hours }) {
    const [exclusionTime, setExclusionTime] = useState(parseFloat(requested_hours));
    const [status, setStatus] = useState(0);
    const [errorMessage, setErrorMessage] = useState('')
    const [remarks, setRemarks] = useState(Huawei_Remarks)
    const [loading, setLoading] = useState(true);
    const [errorResult, setErrorResult] = useState(false);
    const navigate = useNavigate();
    // const { data: session } = useSession();
    // const { session } = useAuth();
    const [exclusionReasons, setExclusionReasons] = useState([]);
    const [selectedExclusionReason, setSelectedExclusionReason] = useState(Exclusion_Reason);
    const session = Cookie.get("session");
    const storedSession = JSON.parse(session); 
    console.log(selectedExclusionReason);
    console.log(Exclusion_Reason);




    const submitTicket = async () => {
        if (storedSession) {

            if (exclusionTime > 0 && remarks !== '') {

                try {
                    const response = await axios.put(`${BASE_URL}/ticket/ticket-huawei-noc-handler`,
                        {
                            ticketId: ticket_number,
                            action: 'Accept',
                            user: storedSession.user.email
                        },
                        {
                            headers: {
                                'Authorization': `Bearer ${storedSession.Authorization}`,
                                'Content-Type': 'application/json'
                            }
                        });
                    console.log(response);
                    setStatus(200);
                } catch (error) {
                    if (error.response.status == 403) {
                        setErrorMessage("Not Authorized");
                        setErrorResult(true);
                        setLoading(false);
                    }
                    else if (error.response.status == 401) {
                        navigate("/");
                    } else {
                        setErrorMessage(error.response.data.message);
                        setErrorResult(true);
                        setLoading(false);
                    }
                }

                // let config = {
                //     method: 'put',
                //     maxBodyLength: Infinity,
                //     url: `${BASE_URL}/ticket/ticket-huawei-noc-handler`,
                //     headers: {
                //         'Authorization': `Bearer ${storedSession.Authorization}`,
                //         'Content-Type': 'application/json'
                //     },
                //     data: {
                //         ticketId: ticket_number,
                //         action: 'Accept',
                //         user: storedSession.user.email,
                //     }
                // };
                // axios.request(config)
                //     .then((response) => {
                //         console.log(JSON.stringify(response.data));
                //         setStatus(200);
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     });
            } else {
                setErrorMessage('Please add remarks and exclusion time.')
                setStatus(500)
            }
        }
    }

    const closeTicket = async () => {
        const res = await axios.put(`${BASE_URL}/ticket/close-ticket`,
            {
                ticketId: ticket_number,
                spm: selectedExclusionReason.includes('Spare Parts') ? true : false,
                user: storedSession.user.email,
            },
            {
                headers: {
                    Authorization: `Bearer ${storedSession.Authorization}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        setStatus(200);
    }


    useEffect(() => {

        if (storedSession) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${BASE_URL}/exclusion-reason/fetch-all`,
                        {
                            headers: {
                                Authorization: `Bearer ${storedSession.Authorization}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    const ERArray = response.data
                        .filter(item => item.region_noc === 'NOC')  // Filter items where region_noc is 'NOC'
                        .map(item => ({
                            id: item.id,
                            value: item.exclusion_reason,
                            label: `${item.exclusion_reason} (${item.region_noc})`,
                        }));

                    setExclusionReasons(ERArray); // Assuming data is an array
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        } else{
            navigate('/');
        }
    }, [])

    const handleChange = (event) => {
        setSelectedExclusionReason(event.target.value);
    };


    return (
        <div className='flex flex-col gap-y-5 '>
            {
                errorResult ?
                    <FlexDiv classes='mt-[12%]'>
                        <ErrorResult text={errorMessage} onClick={() => navigate('/dashboard')} />
                    </FlexDiv> :
                    <>
                        <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                            <span className='font-medium'>Mark Request as No exclusion Required</span>
                            <button onClick={closeTicket} className='bg-stc-red shadow-lg text-white py-2 px-3 rounded-md'>Close</button>
                        </FlexDiv>


                        <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                            <span className='font-medium'>Exclusion Time Requested</span>
                            <input defaultValue={exclusionTime} max={exclusionTime} min={1} onChange={(e) => setExclusionTime(parseFloat(e.target.value))} type='number' className='focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm ' />
                        </FlexDiv>

                        <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                            <span className='font-medium'>Exclusion Reason</span>
                            <select id="my-dropdown" value={selectedExclusionReason} onChange={handleChange} className='focus:outline-none border max-w-[260px] w-full border-slate-400 px-2 py-1 border-opacity-40 rounded-sm '>
                                <option value="">Select one</option>
                                {exclusionReasons.map((exclusionReason) => (
                                    <option key={exclusionReason.id} value={exclusionReason.value}>
                                        {exclusionReason.label}
                                    </option>
                                ))}
                            </select>
                        </FlexDiv>

                        <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                            <span className='font-medium'>Remarks</span>
                            <textarea onChange={(e) => setRemarks(e.target.value)} value={remarks} className='focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1' ></textarea>
                        </FlexDiv>
                        <FlexDiv justify='space-between' classes='border-b border-stc-black'>
                            <div>
                                <span className='font-medium'>Submit To STC Governance</span>
                            </div>
                            <button onClick={submitTicket} className='bg-stc-green shadow-lg text-white py-2 px-3 rounded-md'>Submit</button>
                        </FlexDiv>

                        {status === 200 && <SuccessModal heading='Success' body={'Response submitted successfully'} open={status === 200} close={() => window.location.href = '/dashboard#Home'} />}

                        {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}
                    </>
            }
        </div>
    )
}
