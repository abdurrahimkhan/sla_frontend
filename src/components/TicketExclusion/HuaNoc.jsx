import React, { useState, useEffect } from 'react';
import FlexDiv from '../Common/FlexDiv';
import axios from 'axios';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';
import { BASE_URL } from '../../constants/constants';
import { useNavigate } from 'react-router-dom';
import ErrorResult from '../Common/ErrorResult';
import Cookie from 'js-cookie';

export default function HuaNocForm({ ticket_number, Exclusion_Reason, Huawei_Remarks, requested_hours }) {
    const [exclusionTime, setExclusionTime] = useState(parseFloat(requested_hours));
    const [remarks, setRemarks] = useState(Huawei_Remarks);
    const [exclusionReasons, setExclusionReasons] = useState([]);
    const [selectedExclusionReason, setSelectedExclusionReason] = useState(Exclusion_Reason);
    const [errorMessage, setErrorMessage] = useState('');
    const [status, setStatus] = useState(null); // Status is null by default
    const [errorResult, setErrorResult] = useState(false);

    const navigate = useNavigate();
    const session = Cookie.get('session');
    const storedSession = session ? JSON.parse(session) : null;

    useEffect(() => {
        if (!storedSession) {
            navigate('/');
            return;
        }

        const fetchExclusionReasons = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/exclusion-reason/fetch-all`, {
                    headers: {
                        Authorization: `Bearer ${storedSession.Authorization}`,
                        'Content-Type': 'application/json',
                    },
                });

                const filteredExclusionReasons = response.data
                    .filter(item => item.region_noc === 'NOC')
                    .map(item => ({
                        id: item.id,
                        value: item.exclusion_reason,
                        label: `${item.exclusion_reason} (${item.region_noc})`,
                    }));

                setExclusionReasons(filteredExclusionReasons);
            } catch (error) {
                console.error('Error fetching exclusion reasons:', error);
                setErrorMessage('Error fetching exclusion reasons.');
                setErrorResult(true);
            }
        };

        fetchExclusionReasons();
    }, [storedSession, navigate]);

    const handleExclusionTimeChange = (e) => {
        setExclusionTime(parseFloat(e.target.value));
    };

    const handleExclusionReasonChange = (e) => {
        setSelectedExclusionReason(e.target.value);
    };

    const handleRemarksChange = (e) => {
        setRemarks(e.target.value);
    };

    const handleSubmit = async () => {
        if (!storedSession) return;

        if (exclusionTime <= 0 || !remarks) {
            setErrorMessage('Please add remarks and exclusion time.');
            setStatus(500);
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/ticket/ticket-huawei-noc-handler`, {
                ticketId: ticket_number,
                action: 'Accept',
                user: storedSession.user.email,
            }, {
                headers: {
                    Authorization: `Bearer ${storedSession.Authorization}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log(response);
            setStatus(200);
        } catch (error) {
            handleError(error);
        }
    };

    const handleCloseTicket = async () => {
        try {
            const response = await axios.put(`${BASE_URL}/ticket/close-ticket`, {
                ticketId: ticket_number,
                spm: selectedExclusionReason.includes('Spare Parts'),
                user: storedSession.user.email,
            }, {
                headers: {
                    Authorization: `Bearer ${storedSession.Authorization}`,
                    'Content-Type': 'application/json',
                },
            });
            setStatus(200);
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error) => {
        if (error.response) {
            if (error.response.status === 403) {
                setErrorMessage('Not Authorized');
            } else if (error.response.status === 401) {
                navigate('/');
            } else {
                setErrorMessage(error.response.data.message || 'Something went wrong');
            }
        } else {
            setErrorMessage('Network error. Please try again later.');
        }
        setErrorResult(true);
    };

    return (
        <div className="flex flex-col gap-y-5">
            {errorResult && (
                <FlexDiv classes="mt-[12%]">
                    <ErrorResult text={errorMessage} onClick={() => navigate('/dashboard')} />
                </FlexDiv>
            )}

            <FlexDiv justify="space-between" classes="border-b border-stc-black">
                <span className="font-medium">Mark Request as No Exclusion Required</span>
                <button onClick={handleCloseTicket} className="bg-stc-red shadow-lg text-white py-2 px-3 rounded-md">
                    Close
                </button>
            </FlexDiv>

            <FlexDiv justify="space-between" classes="border-b border-stc-black">
                <span className="font-medium">Exclusion Time Requested</span>
                <input
                    type="number"
                    min={1}
                    value={exclusionTime}
                    onChange={handleExclusionTimeChange}
                    className="focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm"
                />
            </FlexDiv>

            <FlexDiv justify="space-between" classes="border-b border-stc-black">
                <span className="font-medium">Exclusion Reason</span>
                <select
                    value={selectedExclusionReason}
                    onChange={handleExclusionReasonChange}
                    className="focus:outline-none border max-w-[260px] w-full border-slate-400 px-2 py-1 border-opacity-40 rounded-sm"
                >
                    <option value="">Select one</option>
                    {exclusionReasons.map((reason) => (
                        <option key={reason.id} value={reason.value}>
                            {reason.label}
                        </option>
                    ))}
                </select>
            </FlexDiv>

            <FlexDiv justify="space-between" classes="border-b border-stc-black">
                <span className="font-medium">Remarks</span>
                <textarea
                    value={remarks}
                    onChange={handleRemarksChange}
                    className="focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1"
                ></textarea>
            </FlexDiv>

            <FlexDiv justify="space-between" classes="border-b border-stc-black">
                <div>
                    <span className="font-medium">Submit To STC Governance</span>
                </div>
                <button onClick={handleSubmit} className="bg-stc-green shadow-lg text-white py-2 px-3 rounded-md">
                    Submit
                </button>
            </FlexDiv>

            {status === 200 && (
                <SuccessModal
                    heading="Success"
                    body="Response submitted successfully"
                    open={status === 200}
                    close={() => navigate('/dashboard#Home')}
                />
            )}

            {status === 500 && (
                <ErrorModal
                    heading="Something went wrong!"
                    body={errorMessage}
                    open={status === 500}
                    close={() => setStatus(null)}
                />
            )}
        </div>
    );
}
