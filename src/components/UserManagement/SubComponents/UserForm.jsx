import React, { useEffect, useState } from 'react';
import FlexDiv from '../../Common/FlexDiv';
import InputContainer from '../../Common/InputContainer';
import ErrorModal from '../../Common/ErrorModal';
import Loader from '../../Common/Loader';
import ErrorResult from '../../Common/ErrorResult';
import axios from 'axios';
import SuccessResults from '../../Common/SuccessResult';
import { BASE_URL, CONTRACTOR } from '../../../constants/constants';
import { useNavigate } from 'react-router-dom';
import { Multiselect } from 'multiselect-react-dropdown';
import SuccessModal from '../../Common/SuccessModal';
import Cookie from 'js-cookie';

export default function UserForm() {
  const [permissionsList, setPermissionsList] = useState([]);
  const [selectedPermissionsList, setSelectedPermissionsList] = useState([]);
  const [DomainList, setDomainList] = useState([]);
  const [DistrictList, setDistrictList] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState([]);
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const [name, setName] = useState('');
  const [rank, setRank] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [isSTC, setIsSTC] = useState(false);
  const [email, setEmail] = useState('');
  const [formError, setFormError] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const session = Cookie.get('session');
  const storedSession = session ? JSON.parse(session) : null;
  const navigate = useNavigate();

  const fetchPermissions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/permissions/fetch-all`, {
        headers: {
          Authorization: `Bearer ${storedSession.Authorization}`,
        },
      });
      setPermissionsList(response.data);
      setDomainList(response.data.filter(item => item.level === 'Domain'));
      setDistrictList(response.data.filter(item => item.level === 'District'));
    } catch (error) {
      const message = error.response?.data?.message || 'Could not fetch the permissions list';
      if (error.response.status === 403) {
        setErrorMessage('Not Authorized');
      } else if (error.response.status === 401) {
        navigate('/');
      } else {
        setErrorMessage(message);
      }
    }
  };

  useEffect(() => {
    if (storedSession) {
      fetchPermissions();
    } else {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    setIsSTC(rank === 'Regional' || rank === 'Governance');
  }, [rank]);

  const handleSubmission = async () => {
    if (!name || !mobileNumber || !email || !permissionsList.length || !rank) {
      setFormError('Please fill all the fields.');
      setOpenErrorModal(true);
      return;
    }

    setLoading(true);
    const allSelectedIds = [
      ...selectedDomain.map(item => item.id),
      ...selectedDistrict.map(item => item.id),
    ];

    const selectedIdsString = allSelectedIds.join(',');

    try {
      const res = await axios.post(
        `${BASE_URL}/user-request/create`,
        {
          name,
          email,
          mobile_phone: mobileNumber,
          office_phone: mobileNumber,
          parent_user: storedSession.user.email,
          permissions: JSON.stringify(allSelectedIds),
          rank,
          stc_employee: isSTC,
          requested_to: 'admin@stc.com.sa',
        },
        {
          headers: {
            Authorization: `Bearer ${storedSession.Authorization}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        setStatus(200);
        setSuccess(true);
        setLoading(false);
        setName('');
        setMobileNumber('');
        setIsSTC(false);
        setRank('');
        setEmail('');
      } else {
        setStatus(500);
        setErrorMessage(res.data.message || 'Could not process your request');
        setLoading(false);
      }
    } catch (e) {
      setStatus(500);
      setErrorMessage(e.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  const handleSelect = (selectedList, type) => {
    const selectedIds = selectedList.map(item => item.id);
    setSelectedPermissionsList(prev => [...new Set([...prev, ...selectedIds])]);

    if (type === 'Domain') {
      setSelectedDomain(selectedList);
    } else if (type === 'District') {
      setSelectedDistrict(selectedList);
    }
  };

  const handleRemove = (remainingList, type) => {
    const removedIds = type === 'Domain'
      ? selectedDomain.filter(item => !remainingList.some(r => r.id === item.id)).map(item => item.id)
      : selectedDistrict.filter(item => !remainingList.some(r => r.id === item.id)).map(item => item.id);

    setSelectedPermissionsList(prev => prev.filter(id => !removedIds.includes(id)));

    if (type === 'Domain') {
      setSelectedDomain(remainingList);
    } else if (type === 'District') {
      setSelectedDistrict(remainingList);
    }
  };

  const handleCheckboxChange = (e) => {
    setIsSTC(e.target.checked);
  };

  if (loading) {
    return (
      <FlexDiv classes="w-full h-screen">
        <Loader />
      </FlexDiv>
    );
  }

  return (
    <>
      <FlexDiv direction="column" alignment="start" classes="form-body p-14">
        <span className="text-xl font-semibold text-stc-purple">User Detail Form</span>

        {formError && (
          <FlexDiv classes="mt-20">
            <ErrorResult text={formError} onClick={() => setOpenErrorModal(false)} />
          </FlexDiv>
        )}

        {success && (
          <FlexDiv classes="mt-20">
            <SuccessResults text="User Created Successfully" onClick={() => setSuccess(false)} />
          </FlexDiv>
        )}

        {!success && (
          <>
            <FlexDiv gapX={20}>
              <InputContainer label="Name" required>
                <input
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Enter Name"
                  className="w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4"
                />
              </InputContainer>

              <InputContainer label="Email" required>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  type="text"
                  placeholder="Enter Email"
                  className="w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4"
                />
              </InputContainer>
            </FlexDiv>

            <FlexDiv gapX={20}>
              <InputContainer label="Mobile Number" required>
                <input
                  onChange={(e) => setMobileNumber(e.target.value)}
                  type="text"
                  placeholder="Enter Mobile"
                  className="w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4"
                />
              </InputContainer>

              <InputContainer label="Parent User" required>
                <input
                  type="text"
                  disabled
                  defaultValue={storedSession.user.email}
                  className="w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4"
                />
              </InputContainer>
            </FlexDiv>

            <FlexDiv gapX={20} justify="start" alignment="start">
              <InputContainer label="Rank" required>
                <select
                  onChange={(e) => setRank(e.target.value)}
                  className="w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Rank
                  </option>
                  <option value="Department">Department</option>
                  <option value="Regional">Regional</option>
                  <option value="Governance">Governance</option>
                  <option value="SPOC">SPOC</option>
                </select>
              </InputContainer>

              <InputContainer label="STC Employee">
                <input
                  onChange={handleCheckboxChange}
                  type="checkbox"
                  disabled
                  checked={isSTC}
                  className="w-14 h-14 mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3"
                />
              </InputContainer>
            </FlexDiv>

            <FlexDiv gapX={20} alignment="start">
              <InputContainer label="Domain List" required>
                <Multiselect
                  options={DomainList.map((item) => ({
                    id: item.id,
                    displayName: `${item.name} (${item.level})`,
                  }))}
                  onSelect={(selectedList) => handleSelect(selectedList, 'Domain')}
                  onRemove={(remainingList) => handleRemove(remainingList, 'Domain')}
                  displayValue="displayName"
                  placeholder="Select Domain"
                  className="mt-2 w-full focus:outline-none border border-stc-purple rounded-[4px] py-2 pl-4"
                />
              </InputContainer>

              <InputContainer label="District List" required>
                <Multiselect
                  options={DistrictList.map((item) => ({
                    id: item.id,
                    displayName: `${item.name} (${item.level})`,
                  }))}
                  onSelect={(selectedList) => handleSelect(selectedList, 'District')}
                  onRemove={(remainingList) => handleRemove(remainingList, 'District')}
                  displayValue="displayName"
                  placeholder="Select District"
                  className="w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-2 pl-4"
                />
              </InputContainer>
            </FlexDiv>

            <ErrorModal open={openErrorModal} heading="Error" body={formError} close={() => setOpenErrorModal(false)} />

            <FlexDiv justify="end" classes="mt-5" gapX={20}>
              <button onClick={handleSubmission} type="button" className="bg-stc-purple text-white px-5 py-2 rounded-md">
                Submit
              </button>
            </FlexDiv>
          </>
        )}
      </FlexDiv>

      {status === 200 && <SuccessModal heading="Success" body="User Created successfully" open={status === 200} close={() => setStatus(0)} />}
      {status === 500 && <ErrorModal heading="Something went wrong!" body={errorMessage} open={status === 500} close={() => setStatus(0)} />}
    </>
  );
}
