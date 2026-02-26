fetch('/create-order', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        customer_id: 3,
        address_id: 2,
        payment_method_id: 1,
        total_sum: 499.99,
        total_weight: 1200
    })
});