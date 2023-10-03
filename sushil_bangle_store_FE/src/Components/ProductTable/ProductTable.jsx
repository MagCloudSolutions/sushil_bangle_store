import React, { useEffect, useState } from "react";

const ProductTable = ({ products, handleEditProduct, handleDeleteProduct }) => {

  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    sortProducts();
    // eslint-disable-next-line
  }, [products]);

  const sortProducts = () => {
    if (products.length > 0) {
      const sortedProductsData = [...products].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      setSortedProducts(sortedProductsData);
    } else {
      setSortedProducts(products);
    }
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">S.No.</th>
            <th scope="col">Category</th>
            <th scope="col">Name</th>
            <th scope="col">Company</th>
            <th scope="col">Quantity</th>
            <th scope="col">Price</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((pro, index) =>
            <tr key={pro._id}>
              <th scope="row">{index + 1}</th>
              <td>{pro.category}</td>
              <td>{pro.name}</td>
              <td>{pro.company}</td>
              <td>{pro.quantity}</td>
              <td>{pro.price}</td>

              <td><button className="btn btn-warning" onClick={() => {
                handleEditProduct(
                  pro.category,
                  pro.name,
                  pro.company,
                  pro.quantity,
                  pro.price,
                  pro._id
                );
              }}><i className="fa-solid fa-pen-to-square"></i></button></td>

              <td><button className="btn btn-danger" onClick={() => {
                const confirmDelete = window.confirm("Do you really want to permanently delete this product?");
                if (confirmDelete) handleDeleteProduct(pro._id);
              }}><i className="fa-sharp fa-solid fa-trash"></i></button></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;