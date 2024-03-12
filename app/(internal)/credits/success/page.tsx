"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation'

const PaymentSuccess = () => {
    const  searchParams = useSearchParams()
    let orderId = searchParams.get('reference')
  return (
    <div className="h-screen flex flex-col py-4 items-center justify-center">
        <h1 className='text-center text-3xl'>Payment Success</h1>
    <div className=' text-xl text-center flex flex-row '>
        <h3>Your order Id is</h3>
     <p className='text-red-400 ml-1'>{orderId}</p>
     </div>
    </div>
  )
}

export default PaymentSuccess