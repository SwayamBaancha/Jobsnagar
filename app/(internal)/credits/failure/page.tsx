'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'

const PaymentFailure = () => {
    const  searchParams = useSearchParams()
    let orderId = searchParams.get('reference')
  return (
    <div className="h-screen flex flex-col py-4 items-center justify-center">
        <h1 className='text-center text-3xl text-red-400'>Payment Failed!</h1>
    <div className=' text-xl text-center'>
   {orderId}
     </div>
    </div>
  )
}

export default PaymentFailure