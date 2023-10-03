import React from 'react'
import { Link } from 'react-router-dom';

const NoPermission = () => {
    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "90vh", margin: 10 }}>
            <h1 className='text-lg p-5'>You don't have permission to access this page, please contact Admin</h1>
            <div className='my-3'>
                <Link to={"/"}><button className='btn bg-[#670006] text-white mx-2'>Go to Home</button></Link>
            </div>
        </div>
    )
}

export default NoPermission;