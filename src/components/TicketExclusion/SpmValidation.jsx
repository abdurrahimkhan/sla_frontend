import React, { useContext, useState, useEffect } from 'react'
import FlexDiv from '../Common/FlexDiv'
// import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '../Common/ErrorModal';
import SuccessModal from '../Common/SuccessModal';
import useAuth from '../../Auth/useAuth';
import { BASE_URL } from '../../constants/constants';
import ErrorResult from '../Common/ErrorResult';


export default function SpmValidation({ ticket_number, Exclusion_Reason, requested_hours }) {
  const [exclusionTime, setExclusionTime] = useState(parseFloat(requested_hours));
  const [status, setStatus] = useState(0);
  const [errorMessage, setErrorMessage] = useState('')
  const [remarks, setRemarks] = useState('')
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [errorResult, setErrorResult] = useState(false);
  const [exclusionReasons, setExclusionReasons] = useState([]);
  const [selectedExclusionReason, setSelectedExclusionReason] = useState(Exclusion_Reason);
  const storedSession = JSON.parse(localStorage.getItem('session'));
  const navigate = useNavigate();


  const submitTicket = async () => {
    if (storedSession) {
      if (exclusionTime > 0 && remarks !== '') {
        let config = {
          method: 'put',
          maxBodyLength: Infinity,
          url: `${BASE_URL}/ticket/ticket-spare-parts-validation-submit`,
          headers: {
            'Authorization': storedSession.Authorization,
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            ticketId: ticket_number,
            exclusionReason: selectedExclusionReason,
            exclusionTime: exclusionTime,
            huaweiRemarks: remarks,
            user: storedSession.user.email,
          })
        };

        axios.request(config)
          .then((response) => {
            console.log(response);
            setStatus(200);
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
        setErrorMessage('Please add remarks and exclusion time.')
        setStatus(500)
      }
    }
  }

  const returnTicket = async () => {
    if (storedSession) {
      let config = {
        method: 'put',
        maxBodyLength: Infinity,
        url: `${BASE_URL}/ticket/ticket-spare-parts-validation-return`,
        headers: {
          'Authorization': storedSession.Authorization,
          'Content-Type': 'application/json'
        },
        data: {
          ticketId: ticket_number,
          spm: true,
          user: storedSession.user.email,
        }
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          setStatus(200);
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
    }
  }

  useEffect(() => {

    if (storedSession) {
      const fetchData = async () => {
        try {
          // const response = await axios.get(`${BASE_URL}/ticket/get-exclusion-reasons`,
          //   {
          //     headers: {
          //       Authorization: storedSession.Authorization,
          //       'Content-Type': 'application/json'
          //     }
          //   }
          // );

          const response = {
            1: "Accessibility - Limited Business Hours (Region)",
            2: "Accessibility - Pre-Access Permit Required(Region)",
            3: "Spare Parts - Limited stock (Region)",
            4: "Planned Activities - Within Approved window (NOC)",
            5: "Main AC Power Loss - SEC Blackout (NOC)",
            6: "Fault Beyond MSP Scope Responsibility - External Operation Organization(NOC)"
          }


          const ERArray = Object.entries(response).map(([key, value]) => ({
            id: key,
            label: value,
          }));
          setExclusionReasons(ERArray); // Assuming data is an array
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
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
              <div>
                <span className='font-medium'>Return to Requester</span>
              </div>
              <button onClick={returnTicket} className='bg-stc-green shadow-lg text-white py-2 px-3 rounded-md'>Submit</button>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
              <span className='font-medium'>Exclusion Time Requested</span>
              <input defaultValue={exclusionTime} max={exclusionTime} min={1} onChange={(e) => setExclusionTime(parseFloat(e.target.value))} type='number' className='focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm ' />
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
              <span className='font-medium'>Exclusion Reason</span>
              <select id="my-dropdown" value={selectedExclusionReason} onChange={handleChange} className='focus:outline-none border border-slate-400 px-2 py-1 border-opacity-40 rounded-sm '>
                <option value="" disabled>Select one</option>
                {exclusionReasons.map((exclusionReason) => (
                  <option key={exclusionReason.id} value={exclusionReason.value}>
                    {exclusionReason.label}
                  </option>
                ))}
              </select>
            </FlexDiv>


            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
              <span className='font-medium'>Remarks</span>
              <textarea onChange={(e) => setRemarks(e.target.value)} className='focus:outline-none border border-slate-400 rounded-sm h-24 w-3/4 px-2 py-1' ></textarea>
            </FlexDiv>

            <FlexDiv justify='space-between' classes='border-b border-stc-black'>
              <div>
                <span className='font-medium'>Submit</span>
              </div>
              <button onClick={submitTicket} className='bg-stc-green shadow-lg text-white py-2 px-3 rounded-md'>Submit</button>
            </FlexDiv>

            {status === 200 && <SuccessModal heading='Success' body={'TT submitted successfully'} open={status === 200} close={() => window.location.href = '/dashboard'} />}

            {status === 500 && <ErrorModal heading='Something went wrong!' body={errorMessage} open={status === 500} close={() => setStatus(0)} />}
          </>
      }
    </div>
  )
}
