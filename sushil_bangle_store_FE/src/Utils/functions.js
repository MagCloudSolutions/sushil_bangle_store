export const formatDate = (timestamp) => {
    const date = new Date(timestamp);

    // Get day, month, and year
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed, so add 1
    const year = date.getFullYear();

    // You can format the output as desired, for example, "dd/mm/yyyy"
    const formattedDate = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;

    return formattedDate;
}

export const calculateGrandTotal = (productList) => {
    let grandTotal = 0;

    for (const item of productList) {
        const itemCost = Number(item.productCost);
        const itemQuantity = Number(item.productQuantity);
        grandTotal += itemCost * itemQuantity;
    }

    return grandTotal;
}