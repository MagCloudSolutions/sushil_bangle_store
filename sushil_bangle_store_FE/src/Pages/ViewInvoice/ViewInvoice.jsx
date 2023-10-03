import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PrintIcon from '@mui/icons-material/Print';
import HomeIcon from '@mui/icons-material/Home';
import { errorToast } from '../../Utils/Toast';
import { calculateGrandTotal, formatDate } from '../../Utils/functions';
import "./ViewInvoice.css"

export const ComponentToPrint = React.forwardRef((props, ref) => {
    let { data } = useParams();

    let id = data.split(" ")[0];

    let invoiceId = data.split(" ")[1];

    const navigate = useNavigate();

    const [invoiceDetails, setInvoiceDetails] = useState(null);

    useEffect(() => {
        if (localStorage.getItem("token") || localStorage.getItem("isAdmin")) {
            if (id) {
                getInvoice();
            }
        } else {
            navigate("/login");
        }

        // eslint-disable-next-line
    }, [id, invoiceDetails]);

    const getInvoice = async () => {
        try {
            const invoiceResp = await fetch(`http://localhost:8000/invoices/${id}`);
            const resp = await invoiceResp.json();

            if (resp.response) {
                setInvoiceDetails({ id: resp.response._id, data: resp.response });
            } else {
                errorToast("Invoice not found");
            }
        } catch (e) {
            console.error('Error fetching invoice:', e);
            errorToast("Something went wrong while fetching the invoice", e.message);
        }
    };

    return (
        <div className="w-full md:w-5/6 mx-auto shadow-xl rounded" ref={ref}>
            <div className="w-full h-[10vh]">
                <div className="flex justify-around w-full px-6 py-4">
                    <div className='col-4'>
                        <h3 className="text-4xl font-bold mb-8">Invoice</h3>
                    </div>
                    <div className='col-8' style={{ textAlign: "right" }}>
                        <p className="text-sm font-semibold mb-1">Date:
                            {invoiceDetails && invoiceDetails.data && (
                                <span className="text-sm">{formatDate(invoiceDetails.data.createdAt)}</span>
                            )}
                        </p>
                        <p className="text-sm font-semibold mb-1">Invoice ID:
                            {invoiceDetails && invoiceDetails.data && invoiceId && (
                                <span className="mb-5 text-sm">{invoiceId}</span>
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full flex md:flex-row" style={{ justifyContent: "space-between" }}>
                {invoiceDetails && invoiceDetails.data && (
                    <div className="md:w-2/3 px-8 pt-8">
                        <h3 className="font-medium mb-2"><strong>Bill To:</strong></h3>

                        <p className="text-sm mb-1"><strong>Customer Name:</strong> {invoiceDetails.data.customerName}</p>

                        {invoiceDetails.data.customerGST.length > 5 ? <p className="text-sm mb-1"><strong>Customer GST:</strong> {invoiceDetails.data.customerGST}</p> : ""}

                        <p className="text-sm mb-1"><strong>Customer Phone:</strong> {invoiceDetails.data.customerPhone}</p>
                    </div>
                )}

                <div className="md:w-1/3 px-4 pb-0 pt-4">
                    <h3 className="font-medium mb-2"><strong>Bill From:</strong></h3>
                    <p className="text-sm mb-1">Sushil Bangle Store</p>
                    <p className="text-sm mb-1">Agra, UP</p>
                    <p className="text-sm mb-1">9953259258</p>
                </div>
            </div>

            <div className="pt-0 pb-4 px-4">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-sm">S.No.</th>
                            <th>Products</th>
                            <th className="text-right text-sm">Cost</th>
                            <th className="text-right text-sm">Qty</th>
                            <th className="text-right text-sm">Unit</th>
                            <th className="text-right text-sm">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceDetails && invoiceDetails.data &&
                            invoiceDetails.data.productList.map((item, index) => (
                                <tr key={item.productName}>
                                    <td className="text-xs">{index + 1}</td>
                                    <td className="text-xs capitalize">{item.productName}</td>
                                    <td className="text-xs text-right">
                                        {item.productCost}
                                    </td>
                                    <td className="text-xs text-right">
                                        {item.productQuantity}
                                    </td>
                                    <td className="text-xs text-right capitalize">
                                        {item.quantityUnit}
                                    </td>
                                    <td className="text-xs text-right">
                                        {(
                                            Number(item.productQuantity) * Number(item.productCost)
                                        )}
                                    </td>
                                </tr>
                            ))}

                        {invoiceDetails && invoiceDetails.data && (
                            <tr>
                                <td colSpan="5" className="text-right font-bold text-sm">
                                    TOTAL AMOUNT
                                </td>
                                <td className="font-bold text-right text-sm">
                                    ₹ {calculateGrandTotal(invoiceDetails.data.productList)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <footer className="px-8 py-4 bg-gray-200 w-full">
                <p className="text-sm text-center">Thanks for Shopping with Us!</p>
            </footer>
        </div>
    );
});

export const ViewInvoice = () => {
    const ComponentRef = useRef();
    const navigate = useNavigate();

    const handlePrint = useReactToPrint({
        content: () => ComponentRef.current,
    });

    return (<>
        <Tooltip title="Go Home">
            <IconButton
                onClick={() => navigate('/')}
                style={{
                    position: 'fixed',
                    bottom: '50px',
                    left: '30px',
                    zIndex: 999,
                }}>
                <HomeIcon style={{ fontSize: '30px' }} />
            </IconButton>
        </Tooltip>

        <Tooltip title="Print Invoice">
            <IconButton
                onClick={handlePrint}
                style={{
                    position: 'fixed',
                    bottom: '50px',
                    right: '30px',
                    zIndex: 999,
                    color: '#670006',
                }}>
                <PrintIcon style={{ fontSize: '30px' }} />
            </IconButton>
        </Tooltip>

        <ComponentToPrint ref={ComponentRef} />
    </>
    );
}