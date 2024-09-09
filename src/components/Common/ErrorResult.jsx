import React from 'react';
import { Button, Result } from 'antd';

const ErrorResult = ({ text, onClick }) => (
  <Result
    status={'error'}
    title={text}
    extra={
      <button onClick={onClick}  className='bg-stc-red font-medium text-white px-3 py-2 rounded-md'>
        Try Again
      </button  >
    }
  />
);

export default ErrorResult;