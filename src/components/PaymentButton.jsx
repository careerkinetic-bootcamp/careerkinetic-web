import React, { useState } from 'react';
import axios from 'axios';
import { CreditCard, Loader2 } from 'lucide-react';

/**
 * Dynamically loads the official Razorpay Checkout SDK (checkout.js)
 */
const loadRazorpaySDK = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function PaymentButton({
  cohortId,
  planType = 'full',
  amount,
  title,
  userInfo,
  onSuccess,
  onError,
  className = 'btn btn-primary',
  style = {},
  disabled = false,
  children,
}) {
  const [loading, setLoading] = useState(false);

  const initiatePayment = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (disabled || loading) return;

    setLoading(true);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpaySDK();
      if (!isLoaded) {
        throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
      }

      // 2. Call backend to create Razorpay order (server resolves real price)
      const orderPayload = {
        cohort_id: cohortId,
        plan_type: planType,
      };

      const { data: orderData } = await axios.post('/payments/create-order', orderPayload, {
        withCredentials: true,
      });

      if (!orderData?.success || !orderData?.order_id) {
        throw new Error('Failed to generate payment order from server.');
      }

      // 3. Configure Razorpay Checkout options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount, // in paise
        currency: orderData.currency,
        name: 'CareerKinetic',
        description: `${orderData.cohort_title} Seat Enrollment`,
        image: '/favicon.svg',
        order_id: orderData.order_id,
        prefill: {
          name: userInfo?.fullName?.trim() || '',
          email: userInfo?.email?.trim() || '',
          contact: userInfo?.phone ? userInfo.phone.replace(/\D/g, '').slice(-10) : '',
        },
        theme: {
          color: '#6366f1',
          backdrop_color: 'rgba(15, 23, 42, 0.8)',
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async function (response) {
          try {
            // 4. Verify payment signature on backend
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const { data: verifyData } = await axios.post('/payments/verify-payment', verifyPayload, {
              withCredentials: true,
            });

            if (verifyData?.success) {
              onSuccess && onSuccess({
                ...verifyData,
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
              });
            } else {
              throw new Error(verifyData?.message || 'Payment verification failed on server.');
            }
          } catch (verifyErr) {
            const msg = verifyErr.response?.data?.detail || verifyErr.message || 'Payment verification error.';
            onError && onError(msg);
          } finally {
            setLoading(false);
          }
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', function (response) {
        setLoading(false);
        const failReason = response.error?.description || response.error?.reason || 'Transaction failed.';
        onError && onError(`Payment Failed: ${failReason}`);
      });

      rzpInstance.open();
    } catch (err) {
      setLoading(false);
      const errMsg = err.response?.data?.detail || err.message || 'Error processing payment.';
      onError && onError(errMsg);
    }
  };

  return (
    <button
      type="button"
      onClick={initiatePayment}
      disabled={disabled || loading}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Processing Payment...</span>
        </>
      ) : (
        children || (
          <>
            <CreditCard size={16} />
            <span>Pay ₹{Number(amount).toLocaleString('en-IN')} & Complete Enrollment →</span>
          </>
        )
      )}
    </button>
  );
}
