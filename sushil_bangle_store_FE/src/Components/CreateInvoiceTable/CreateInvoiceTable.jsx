import React from 'react';

const CreateInvoiceTable = ({ productList }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Amount</th>
        </tr>
      </thead>

      <tbody>
        {productList.reverse().map((product) => (
          <tr key={product.productName}>
            <td className="text-sm">{product.productName}</td>
            <td className="text-sm">{product.productQuantity} {product.quantityUnit}s</td>
            <td className="text-sm">{product.productCost}</td>
            <td className="text-sm">
              {Number(product.productCost * product.productQuantity).toLocaleString(
                'en-US'
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CreateInvoiceTable;