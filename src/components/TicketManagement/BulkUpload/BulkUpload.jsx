import React, { useRef, useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';
import FlexDiv from '../../Common/FlexDiv';
import Loader from '../../Common/Loader';
import { UPDATE_PERMISSIONS } from '../../../lib/permissions';
import ErrorResult from '../../Common/ErrorResult';
// import { useSession } from 'next-auth/react';
import useAuth from '../../../auth/useAuth';




const BulkUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(true);
  // const { data: session } = useSession();
  const { session } = useAuth();
  const [user, setUser] = React.useState(null);


  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  React.useEffect(() => {

    if (session) {
      setUser(session.user);
      setLoading(false);
    }

  }, [session])


  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  const uploadFile = async () => {
    if (!file) {
      alert('Please choose a file first!')
      return;
    }
    setLoading(true);
    const formdata = new FormData();

    formdata.append('file', file)

    try {
      const response = await axios.post('/api/python-helpers/bulk-upload', formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })

      alert(response.data)
    } catch (error) {
      console.log(error)
      alert('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <FlexDiv classes='w-full h-[80vh]'>
        <Loader />
      </FlexDiv>
    )
  }


  if (!UPDATE_PERMISSIONS[user.user_type].includes('Create Ticket')) {
    return (
      <FlexDiv classes='h-[80vh]'>
        <ErrorResult text={'You are not authorised to access this page.'} onClick={() => window.location.href = '/dashboard'} />
      </FlexDiv>
    )
  }


  return (
    <div className='min-h-[75vh] bg-white w-full px-10 py-10 rounded-md flex flex-col justify-between'>
      <input type='file' accept='.xlsx, .xls' className='hidden' ref={inputRef} onChange={handleFileChange} />
      <div>
        <div className='w-full flex flex-col mb-4 '>
          <span className='bg-purple px-2 py-1 text-xl rounded-md' >
            Sample Template
          </span>
          <a href='/api/sample-file.xlsx' target='_blank' className='px-2 text-stc-red'>
            Download Sample Excel Template
          </a>
        </div>
        <div onClick={handleClick} className='flex flex-col items-center justify-center rounded-md h-72 gap-y-4 cursor-pointer' style={{ background: 'white', border: '1px dashed #4f008c' }}>
          <p className="ant-upload-drag-icon ">
            <InboxOutlined style={{ color: '#4f008c', fontSize: '48px' }} />
          </p>
          <p className="ant-upload-text" style={{ color: '#4f008c', fontWeight: 600 }}>Click or drag file to this area to upload</p>
          <p className="ant-upload-hint" style={{ color: '#4f008c' }}>
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </div>
      </div>
      <div>
        <div className='w-full mt-3'>
          <button onClick={uploadFile} className='w-full bg-purple rounded-lg py-3 text-xl'>
            Upload
          </button>
        </div>

      </div>

    </div>)
};

export default BulkUploader;