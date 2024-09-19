import React, { useEffect } from 'react'
import FlexDiv from '../Common/FlexDiv'
import InputContainer from '../Common/InputContainer'
import ErrorModal from '../Common/ErrorModal'
import Loader from '../Common/Loader'
import ErrorResult from '../Common/ErrorResult'
import axios from 'axios'
import SuccessResults from '../Common/SuccessResult'
import { BASE_URL, CONTRACTOR } from '../../constants/constants'
import { useNavigate } from 'react-router-dom';
import { Multiselect } from "multiselect-react-dropdown";
import SuccessModal from '../Common/SuccessModal'




export default function UserProfile() {
    const [permissionsList, setPermissionsList] = React.useState([]);
    const [selectedPermissionsList, setSelectedPermissionsList] = React.useState([]);
    const [DomainList, setDomainList] = React.useState([]);
    const [DistrictList, setDistrictList] = React.useState([]);
    const [selectedDomainIds, setSelectedDomainIds] = React.useState([]);
    const [selectedDistrictIds, setSelectedDistrictIds] = React.useState([]);
    const [status, setStatus] = React.useState(0);
    const [errorMessage, setErrorMessage] = React.useState('')

    const [name, setName] = React.useState('');
    const [rank, setRank] = React.useState('');
    const [mobileNumber, setMobileNumber] = React.useState('');
    const [isSTC, setIsSTC] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [error, setError] = React.useState(null)
    const [open, setOpen] = React.useState(false)
    const [success, setSuccess] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [errorResult, setErrorResult] = React.useState(false);
    const storedSession = JSON.parse(localStorage.getItem('session'));
    const [parentUser, setParentUser] = React.useState(storedSession.user.email);
    const navigate = useNavigate();



    const fetchPermissions = async () => {
        if (storedSession) {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${BASE_URL}/user-permissions/get-permissions-by-user-id?userID=${storedSession.user.id}`,
                headers: {
                    'Authorization': storedSession.Authorization,
                }
            };
            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));

                    const domainPermissions = response.data
                        .filter((perm) => perm.permission.level === 'Domain')
                        .map((perm) => ({
                            id: perm.permission.id,
                            displayName: `${perm.permission.name} (${perm.permission.level})`,
                        }));

                    const districtPermissions = response.data
                        .filter((perm) => perm.permission.level === 'District')
                        .map((perm) => ({
                            id: perm.permission.id,
                            displayName: `${perm.permission.name} (${perm.permission.level})`,
                        }));

                    setSelectedDomainIds(domainPermissions);
                    setSelectedDistrictIds(districtPermissions);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            navigate('/')
        }
    }

    useEffect(() => {
        fetchPermissions()
    }, [])



    if (loading) {
        return (
            <FlexDiv classes='w-full h-screen'>
                <Loader />
            </FlexDiv>
        )
    }
    return (
        <>
            <FlexDiv direction='column' alignment='start' classes='form-body p-14'>
                <span className='text-xl font font-semibold text-stc-purple'>
                    User Profile
                </span>

                {errorResult ?
                    <FlexDiv classes='mt-20'>
                        <ErrorResult text={error} onClick={() => setErrorResult(false)} />
                    </FlexDiv>
                    :
                    <React.Fragment>

                        <FlexDiv gapX={20}>
                            <InputContainer label='Name' >
                                <input
                                    disabled defaultValue={storedSession.user.name}
                                    type='text' placeholder='Enter Name' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                            </InputContainer>

                            <InputContainer label='Email' >
                                <input
                                    disabled defaultValue={storedSession.user.email}
                                    type='text' placeholder='Enter Email' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                            </InputContainer>

                        </FlexDiv>

                        <FlexDiv gapX={20}>
                            <InputContainer label='Mobile Number' >
                                <input
                                    disabled defaultValue={storedSession.user.mobileNumber}
                                    type='text' placeholder='Enter Mobile' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                            </InputContainer>

                            <InputContainer label='Parent User' >
                                <input
                                    type='text' disabled defaultValue={'hard coded'} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                            </InputContainer>

                        </FlexDiv>

                        <FlexDiv gapX={20}>
                            <InputContainer label="Domain List" >
                                {/* MultiSelect dropdown */}
                                <Multiselect 
                                    options={DomainList.map((item) => ({
                                        id: item.id,
                                        displayName: `${item.name} (${item.level})`,
                                    }))}
                                    selectedValues={selectedDomainIds}
                                    disable={true} 
                                    displayValue="displayName" // Property name to display in the dropdown
                                    // customDisplay={(permission) => `${permission.name} (${permission.level})`}
                                    placeholder="Select Domain"
                                    className="w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4"
                                    style={{
                                        searchBox: {
                                            padding: '12px',
                                            border: '1px solid #6b46c1',
                                            borderRadius: '4px',
                                            width: '100%',
                                        },
                                        multiselectContainer: {
                                            width: '100%',
                                        },
                                        chips: {
                                            background: '#6b46c1',
                                        },
                                    }}
                                />
                            </InputContainer>

                            <InputContainer label="District List" >
                                {/* MultiSelect dropdown */}
                                <Multiselect 
                                    options={DistrictList.map((item) => ({
                                        id: item.id,
                                        displayName: `${item.name} (${item.level})`,
                                    }))}
                                    selectedValues={selectedDistrictIds}
                                    displayValue="displayName" // Property name to display in the dropdown
                                    // customDisplay={(permission) => `${permission.name} (${permission.level})`}
                                    placeholder="Select District"
                                    disable={true} 
                                    className="w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4"
                                    style={{
                                        searchBox: {
                                            padding: '12px',
                                            border: '1px solid #6b46c1',
                                            borderRadius: '4px',
                                            width: '100%',
                                        },
                                        multiselectContainer: {
                                            width: '100%',
                                        },
                                        chips: {
                                            background: '#6b46c1',
                                        },
                                    }}
                                />
                            </InputContainer>
                        </FlexDiv>

                        <FlexDiv gapX={20}>
                            <InputContainer label='Rank' >
                                <input
                                    disabled defaultValue={parentUser}
                                    type='text' placeholder='Enter Rank' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                            </InputContainer>

                            <InputContainer label='STC Employee' >
                                <input disabled
                                    // onChange={handleCheckboxChange}
                                    type='checkbox' checked={storedSession.user.isSTC} className="w-10 mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3" />
                            </InputContainer>
                        </FlexDiv>

                        {
                            error &&
                            <ErrorModal open={open} heading='Error' body={error} close={() => setOpen(false)} />
                        }

                    </React.Fragment>
                }
            </FlexDiv>
        </>

    )
}