import useAuth from '../Auth/useAuth';
import BaseLayout from '../components/BaseLayout/BaseLayout'
import CollapseComponent from '../components/Common/Collapse';
import Container from '../components/Common/Container';
import ErrorResult from '../components/Common/ErrorResult';
import FlexDiv from '../components/Common/FlexDiv';
import Loader from '../components/Common/Loader';
import ContractorInfo from '../components/TicketExclusion/ContractorInfo';
import StcNocForm from '../components/TicketExclusion/StcNocForm';
import StcNocInfo from '../components/TicketExclusion/StcNocInfo';
import StcRegionalInfo from '../components/TicketExclusion/StcRegionalInfo';
import StcRegionalForm from '../components/TicketExclusion/StcRegionalForm';
import TicketView from '../components/TicketManagement/TicketVIew/TicketView';
import { CONTRACTOR, BASE_URL } from '../constants/constants';
// import { UPDATE_PERMISSIONS } from '../lib/permissions';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import HuaDepartment from '../components/TicketExclusion/HuaDepartment';
import SpocValidationForm from '../components/TicketExclusion/SpocValidation';
import SpmValidation from '../components/TicketExclusion/SpmValidation';



export default function TicketPage() {
    const [activeTab, setActiveTab] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorResult, setErrorResult] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [data, setData] = useState(null)
    const [ticket, setTicket] = useState(null);
    // const { data: session } = useSession();
    const { session, signOut } = useAuth();
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const { pr_id } = useParams();



    useEffect(() => {
        if (activeTab !== '') {
            navigate(`/dashboard#${activeTab}`);
        }
    }, [activeTab]);

    useEffect(() => {
        searchTicket(pr_id)
    }, [])

    useEffect(() => {
        if (session) {
            setUser(session.user);
        }
    }, [session])


    const searchTicket = async (pr_id) => {
        setLoading(true);
        console.log(pr_id);
        const storedSession = JSON.parse(localStorage.getItem('session'));

        if (storedSession) {

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${BASE_URL}/ticket/fetch-tickets`,
                headers: {
                    'Authorization': storedSession.Authorization,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    prIDs: pr_id
                })
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    setTicket(response.data.data[0]);
                    const tempData = []

                    Object.entries(response.data.data[0]).forEach(([key, value]) => {
                        console.log(key, value);
                        key = key.replaceAll('Contractor', CONTRACTOR);
                        tempData.push({
                            description: key.replaceAll('_', ' '),
                            value: value
                        });
                    });
                    setData(tempData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                    if (error.response.status == 403) {
                        alert("Session expired, Kindly Login Again.");
                        signOut();
                    }
                    setErrorMessage(error.response.data)
                    setErrorResult(true)
                    setLoading(false)
                });

        } else {
            alert("No Session, Kindly Login.");
            navigate(`/`);
        }
    }


    if (loading || !user) {
        return (
            <FlexDiv classes='w-full h-screen'>
                <Loader />
            </FlexDiv>
        )
    }

    return (
        <BaseLayout activeTab={activeTab} setActiveTab={setActiveTab}>
            <Container definedClasses='w-full py-10 pl-40'>
                {errorResult ?
                    <FlexDiv classes='mt-[12%]'>
                        <ErrorResult text={errorMessage} onClick={() => navigate('/dashboard')} />
                    </FlexDiv> :
                    <FlexDiv gapX={20} alignment='start'>
                        <div className='w-[60%] bg-white h-[95vh] overflow-y-scroll'>
                            <TicketView data={data} />
                        </div>
                        <div className='w-[40%]  flex flex-col gap-y-10'>

                            {
                                ticket &&
                                    ticket?.Exclusion_Status === 'SPOC Validation' ?
                                    <CollapseComponent headerText='SPOC Validation'>
                                        <SpocValidationForm ticket_number={ticket?.PR_ID} Exclusion_Reason={ticket?.Exclusion_Reason} Huawei_Remarks={ticket?.Huawei_Remarks} requested_hours={ticket?.Exclusion_Time} />
                                    </CollapseComponent> : null
                            }

                            {
                                ticket &&
                                    ticket?.Exclusion_Status === 'SPM Validation' ?
                                    <CollapseComponent headerText='SPM Validation'>
                                        <SpmValidation ticket_number={ticket?.PR_ID} Exclusion_Reason={ticket?.Exclusion_Reason} Huawei_Remarks={ticket?.Huawei_Remarks} requested_hours={ticket?.Exclusion_Time} />
                                    </CollapseComponent> : null
                            }


                            <CollapseComponent headerText='STC Governance Acceptance Details'>

                                {ticket &&
                                    ticket?.Exclusion_Status === 'STC Governance' ?
                                    <StcNocForm ticket_number={ticket?.PR_ID} currentState={ticket?.Exclusion_Status} requested_hours={ticket?.STC_Regional_Accepted_Time} /> :
                                    !ticket?.STC_NOC_Handler ?
                                        'Request is not handled by STC Governance yet' :
                                        <StcNocInfo
                                            accepted={ticket?.STC_Gov_Acceptance}
                                            approved_excluded_time={ticket?.Exclusion_Time_Agreed}
                                            approved_rejected_by={ticket?.STC_NOC_Handler}
                                            remarks={ticket?.STC_Remarks_Gov} />
                                }

                            </CollapseComponent>


                            <CollapseComponent headerText='STC Regional Acceptance Details'>
                                {
                                    ticket &&
                                        ticket?.Exclusion_Status === 'STC Regional' ?
                                        <StcRegionalForm ticket_number={ticket?.PR_ID} initialRejection={ticket?.Regional_Initial_Rejection} currentState={ticket?.Exclusion_Status} requested_hours={ticket?.Exclusion_Time} /> :
                                        !ticket?.STC_Region_Handler ?
                                            'Request was not handled by STC Regional' :
                                            <StcRegionalInfo
                                                accepted={ticket?.STC_Regional_Final_Acceptance}
                                                initial_rejection={ticket?.Regional_Initial_Rejection ? 'Yes' : 'No'}
                                                approved_excluded_time={ticket?.STC_Regional_Accepted_Time}
                                                approved_rejected_by={ticket?.STC_Region_Handler}
                                                remarks={ticket?.STC_Remarks}
                                            />
                                }
                            </CollapseComponent>

                            {
                                ticket?.Exclusion_Status === 'Hua Department' ?
                                    <CollapseComponent headerText='Huawei MC Acceptance Details'>
                                        {
                                            ticket ?
                                                ticket?.Exclusion_Status === 'Hua Department' ?
                                                    <HuaDepartment ticket_number={ticket?.PR_ID} initialRejection={ticket?.Regional_Initial_Rejection} currentState={ticket?.Exclusion_Status} requested_hours={ticket?.Exclusion_Time_Requested} />
                                                    : <ContractorInfo
                                                        ticket_number={ticket?.PR_ID}
                                                        restoration_duration={ticket?.Restoration_Duration}
                                                        request_type={ticket?.Request_Type}
                                                        requested_time={ticket?.Exclusion_Time}
                                                        exclusion_reason={ticket?.Exclusion_Reason}
                                                        exclusion_remarks={ticket?.Huawei_Remarks}
                                                        exclusion_status={ticket?.Exclusion_Status}
                                                    />
                                                : 'Request was not handled by MC'
                                        }
                                    </CollapseComponent> : null
                            }


                            <CollapseComponent headerText={`${CONTRACTOR} Exclusion Request Details`}>

                                <ContractorInfo
                                    ticket_number={ticket?.PR_ID}
                                    restoration_duration={ticket?.Restoration_Duration}
                                    request_type={ticket?.SLA_Type}
                                    requested_time={ticket?.Exclusion_Time}
                                    exclusion_reason={ticket?.Exclusion_Reason}
                                    exclusion_remarks={ticket?.Huawei_Remarks}
                                    exclusion_status={ticket?.Exclusion_Status}
                                />

                            </CollapseComponent>
                        </div>
                    </FlexDiv>
                }
            </Container>
        </BaseLayout>
    )
}
