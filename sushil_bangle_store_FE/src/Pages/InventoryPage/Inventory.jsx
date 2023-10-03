import React, { useEffect, useState, useRef } from "react";
import "./Inventory.css";
import ProductTable from "../../Components/ProductTable/ProductTable";
import { defaultToast, errorToast } from "../../Utils/Toast";
import NoPermission from "../NoPermission/NoPermission";

const Inventory = () => {
  const openModalRef = useRef();
  const closeModalRef = useRef();

  const [isAdmin, setIsAdmin] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("dozen");
  const [price, setPrice] = useState("");
  const [id, setId] = useState("");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("isAdmin")) {
      setIsAdmin(true);
      getProducts();
    }

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    handleSearch();

    // eslint-disable-next-line
  }, [search, products]);

  const handleSearch = () => {
    const filteredData = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredProducts(filteredData);
  }

  const getProducts = async () => {
    const resp = await fetch("http://localhost:8000/products");

    const productResp = await resp.json();

    setProducts(productResp.response);
  };

  const handleAddProduct = async (e) => {
    if (name.length <= 1 || category.length <= 1 || company.length <= 1 || quantity.length <= 1 || price.length < 1) {
      e.preventDefault();
      errorToast("Fill all fields!!");
    } else {
      e.preventDefault();

      await fetch("http://localhost:8000/products", {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
          category,
          company,
          name,
          price: `${price} / ${unit}`,
          quantity: `${quantity} ${unit}`,
        })
      });

      defaultToast("Product Added successfully!");

      getProducts();
      clearInputs();
    }
  };

  const handleEditProduct = (category, name, company, quantity, price, id) => {
    setCategory(category);
    setName(name);
    setCompany(company);
    setQuantity(quantity.split(" ")[0]);
    setPrice(price.split(" ")[0]);
    setUnit(quantity.split(" ")[1]);
    setId(id);
    openModalRef.current.click();
  }

  const handleEditClick = async () => {
    await fetch(`http://localhost:8000/products/${id}`, {
      method: "PUT",
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify({
        category,
        company,
        name,
        price: `${price} / ${unit}`,
        quantity: `${quantity} ${unit}`,
      })
    });

    defaultToast("Product updated successfully");

    closeModalRef.current.click();
    clearInputs();
    getProducts();
  }

  const handleDeleteProduct = async (id) => {
    await fetch(`http://localhost:8000/products/${id}`, {
      method: 'DELETE',
    });

    defaultToast("Product deleted successfully");
    getProducts();
  }

  function clearInputs() {
    setName("");
    setCategory("");
    setCompany("");
    setQuantity("");
    setPrice("");
    setUnit("dozen");
    setId("");
  }

  const closeModal = () => {
    closeModalRef.current.click();
    clearInputs();
    defaultToast("Cancelled");
  }

  return (
    <>
      {!isAdmin
        ? <NoPermission />
        : (<>
          <div className="container add-product">
            <h1 className="my-3">Add a product</h1>
            <form style={{
              width: "80vw",
              margin: "auto",
            }}>
              <div className="justify-center">
                <div className="col-md-8">
                  <label htmlFor="category">Category</label><br />
                  <input
                    id="category"
                    style={styles.input}
                    className="my-2 form-control"
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    placeholder="Enter Product Category"
                  />
                </div>
                <div className="col-md-8">
                  <label htmlFor="name">Name</label><br />
                  <input
                    id="name"
                    style={styles.input}
                    className="my-2 form-control"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Product Name"
                  />
                </div>
                <div className="col-md-8">
                  <label htmlFor="company">Company</label><br />
                  <input
                    id="company"
                    style={styles.input}
                    className="my-2 form-control"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter Product Company"
                  />
                </div>
                <div className="col-md-8">
                  <label htmlFor="quantitySelect">Quantity</label><br />
                  <div className="d-flex">
                    <select style={{ width: "40%" }} name="quantity" className="quantitySelect form-control" onChange={(e) => setUnit(e.target.value)}>
                      <option defaultChecked value="dozen">Dozens</option>
                      <option value="piece">Pieces</option>
                    </select>
                    <input
                      style={styles.quantityInput}
                      className="my-2 mx-2 form-control"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder={`Enter Quantity in ${unit}`} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-8">
                    <label htmlFor="price">Price</label><br />
                    <input
                      id="price"
                      style={styles.input}
                      className="my-2 form-control"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={`Enter Product Price (per ${unit})`} />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-8">
                    <button
                      type="submit"
                      onClick={handleAddProduct}
                      className="btn my-3"
                      style={styles.btn}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="your-products container">
            <div className="head d-flex" style={{ justifyContent: "space-between", flexDirection: "row" }}>
              <h1>Your Products</h1>
              <input onChange={e => setSearch(e.target.value)
              } value={search} className="search-input" type="search" placeholder="Type Something to Search..." aria-label="Search" />
            </div>

            {
              products.length <= 0
                ? <div><h1 className="text-center">No Products found, try adding some!</h1></div>
                : <ProductTable
                  products={filteredProducts}
                  handleEditProduct={handleEditProduct}
                  handleDeleteProduct={handleDeleteProduct} />
            }

            <button ref={openModalRef} type="button" className="d-none" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            </button>
            <button ref={closeModalRef} type="button" className="d-none" data-bs-dismiss="modal" data-bs-target="#staticBackdrop">
            </button>

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Edit Product</h1>
                    <button onClick={closeModal} type="button" className="text-white bg-black btn-close" aria-label="Close">X</button>
                  </div>
                  <div className="modal-body">

                    <form>
                      <label htmlFor="editCategory">Category</label><br />
                      <input
                        id="editCategory"
                        style={styles.input}
                        className="my-2"
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Enter Product Category"
                      />
                      <br />

                      <label htmlFor="editName">Name</label><br />
                      <input
                        id="editName"
                        style={styles.input}
                        className="my-2"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter Product Name"
                      />
                      <br />

                      <label htmlFor="editCompany">Company</label><br />
                      <input
                        id="editCompany"
                        style={styles.input}
                        className="my-2"
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Enter Product Company"
                      />
                      <br />

                      <label htmlFor="editQuantitySelect">Quantity</label><br />
                      <div className="d-flex">
                        <select name="quantity" id="editQuantitySelect" className="quantitySelect" value={unit} onChange={(e) => setUnit(e.target.value)}>
                          <option value="dozen">Dozens</option>
                          <option value="piece">Pieces</option>
                        </select>
                        <br />

                        <input
                          id="editQuantity"
                          style={styles.quantityInput}
                          className="my-2 mx-2"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder={`Enter Quantity in ${unit}`}
                        />
                      </div>

                      <label htmlFor="editPrice">Price</label><br />
                      <input
                        id="editPrice"
                        style={styles.input}
                        className="my-2"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={`Enter Product Price (per ${unit})`}
                      />
                    </form>

                  </div>
                  <div className="modal-footer">
                    <button onClick={closeModal} type="button" className="btn bg-gray">Close</button>
                    <button onClick={handleEditClick} className="btn text-white bg-[#670006]">Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>)}
    </>
  );
};

const styles = {
  h1: {
    margin: "auto",
  },
  input: {
    // width: 350,
    width: "100%",
    height: 50,
    border: "1px solid #670006",
    padding: 10,
    borderRadius: 10,
  },
  quantityInput: {
    width: "100%",
    height: 50,
    border: "1px solid #670006",
    padding: 10,
    borderRadius: 10,
  },
  btn: {
    backgroundColor: "#670006",
    color: "#e7e7e7",
    // width: 100,
  },
};

export default Inventory;