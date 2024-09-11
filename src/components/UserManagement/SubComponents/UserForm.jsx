import React, { useEffect } from 'react'
import FlexDiv from '../../Common/FlexDiv'
import InputContainer from '../../Common/InputContainer'
import ErrorModal from '../../Common/ErrorModal'
import Loader from '../../Common/Loader'
import ErrorResult from '../../Common/ErrorResult'
import axios from 'axios'
import SuccessResults from '../../Common/SuccessResult'
import { BASE_URL, CONTRACTOR } from '../../../constants/constants'
import { useNavigate } from 'react-router-dom';
import { Multiselect } from "multiselect-react-dropdown";
import SuccessModal from '../../Common/SuccessModal'




export default function UserForm() {
  const [permissionsList, setPermissionsList] = React.useState([]);
  const [selectedPermissionsList, setSelectedPermissionsList] = React.useState([]);
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
        url: `${BASE_URL}/permissions/fetch-all`,
        headers: {
          'Authorization': storedSession.Authorization,
        }
      };
      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          const modifiedPermissionsList = response.data.map((item) => ({
            id: item.id,
            displayName: `${item.name} (${item.level})`, // Concatenate name and level
          }));

          setPermissionsList(modifiedPermissionsList);
          // setPermissionsList(response.data)
          // setStatus(200);
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
    console.log(permissionsList);

  }, [])

  const handleSubmission = async () => {

    if (name === '' || mobileNumber === null || email === '' || permissionsList.length == 0 || rank === '') {
      setError('Please fill all the fields.')
      setOpen(true)
      return
    }
    else {
      setLoading(true);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/user-request/create`,
        headers: {
          'Authorization': storedSession.Authorization,
          'Content-Type': 'application/json'
        },
        data: {
          name: name,
          email: email,
          mobileNumber : mobileNumber,
          parentUser : parentUser,
          permissionList: selectedPermissionsList,
          rank: rank,
          stc_employee: isSTC
        }
      };

      console.log("checking sending data");
      
      console.log(config.data);
      
      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response));
          setStatus(response.status);
        })
        .catch((error) => {
          console.log(error);
          if (axios.isAxiosError(error)) {
            setErrorMessage(error.response?.data)
            setErrorResult(true)
            setLoading(false)
          } else {
            setErrorMessage('Something went wrong!')
            setErrorResult(true)
            setLoading(false)
          }
        })
        .finally(() => {
          setLoading(false);
          setName('');
          setMobileNumber('');
          setIsSTC(false);
        });
    }
  }

  const handleSelect = (selectedList) => {
    const selectedIds = selectedList.map((item) => item.id); // Extract only the ids
    setSelectedPermissionsList(selectedIds); // Store only the ids in the state
  };

  const handleRemove = (selectedList) => {
    const selectedIds = selectedList.map((item) => item.id); // Extract only the ids
    setSelectedPermissionsList(selectedIds); // Store the updated list of ids
  };

  const handleCheckboxChange = (e) => {
    setIsSTC(e.target.checked); // Set the value to true when checked, false when unchecked
  };


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
          User Detail Form
        </span>

        {errorResult ?
          <FlexDiv classes='mt-20'>
            <ErrorResult text={error} onClick={() => setErrorResult(false)} />
          </FlexDiv>
          :
          success ?
            <FlexDiv classes='mt-20'>
              <SuccessResults text={'User Created Successfully'} onClick={() => setSuccess(false)} />
            </FlexDiv>
            :
            <React.Fragment>

              <FlexDiv gapX={20}>
                <InputContainer label='Name' required={true}>
                  <input
                    onChange={(e) => setName(e.target.value)}
                    type='text' placeholder='Enter Name' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                </InputContainer>

                <InputContainer label='Email' required={true}>
                  <input
                    onChange={(e) => setEmail(e.target.value)}
                    type='text' placeholder='Enter Email' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                </InputContainer>

              </FlexDiv>

              <FlexDiv gapX={20}>
                <InputContainer label='Mobile Number' required={true}>
                  <input
                    onChange={(e) => setMobileNumber(e.target.value)}
                    type='text' placeholder='Enter Mobile' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                </InputContainer>

                <InputContainer label='Parent User' required={true}>
                  <input
                    type='text' disabled defaultValue={parentUser} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                </InputContainer>

              </FlexDiv>


              <FlexDiv>
                <InputContainer label="Permission List" required={true}>
                  {/* MultiSelect dropdown */}
                  <Multiselect style={'w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4'}
                    options={permissionsList} // Options to display in the dropdown
                    selectedValues={permissionsList.filter((permission) =>
                      selectedPermissionsList.includes(permission.id))} // Preselected values by matching ids
                    onSelect={handleSelect} // Function to handle selected values
                    onRemove={handleRemove} // Function to handle removed values
                    displayValue="displayName" // Property name to display in the dropdown
                    // customDisplay={(permission) => `${permission.name} (${permission.level})`}
                    placeholder="Select Permissions"
                  />
                </InputContainer>
              </FlexDiv>

              <FlexDiv gapX={20}>
                <InputContainer label='Rank' required={true}>
                  <input
                    onChange={(e) => setRank(e.target.value)}
                    type='text' placeholder='Enter Rank' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                </InputContainer>

                <InputContainer label='STC Employee' required={true}>
                  <input
                    onChange={handleCheckboxChange}
                    type='checkbox' checked={isSTC} className="w-10 mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3"/>
                </InputContainer>
              </FlexDiv>

              {
                error &&
                <ErrorModal open={open} heading='Error' body={error} close={() => setOpen(false)} />
              }


              <FlexDiv justify='end' classes='mt-5' gapX={20}>
                {/* <button type='button' className='bg-stc-black text-white px-5 py-2 rounded-md'>
                Preview
              </button> */}
                <button
                  onClick={handleSubmission}
                  type='button' className='bg-stc-purple text-white px-5 py-2 rounded-md'>
                  Submit without Preview
                </button>
              </FlexDiv>
            </React.Fragment>
        }
      </FlexDiv>
      {status === 200 && <SuccessModal heading='Success' body={'User Created successfully'} open={status === 200} close={() => window.location.href = '/dashboard#Home'} />}

      {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}
    </>

  )
}
