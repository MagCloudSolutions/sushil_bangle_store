import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { errorToast } from "../../Utils/Toast";
import { formatDate } from "../../Utils/functions";

const Orders = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token") || localStorage.getItem("isAdmin")) getInvoices();
    else navigate("/login");

    // eslint-disable-next-line
  }, []);

  const getInvoices = async () => {
    try {
      const invoicesResp = await fetch("http://localhost:8000/invoices");
      const resp = await invoicesResp.json();

      let invoicesList = [];

      resp.response.forEach(i => {
        invoicesList.push({ data: i, id: i._id });
      });

      setInvoices(invoicesList);
    } catch (e) {
      console.log(e);
      errorToast("Something went wrong", e.message);
    }
  }

  return (
    <> <div className="w-full">
      <h1 className="text-xl text-[#670006] mx-3 mt-3 font-semibold">Order History</h1>
      <table>
        <thead>
          <tr>
            <th className="text-[#670006]">Date</th>
            <th className="text-[#670006]">Customer Name</th>
            <th className="text-[#670006]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...invoices].map((invoice, index) => (
            <tr key={invoice.id}>
              <td className='text-sm'>{formatDate(invoice.data.createdAt)}</td>
              <td className='text-sm'>{invoice.data.customerName}</td>
              <td className='text-sm text-blue-500 underline'><Link to={`/view-invoice/${`${invoice.id} ${index + 1}`}`}>View</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default Orders;