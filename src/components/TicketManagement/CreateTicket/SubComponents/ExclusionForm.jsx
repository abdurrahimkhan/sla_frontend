import React, { useEffect } from 'react'
import FlexDiv from '../../../Common/FlexDiv'
import InputContainer from '../../../Common/InputContainer'
import ErrorModal from '../../../Common/ErrorModal'
import Loader from '../../../Common/Loader'
import ErrorResult from '../../../Common/ErrorResult'
import axios from 'axios'
import SuccessResults from '../../../Common/SuccessResult'
import { CONTRACTOR } from '../../../../constants/constants'



export default function ExclusionForm() {
  const [exclusionReasonsList, setExclusionReasonsList] = React.useState([]);
  const [ticketNumber, setTicketNumber] = React.useState('')
  const [exclusionHours, setExclusionHours] = React.useState(null)
  const [restorationDuration, setRestorationDuration] = React.useState(0.0)
  const [contractorHubtime, setcontractorHubtime] = React.useState(0.0)
  const [exclusionReason, setExclusionReason] = React.useState('')
  const [exclusionRemarks, setExclusionRemarks] = React.useState('')
  const [error, setError] = React.useState(null)
  const [open, setOpen] = React.useState(false)
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorResult, setErrorResult] = React.useState(false);
  const [requestType, setRequestType] = React.useState('MTTR Request')


  const fetchExclusionReason = async () => {
    try {
      const res = await axios.get('/api/exclusion_reasons/fetch')
      console.log(res)
      setExclusionReasonsList(res.data)
    } catch (error) {

    }
  }

  useEffect(() => {
    fetchExclusionReason()
  }, [])

  const handleSubmission = async () => {
    
    if (ticketNumber === '' || exclusionHours === null || exclusionReason === '' || exclusionRemarks === '') {
      setError('Please fill all the fields.')
      setOpen(true)
      return
    }
    else if (ticketNumber.length < 13 || ticketNumber.startsWith('PR') === false) {
      setError('Invalid Ticket Number');
      setOpen(true)
      return;
    } else if (exclusionHours < 0) {
      setError('Exclusion Hours cannot be negative.')
      setOpen(true)
      return
    }
    else {
      setLoading(true)
      try {
        const res = await axios.post('/api/ticket/create', null, {
          params: {
            ticket_number: ticketNumber,
            exclusionHours: exclusionHours,
            exclusionReason: exclusionReason,
            exclusionRemarks: exclusionRemarks,
            restorationDuration: restorationDuration,
            contractorHubtime: contractorHubtime,
            requestType: requestType,
            createTicket: 'yes'
          }
        });
        console.log(res)
        setError(null)
        setLoading(false)
        setSuccess(true)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data)
          setErrorResult(true)
          setLoading(false)
        } else {
          setError('Something went wrong!')
          setErrorResult(true)
          setLoading(false)
        }

      } finally {
        setExclusionHours(null);
        setExclusionReason('');
        setExclusionRemarks('');
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
    <FlexDiv direction='column' alignment='start' classes='form-body p-14'>
      <span className='text-xl font font-semibold text-stc-purple'>
        Exclusion Request Form
      </span>

      {errorResult ?
        <FlexDiv classes='mt-20'>
          <ErrorResult text={error} onClick={() => setErrorResult(false)} />
        </FlexDiv>
        :
        success ?
          <FlexDiv classes='mt-20'>
            <SuccessResults text={'Ticket Created Successfully'} onClick={() => setSuccess(false)} />
          </FlexDiv>
          :
          <React.Fragment>
            <InputContainer label='Ticket Number' required={true}>
              <input
                onChange={(e) => setTicketNumber(e.target.value)}
                type='text' placeholder='PRXXXXXXXXXXX' className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
            </InputContainer>
            {/* <InputContainer label='Request Location' required={true}>
            <select onChange={(e) => setRequestLocation(e.target.value)} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' >
              <option value=''>Select Location</option>
              <option value={'MNOC'}>MNOC</option>
            </select>
          </InputContainer> */}


            <FlexDiv gapX={20}>

              <InputContainer label='Request Type' required={true}>
                <select onChange={(e) => setRequestType(e.target.value)} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' >
                  <option value="MTTR Request">MTTR Request</option>
                  <option value="PTL Request">PTL Request</option>
                </select>
              </InputContainer>

              <InputContainer label='Restoration Duration' required={true}>
                <input onChange={(e) => setRestorationDuration(parseFloat(e.target.value))} type='number' min={0} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
              </InputContainer>

              <InputContainer label={`${CONTRACTOR} Hubtime`} required={true}>
                <input onChange={(e) => setcontractorHubtime(parseFloat(e.target.value))} type='number' min={0} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
              </InputContainer>
            </FlexDiv>

            <FlexDiv gapX={20}>
              {/* <InputContainer label='SLA Type' required={true}>
              <select onChange={(e) => setSlaType(e.target.value)} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' >
                <option value=''>Select SLA Type</option>
                <option value={'Response Time (Pre-Ticket)'}>Response Time (Pre-Ticket)</option>
              </select>
            </InputContainer> */}
              <InputContainer label='Exclusion Reason' required={true}>
                <select onChange={(e) => setExclusionReason(e.target.value)} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' >
                  <option value=''>Select Exclusion Reason</option>
                  {exclusionReasonsList && exclusionReasonsList.map((reason, index) => (
                    <option key={index} value={reason.exclusion_reason}>{reason.exclusion_reason}</option>
                  ))}
                </select>
              </InputContainer>

              <InputContainer label='Exclusion Hours to Request' required={true}>
                <input onChange={(e) => setExclusionHours(parseInt(e.target.value))} type='number' min={0} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' />
              </InputContainer>
            </FlexDiv>





            <InputContainer label='Exclusion Remarks' required={true}>
              <textarea onChange={(e) => setExclusionRemarks(e.target.value)} className='w-full mt-2 focus:outline-none border border-stc-purple rounded-[4px] py-3 pl-4' >

              </textarea>
            </InputContainer>
            {
              error &&
              <ErrorModal open={open} heading='Error' body={error} close={() => setOpen(false)} />
            }



            <FlexDiv justify='end' classes='mt-5' gapX={20}>
              <button type='button' className='bg-stc-black text-white px-5 py-2 rounded-md'>
                Preview
              </button>
              <button
                onClick={handleSubmission}
                type='button' className='bg-stc-purple text-white px-5 py-2 rounded-md'>
                Submit without Preview
              </button>
            </FlexDiv>
          </React.Fragment>
      }
    </FlexDiv>
  )
}
