import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButton = ({ amount, description, onSuccess, onError }) => {
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState(null);

  const initialOptions = {
    "client-id": "test", // Replace with your actual PayPal client ID in production
    currency: "USD",
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: description,
          amount: {
            currency_code: "USD",
            value: amount,
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      setIsPaid(true);
      if (onSuccess) {
        onSuccess(details);
      }
    });
  };

  const onPayPalError = (err) => {
    setError(err);
    if (onError) {
      onError(err);
    }
    console.error("PayPal error:", err);
  };

  return (
    <div className="paypal-button-container">
      {isPaid ? (
        <div className="alert alert-success">
          Payment successful! Thank you for your purchase.
        </div>
      ) : error ? (
        <div className="alert alert-danger">
          Payment failed: {error.message}
        </div>
      ) : (
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onPayPalError}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default PayPalButton;
