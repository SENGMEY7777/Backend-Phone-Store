# Bakong KHQR Payment Integration Documentation

This document outlines the Bakong KHQR payment integration, detailing the backend database schema, API endpoints, and frontend implementation instructions.

---

## 1. Database Schema
The `payments` table has been updated to support Bakong metadata.

```sql
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    payment_method VARCHAR(50) NOT NULL, -- Value will be 'BAKONG'
    amount DECIMAL(12,2) NOT NULL,
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    paid_at TIMESTAMP NULL,
    qr_code TEXT NULL,          -- Hashed EMV QR string from Bakong SDK
    md5_hash VARCHAR(255) NULL, -- MD5 hash of the QR string used for polling verification

    CONSTRAINT fk_payment_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
);
```

---

## 2. Backend API Endpoints
All payment routes are mounted under `/api/user/payments` and protected by the `isLogin` JWT auth middleware.

### 2.1 Generate KHQR Code
* **Endpoint:** `GET` or `POST` `/api/user/payments/generateqr/:orderId`
* **Headers:** 
  * `Authorization: Bearer <token>`
* **Path Parameters:**
  * `orderId` (e.g. `123`)
* **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Payment QR generated successfully",
    "data": {
      "order_id": 123,
      "amount": 1200.00,
      "qr_code": "00020101021230570022soeun_sovannarith@aclb...",
      "md5_hash": "f8e47779c86800a639a67e59ee1e11ef",
      "status": "PENDING"
    }
  }
  ```

### 2.2 Verify Payment Status
Checks status against the NBC Bakong Proxy API by querying the MD5 transaction hash. Updates database states automatically.
* **Endpoint:** `GET` or `POST` `/api/user/payments/verify/:md5`
* **Headers:** 
  * `Authorization: Bearer <token>`
* **Path Parameters:**
  * `md5` (e.g. `f8e47779c86800a639a67e59ee1e11ef`)
* **Success Response (200 OK - Paid):**
  ```json
  {
    "success": true,
    "message": "Payment status verified successfully",
    "data": {
      "order_id": 123,
      "status": "SUCCESS",
      "paid_at": "2026-06-09T12:48:40.000Z",
      "transaction_details": {
         "hash": "e40a...",
         "fromAccountId": "buyer@aclb",
         "toAccountId": "soeun_sovannarith@aclb",
         "currency": "USD",
         "amount": 1200.00
      }
    }
  }
  ```
* **Success Response (200 OK - Still Unpaid):**
  ```json
  {
    "success": true,
    "message": "Payment status verified successfully",
    "data": {
      "order_id": 123,
      "status": "PENDING",
      "message": "Transaction could not be found. Please check and try again."
    }
  }
  ```

---

## 3. Frontend Implementation Guidelines

### 3.1 Generating QR Code (Checkout Page)
Send a `POST` or `GET` request to `/api/user/payments/generateqr/${orderId}`.

### 3.2 Displaying the QR Code Image
Instead of installing a QR Code generator library in React/Next.js, use the free, fast, and zero-dependency QR Server API. Pass the encoded `qr_code` string in the image URL:
```jsx
<img 
  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(bakongQR.qr_code)}`} 
  alt="Bakong KHQR Code" 
  style={{ width: '220px', height: '220px', display: 'block' }}
/>
```

### 3.3 Live Status Polling
Set up a polling interval (`setInterval`) that hits `/api/user/payments/verify/${md5_hash}` every 3 seconds to check the payment status.

```javascript
// Example React Polling Hook
React.useEffect(() => {
  if (!bakongQR) return;

  let intervalId;
  const pollStatus = async () => {
    try {
      const res = await apiCall(`/api/user/payments/verify/${bakongQR.md5_hash}`);
      
      if (res && res.success && res.data) {
        setPaymentStatus(res.data.status);
        
        if (res.data.status === 'SUCCESS') {
          clearInterval(intervalId);
          setSuccessOrder(bakongQR.order);
          clearCart();
          setBakongQR(null);
          addNotification("Payment received successfully via Bakong!", "success");
        } else if (res.data.status === 'FAILED') {
          clearInterval(intervalId);
          setBakongQR(null);
          addNotification("Bakong payment failed.", "error");
        }
      }
    } catch (err) {
      console.warn("Error checking status:", err);
    }
  };

  intervalId = setInterval(pollStatus, 3000);
  pollStatus(); // Immediate first check

  return () => clearInterval(intervalId);
}, [bakongQR]);
```

### 3.4 Simulating Successful Payments in Dev
For sandbox testing without spending real money, run the following MySQL update command inside the database container to mark the transaction as successful:
```bash
docker exec -it phone_store_db mysql -u root -prootpassword PhoneStore -e "UPDATE payments SET payment_status = 'SUCCESS' WHERE order_id = <YOUR_ORDER_ID>;"
```
*(This triggers the frontend's status polling loop to immediately transition to the success screen).*
