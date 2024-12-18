import BaseLayout from '../components/BaseLayout/BaseLayout'
import CollapseComponent from '../components/Common/Collapse';
import Container from '../components/Common/Container';
import ErrorResult from '../components/Common/ErrorResult';
import FlexDiv from '../components/Common/FlexDiv';
import Loader from '../components/Common/Loader';
import ContractorInfo from '../components/TicketExclusion/ContractorInfo';
import StcNocInfo from '../components/TicketExclusion/StcNocInfo';
import StcRegionalInfo from '../components/TicketExclusion/StcRegionalInfo';
import StcRegionalForm from '../components/TicketExclusion/StcRegionalForm';
import TicketView from '../components/TicketManagement/TicketVIew/TicketView';
import { CONTRACTOR, BASE_URL } from '../constants/constants';
// import { UPDATE_PERMISSIONS } from '../lib/permissions';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Cookie from "js-cookie";


export default function ViewTicket() {
    const [activeTab, setActiveTab] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorResult, setErrorResult] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [data, setData] = useState(null)
    const [ticket, setTicket] = useState(null);
    const navigate = useNavigate();
    const { pr_id } = useParams();
    const session = Cookie.get("session");
    const storedSession = session ? JSON.parse(session) : null;



    useEffect(() => {
        if (activeTab !== '') {
            navigate(`/dashboard#${activeTab}`);
        }
    }, [activeTab]);

    useEffect(() => {
        console.log(storedSession)
        if (storedSession) {
            console.log("true")
            searchTicket(pr_id);
        } else {
            navigate('/');
        }
    }, [])




    const searchTicket = async (pr_id) => {
        setLoading(true);
        console.log(pr_id);

        try {
            const response = await axios.get(`${BASE_URL}/view/get-filtered-data-from-view`, {
                params: {
                    view_name: 'Tickets_Full_View',
                    columns: 'PR_ID',
                    values: pr_id,
                    expression: '='
                },
                headers: {
                    Authorization: `Bearer ${storedSession.Authorization}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            console.log(response.data.data[0]);
            const tempData = []
            Object.entries(response.data.data[0]).forEach(([key, value]) => {
                console.log(key, value);
                // key = key.replaceAll('Contractor', CONTRACTOR);
                tempData.push({
                    description: key.replaceAll('_', ' '),
                    value: value
                });
            });
            setData(tempData);
            setTicket(response.data.data[0]);
            setLoading(false);
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
    }


    if (loading) {
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

                            <CollapseComponent headerText='STC Governance Acceptance Details'>

                                {!ticket?.STC_NOC_Handler ?
                                    'Request is not handled by STC Governance yet' :
                                    <StcNocInfo
                                        accepted={ticket?.Exclude_STC}
                                        approved_excluded_time={ticket?.Exclusion_Time_Agreed}
                                        approved_rejected_by={ticket?.STC_NOC_Handler}
                                        remarks={ticket?.STC_Remarks_Gov} />
                                }

                            </CollapseComponent>


                            <CollapseComponent headerText='STC Regional Acceptance Details'>
                                {
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

                            <CollapseComponent headerText={`${CONTRACTOR} Exclusion Request Details`}>

                                <ContractorInfo
                                    ticket_number={ticket?.PR_ID}
                                    restoration_duration={ticket?.Restoration_Duration}
                                    request_type={ticket?.sla_category}
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
