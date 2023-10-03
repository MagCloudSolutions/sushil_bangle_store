import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "90vh" }}>
                <h1 className='text-lg p-5'>Welcome to Sushil Bangle Store</h1>
                <div className='my-3'>
                    <Link to={"/inventory"}><button className='btn bg-[#670006] text-white mx-2'>Inventory</button></Link>
                    <Link to={"/orders"}><button className='btn bg-[#670006] text-white mx-2'>Order History</button></Link>
                    <Link to={"/billing"}><button className='btn bg-[#670006] text-white mx-2'>Billing</button></Link>
                </div>
            </div>
        </>
    )
}

export default Home