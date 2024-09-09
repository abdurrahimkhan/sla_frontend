import React from 'react';
import { Button, Result } from 'antd';
import { IoCheckmarkCircleSharp } from 'react-icons/io5';

const SuccessResults = ({ text, onClick }) => (
  <Result
    status={'success'}
    icon={
            <div className='flex justify-center'>
                <IoCheckmarkCircleSharp  className='text-stc-green text-8xl'/>
            </div>
        }
    title={text}
    extra={
      onClick &&
      <button onClick={onClick}  className='bg-stc-green font-medium text-white px-3 py-2 rounded-md'>
        Create another one
      </button  >
    }
  />
);

export default SuccessResults;