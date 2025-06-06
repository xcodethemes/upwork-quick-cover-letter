import React from 'react'
import { MdKeyboardArrowLeft } from 'react-icons/md'

const Title = ({setView, title}) => {
  return (
     <div className='border-b border-gray-100 mb-4'>
            <MdKeyboardArrowLeft
              className="text-[25px] absolute left-2 cursor-pointer"
              onClick={() => setView("main")}
            />
            <h1 className="text-xl font-bold text-center mb-4">{title}</h1>
          </div>
  )
}

export default Title