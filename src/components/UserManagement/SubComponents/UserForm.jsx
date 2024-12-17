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
import Cookie from "js-cookie";



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
  const session = Cookie.get("session");
    const storedSession = session ? JSON.parse(session) : null;
  // const [parentUser, setParentUser] = React.useState(storedSession.user.email);
  const navigate = useNavigate();



  const fetchPermissions = async () => {
    if (storedSession) {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/permissions/fetch-all`,
        headers: {
          'Authorization': `Bearer ${storedSession.Authorization}`,
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
    if(storedSession) {
      fetchPermissions();
    } else {
      navigate('/');
    }
    
  }, [])

  useEffect(() => {
    setIsSTC(rank === 'Regional' || rank === 'Governance');
  }, [rank]);

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

      try {
        const res = await axios.post(
          `${BASE_URL}/user-request/create`,
          {
            name: name,
            email: email,
            mobile_phone: mobileNumber,
            office_phone: mobileNumber,
            parent_user: storedSession.user.email,
            permissions: JSON.stringify(allSelectedIds),
            rank: rank,
            stc_employee: isSTC,
            requested_to: "admin@stc.com.sa"
          },
          {
            headers: {
              Authorization: 'Bearer ' + storedSession.Authorization,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(res);

        if (res.status == 200 || res.status == 201) {
          setStatus(200);
          setLoading(false);
          setName('');
          setMobileNumber('');
          setIsSTC(false);
        } else {
          setStatus(500);
          setLoading(false);
        }
      }
      catch (e) {
        setStatus(500);
        setLoading(false);
      }
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
                {/* <InputContainer label='Rank' required={true}>
                  <input
                    onChange={(e) => setRank(e.target.value)}
                    type='text' placeholder='Enter Rank' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
                </InputContainer> */}

                <InputContainer label='Rank' required={true}>
                  <select
                    onChange={(e) => setRank(e.target.value)}
                    className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4'
                    defaultValue=""
                  >
                    <option value="" disabled>Select Rank</option>
                    <option value="Department">Department</option>
                    <option value="Regional">Regional</option>
                    <option value="Governance">Governance</option>
                    <option value="SPOC">SPOC</option>
                  </select>
                </InputContainer>
                <InputContainer label='STC Employee' >
                  <input
                    onChange={handleCheckboxChange}
                    type='checkbox' disabled checked={isSTC} className="w-14 h-14 mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3" />
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
      {status === 200 && <SuccessModal heading='Success' body={'User Created successfully'} open={status === 200} close={() => setStatus(0)}/>}

      {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}
    </>

  )
}