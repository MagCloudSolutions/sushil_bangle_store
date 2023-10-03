import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/HomePage/Home';
import Inventory from './Pages/InventoryPage/Inventory';
import Login from './Pages/LoginPage/Login';
import Signup from './Pages/SignupPage/Signup';
import Billing from './Pages/BillingPage/Billing';
import Orders from './Pages/OrdersPage/Orders';
import { ViewInvoice } from './Pages/ViewInvoice/ViewInvoice';
import ErrorPage from './Pages/ErrorPage/ErrorPage';

const App = () => {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route index element={<Home />} />
                    <Route path='/inventory' element={<Inventory />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/view-invoice/:data' element={<ViewInvoice />} />
                    <Route path='/billing' element={<Billing />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='*' element={<ErrorPage />} />
                </Routes>
            </Router>

        </>
    )
}

export default App;