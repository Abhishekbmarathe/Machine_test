import React from 'react'
import Navbar from './Navbar'

function Home() {
    return (
        <div>
            <Navbar />
            <h1 className='p-5 px-20 bg-custDash'>Dashboard</h1>
            <h1 className='py-16 w-fit m-auto '>Welcome Admin pannel</h1>
        </div>
    )
}

export default Home
