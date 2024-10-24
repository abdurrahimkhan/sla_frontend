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
  const [DomainList, setDomainList] = React.useState([]);
  const [DistrictList, setDistrictList] = React.useState([]);
  const [selectedDomain, setSelectedDomain] = React.useState([]);
  const [selectedDistrict, setSelectedDistrict] = React.useState([]);
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
  // const [parentUser, setParentUser] = React.useState(storedSession.user.email);
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

          // setPermissionsList(modifiedPermissionsList);
          setPermissionsList(response.data)
          setDomainList(response.data.filter(
            (item) => item.level === "Domain"
          ));
          setDistrictList(response.data.filter(
            (item) => item.level === "District"
          ));
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage('Could not fetch the permissions list');
          setErrorResult(true);
          setLoading(false);
        });
    } else {
      navigate('/')
    }
  }

  useEffect(() => {
    fetchPermissions()
  }, [])

  const handleSubmission = async () => {

    if (name === '' || mobileNumber === null || email === '' || permissionsList.length === 0 || rank === '') {
      setError('Please fill all the fields.')
      setOpen(true)
      return
    }
    else {
      setLoading(true);
      const allSelectedIds = [
        ...selectedDomain.map((item) => item.id),
        ...selectedDistrict.map((item) => item.id),
      ];

      // Convert the array of ids to a comma-separated string
      const selectedIdsString = allSelectedIds.join(',');
      console.log(selectedIdsString);


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
          mobileNumber: mobileNumber,
          parentUser: storedSession.user.email,
          permissionList: selectedIdsString,
          rank: rank,
          stc_employee: isSTC
        }
      };
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

  const handleSelect = (selectedList, type) => {
    const selectedIds = selectedList.map((item) => item.id);
    setSelectedPermissionsList((prev) => [...new Set([...prev, ...selectedIds])]);

    if (type === "Domain") {
      setSelectedDomain(selectedList);
    } else if (type === "District") {
      setSelectedDistrict(selectedList);
    }
  };

  // Handle removal of items
  const handleRemove = (remainingList, type) => {
    // Find the removed items by comparing previous state with remaining list
    const removedIds = type === "Domain"
      ? selectedDomain.filter((item) => !remainingList.some((r) => r.id === item.id)).map((item) => item.id)
      : selectedDistrict.filter((item) => !remainingList.some((r) => r.id === item.id)).map((item) => item.id);

    // Update the selected permissions list by removing the removed items' ids
    setSelectedPermissionsList((prev) =>
      prev.filter((id) => !removedIds.includes(id))
    );

    // Update the appropriate dropdown's selected values
    if (type === "Domain") {
      setSelectedDomain(remainingList);
    } else if (type === "District") {
      setSelectedDistrict(remainingList);
    }
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
                    type='text' disabled defaultValue={storedSession.user.email} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                </InputContainer>

              </FlexDiv>

              <FlexDiv gapX={20} justify='start' alignment='start'>
              <InputContainer label='Rank' required={true}>
                  <input
                    onChange={(e) => setRank(e.target.value)}
                    type='text' placeholder='Enter Rank' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                </InputContainer>
              <InputContainer label='STC Employee' required={true}>
                  <input
                    onChange={handleCheckboxChange}
                    type='checkbox' checked={isSTC} className="w-14 h-14 mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3" />
                </InputContainer>
               
              </FlexDiv>

              <FlexDiv gapX={20} alignment='start'>
                <InputContainer label="Domain List" required={true}>
                  {/* MultiSelect dropdown */}
                  <Multiselect
                    options={DomainList.map((item) => ({
                      id: item.id,
                      displayName: `${item.name} (${item.level})`,
                    }))}
                    onSelect={(selectedList) => handleSelect(selectedList, "Domain")}
                    onRemove={(remainingList) => handleRemove(remainingList, "Domain")}
                    displayValue="displayName" // Property name to display in the dropdown
                    placeholder="Select Domain"
                    className="mt-2 w-full focus:outline-none border border-stc-purple rounded-[4px] py-2 pl-4"
                    style={{
                      searchBox: {
                        border: 'none',
                        borderRadius: '4px',
                      },
                      multiselectContainer: {
                        width: '100%',
                      },
                      chips: {
                        background: '#4f008c',
                      },
                    }}
                  />
                </InputContainer>

                <InputContainer label="District List" required={true}>
                  <Multiselect
                    options={DistrictList.map((item) => ({
                      id: item.id,
                      displayName: `${item.name} (${item.level})`,
                    }))}
                    onSelect={(selectedList) => handleSelect(selectedList, "District")}
                    onRemove={(remainingList) => handleRemove(remainingList, "District")}
                    displayValue="displayName" // Property name to display in the dropdown
                    placeholder="Select District"
                    className="w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-2 pl-4"
                    style={{
                      searchBox: {
                        border: 'none',
                        borderRadius: '4px',
                        width: '100%',
                      },
                      multiselectContainer: {
                        width: '100%',
                      },
                      chips: {
                        background: '#4f008c',
                      },
                    }}
                  />
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
                  Submit
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