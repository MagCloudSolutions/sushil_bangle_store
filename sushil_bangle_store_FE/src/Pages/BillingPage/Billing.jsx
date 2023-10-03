import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultToast, errorToast } from '../../Utils/Toast';
import CreateInvoiceTable from '../../Components/CreateInvoiceTable/CreateInvoiceTable';
import "./Billing.css";

const CreateInvoice = () => {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerGST, setCustomerGST] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [productName, setProductName] = useState('');
  const [productCost, setProductCost] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('dozen');
  const [productList, setProductList] = useState([]);

  const [idList, setIdList] = useState([]);
  const [nameList, setNameList] = useState([]);
  const [quantityList, setQuantityList] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("token") || localStorage.getItem("isAdmin")) {
      getProducts();
    } else {
      navigate("/login");
    }

    // eslint-disable-next-line
  }, []);

  const getProducts = async () => {
    const resp = await fetch("http://localhost:8000/products");
    const productResp = await resp.json();

    const productsData = productResp.response.map((p) => ({
      id: p._id,
      name: p.name,
      quantity: p.quantity,
      price: p.price,
    }));

    // Extract product names for suggestions
    const productNames = productsData.map(product => product.name);

    setIdList(productsData.map(product => product.id));
    setNameList(productNames);
    setQuantityList(productsData.map(product => product.quantity));
    setPriceList(productsData.map(product => product.price));

    setProductSuggestions(productNames); // Update suggestions
  }

  const handleProductNameChange = (e) => {
    const input = e.target.value;
    setProductName(input);

    // Filter suggestions based on user input
    const filteredSuggestions = nameList.filter(name =>
      name.toLowerCase().includes(input.toLowerCase())
    );

    setProductSuggestions(filteredSuggestions);
  };

  const handleSuggestionClick = (suggestion) => {
    setProductName(suggestion);
    setProductSuggestions([]); // Clear suggestions when a suggestion is clicked

    const productIndex = nameList.findIndex(
      (name) => name.toLowerCase() === suggestion.toLowerCase()
    );

    let unit;

    if (productIndex !== -1) {
      unit = priceList[productIndex].split(" ")[2];
      setQuantityUnit(unit);
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (productName.trim() && productCost > 0 && productQuantity >= 1) {
      // Find the index of the selected product name in nameList
      const productIndex = nameList.findIndex(
        (name) => name.toLowerCase() === productName.toLowerCase()
      );

      // Check if the product exists in the list
      if (productIndex !== -1) {
        const availableQuantity = parseInt(
          quantityList[productIndex].split(" ")[0]
        );

        // Check if the entered quantity is valid
        if (parseInt(productQuantity) <= availableQuantity) {
          // Product has sufficient quantity
          setProductList([
            ...productList,
            {
              productName,
              productCost,
              productQuantity,
              quantityUnit,
            },
          ]);

          defaultToast("Product Added");

          setProductName('');
          setProductCost('');
          setProductQuantity('');
        } else {
          // Handle insufficient quantity
          setProductQuantity('');
          errorToast(`Insufficient quantity available for ${nameList[productIndex]}.`);
          errorToast(`Only ${availableQuantity} ${quantityUnit}s are available`);
        }
      } else {
        errorToast("Product not found in the database.");
      }
    }
  };

  const saveInvoice = async (e) => {
    e.preventDefault();

    if (productList.length > 0) {
      try {
        for (const product of productList) {
          const productIndex = nameList.findIndex(
            (name) => name.trim().toLowerCase() === product.productName.trim().toLowerCase()
          );

          if (productIndex !== -1) {
            const availableQuantity = parseInt(
              quantityList[productIndex].split(" ")[0]
            );

            if (availableQuantity >= product.productQuantity) {
              // Deduct the quantity
              const newQuantity = availableQuantity - product.productQuantity;
              const productId = idList[productIndex];

              // Update the quantity in DB
              await fetch(`http://localhost:8000/products/${productId}`, {
                method: "PUT",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({
                  quantity: `${newQuantity} ${product.quantityUnit}`,
                })
              });

              defaultToast("Quantity updated");
            } else {
              errorToast(`Insufficient quantity available for the product: ${product.productName}`);
            }
          } else {
            errorToast(`Product not found in the database: ${productName}`);
          }
        }

        // Save invoice
        await fetch("http://localhost:8000/invoices", {
          method: "POST",
          headers: { 'Content-Type': "application/json" },
          body: JSON.stringify({
            customerName,
            customerGST,
            customerPhone,
            productList
          })
        });

        defaultToast("Invoice Saved successfully!");

        // Clear productList and form fields
        setProductList([]);
        setCustomerName("");
        setCustomerGST("");
        setCustomerPhone("");

        // Refresh products
        getProducts();
      } catch (error) {
        // Handle any errors that occurred during the process
        errorToast(error.message);
      }
    } else {
      errorToast("Product add some products first")
    }
  };

  return (
    <>
      <div className="w-full p-3 md:w-2/3 shadow-xl mx-auto rounded my-2 md:p-8">
        <h3 className="text-center font-bold text-xl mb-4">
          Create an Invoice
        </h3>

        <form
          className="w-full mx-auto flex flex-col">
          <label htmlFor="customerName" className="text-sm">
            Customer's Name
          </label>
          <input
            placeholder="Enter Customer Name"
            type="text"
            required
            name="customerName"
            className="py-2 px-4 bg-gray-100 w-full mb-6"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <label htmlFor="customerGST" className="text-sm">
            Customer's GST
          </label>
          <input
            placeholder="Enter Customer GST"
            type="text"
            required
            name="customerGST"
            className="py-2 px-4 bg-gray-100 w-full mb-6"
            value={customerGST}
            onChange={(e) => setCustomerGST(e.target.value)}
          />

          <label htmlFor="customerPhone" className="text-sm">
            Customer's Phone Number
          </label>
          <input
            placeholder="Enter Customer Phone Number"
            type="number"
            required
            name="customerPhone"
            className="py-2 px-4 bg-gray-100 w-full mb-6"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />

          <div className="w-full flex justify-between flex-col">
            <h3 className="my-4 font-bold ">Products List</h3>

            <div className="flex space-x-3 mobile-view">

              <div className="flex flex-col w-1/4">
                <label htmlFor="itemName" className="text-sm">
                  Product Name
                </label>
                <input
                  type="text"
                  name="itemName"
                  placeholder="Name"
                  className="py-2 px-4 mb-6 bg-gray-100"
                  value={productName}
                  onChange={handleProductNameChange} // Update product name input
                />
                {/* Display suggestions */}
                {productSuggestions.length > 0 && productName && (<>
                  <p><strong>Suggestions</strong> ⬇️</p>
                  <ul className="suggestions">
                    {productSuggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="suggestion-item cursor-pointer m-2">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </>
                )}
              </div>

              <div className="flex flex-col w-1/4">
                <label htmlFor="itemQuantity" className="text-sm">
                  Product Quantity
                </label>
                <input
                  type="number"
                  name="itemQuantity"
                  placeholder={`Quantity in ${quantityUnit}`}
                  className="py-2 px-4 mb-6 bg-gray-100"
                  value={productQuantity}
                  onChange={(e) => setProductQuantity(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-1/4">
                <label htmlFor="itemCost" className="text-sm">
                  Product Price
                </label>
                <input
                  type="number"
                  name="itemCost"
                  placeholder={`Price per ${quantityUnit}`}
                  className="py-2 px-4 mb-6 bg-gray-100"
                  value={productCost}
                  onChange={(e) => setProductCost(e.target.value)}
                />
              </div>

              <div className="flex flex-col w-1/4">
                <p className="text-sm">Total Price</p>
                <p className="py-2 px-4 mb-6 bg-gray-100">
                  {Number(productCost * productQuantity)}
                </p>
              </div>
            </div>

            <button
              className="bg-[#670006] text-gray-100 w-[150px] p-3 rounded my-2"
              onClick={handleSubmit}>
              Add Product
            </button>
          </div>


          {productList[0] && <CreateInvoiceTable productList={productList} />}

          <button
            className="bg-[#670006] text-gray-100 w-full p-[12px] rounded my-6 mx-auto"
            type="submit" onClick={saveInvoice}>
            SAVE INVOICE
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateInvoice;