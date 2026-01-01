// src/pages/PayFine.jsx
import API from "../api/api";

export default function PayFine({ fine }) {
  const handlePay = async () => {
    const { data } = await API.post("/payment/create-order", {
      amount: fine,
    });

    const options = {
      key: "RAZORPAY_KEY",
      amount: data.amount,
      currency: "INR",
      order_id: data.id,
      handler: () => alert("Payment Successful"),
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePay}>Pay ₹{fine}</button>;
}
