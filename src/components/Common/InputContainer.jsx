import React from 'react'
import FlexDiv from './FlexDiv'

export default function InputContainer({label, required, children}) {
  return (
    <FlexDiv direction='column' alignment='start' classes='w-3/4 mt-5 input-container'>
      <span className='text-stc-black font-medium'>
        {label} {required && <span className='text-stc-red'>*</span>}
      </span>
      {children}
    </FlexDiv>
  )
}
