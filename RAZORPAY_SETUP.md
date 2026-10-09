# Razorpay Integration & Setup Guide — Number Story

This guide covers everything needed to configure, test, and deploy the Razorpay Payment Gateway integration for **Number Story**.

---

## 1. Product Catalog & Pricing Matrix

All pricing is verified server-side. Amounts are denominated in Indian Paise (₹1 = 100 paise).

| Product ID | Display Name | Price (INR) | Amount in Paise | Description | Entitlements |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `free` / `free10` | Number Analysis + 10Q Mini Test | ₹0 | `0` | Free Number Analysis + 10-question mini assessment | Free tier results |
| `standard` / `standard25` | Standard Personality Test | ₹49 | `4900` | 25-question in-depth assessment & full trait breakdown | `standard` |
| `complete` / `complete50` | Complete Personality Test | ₹99 | `9900` | 50-question deep assessment, archetype analysis & career insights | `complete` |
| `combo` / `combo149` | Number + Personality Combo | ₹149 | `14900` | **Best Value**: 50 questions + Number analysis + Premium Fusion Report + AI narrative | `combo` (unlocks all reports) |

---

## 2. Environment Variables

Create a `.env` file in the root directory (or configure Firebase Functions environment config):

```env
# Frontend Razorpay Key ID (Vite client-accessible)
VITE_RAZORPAY_KEY_ID=rzp_test_yourKeyIdHere

# Backend Secure Secrets (Node / Cloud Functions ONLY — Never expose in client code)
RAZORPAY_KEY_ID=rzp_test_yourKeyIdHere
RAZORPAY_KEY_SECRET=yourRazorpayKeySecretHere
RAZORPAY_WEBHOOK_SECRET=yourRazorpayWebhookSecretHere
```

> **Security Rule**: `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` must **never** be prefixed with `VITE_` or bundled in frontend assets.

---

## 3. Razorpay Dashboard Configuration

### Step 1: Sign Up / Switch to Test Mode
1. Log in to [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Toggle the switch at the top right to **Test Mode**.

### Step 2: Generate API Keys
1. Go to **Settings** $\rightarrow$ **API Keys**.
2. Click **Generate Test Key**.
3. Copy **Key ID** to `VITE_RAZORPAY_KEY_ID` and `RAZORPAY_KEY_ID`.
4. Copy **Key Secret** to `RAZORPAY_KEY_SECRET`.

### Step 3: Setup Webhook Endpoint
1. Go to **Settings** $\rightarrow$ **Webhooks** $\rightarrow$ **Add New Webhook**.
2. **Webhook URL**: `https://<your-region>-<your-project>.cloudfunctions.net/handleRazorpayWebhook` (or your backend webhook endpoint).
3. **Secret**: Enter a strong secret string and copy it to `RAZORPAY_WEBHOOK_SECRET`.
4. **Active Events**:
   - `payment.captured`
   - `payment.failed`
   - `refund.created`
5. Save the webhook.

---

## 4. End-to-End Payment Architecture

```
User Click Checkout 
        │
        ▼
[Client] createRazorpayOrder({ productId, userId })
        │
        ▼
[Backend] 
  1. Lookup official price from server-side catalog (Ignore client-sent prices)
  2. If price is ₹0 -> Grant free entitlement immediately
  3. Create order via Razorpay API (or test sandbox)
  4. Save PaymentRecord in Firestore: status = 'created'
  5. Return { orderId, amount, currency, keyId }
        │
        ▼
[Client] Load checkout.razorpay.com/v1/checkout.js & open modal
        │
        ▼
User completes payment via UPI / Card / NetBanking / Wallet
        │
        ▼
[Client] receives { razorpay_payment_id, razorpay_order_id, razorpay_signature }
        │
        ▼
[Client] verifyRazorpayPayment({ orderId, paymentId, signature })
        │
        ▼
[Backend]
  1. Cryptographic HMAC-SHA256 verification:
     HMAC_SHA256(order_id + "|" + payment_id, key_secret) === signature
  2. If signature fails -> Return 400 Bad Signature (no entitlement)
  3. If valid -> Transition payment status: 'created' -> 'captured'
  4. Write Entitlement record to Firestore: `entitlements/{userId_productId}`
  5. Return { success: true, verified: true, entitlement }
        │
        ▼
[Client] Redirects to /payment/success -> Unlocks Premium Fusion Report & AI Narrative
```

---

## 5. Webhook Redundancy (Idempotent Handling)

If the user closes their browser before `verifyRazorpayPayment` finishes, the Razorpay Webhook acts as an automated safety net:
- Receives `payment.captured` with `X-Razorpay-Signature` header.
- Computes `HMAC-SHA256(payload, RAZORPAY_WEBHOOK_SECRET)`.
- If valid: marks `PaymentRecord` as `captured` and provisions `Entitlement`.
- Prevents double-processing via idempotent status checks.

---

## 6. Testing Razorpay in Test Mode

You can test payments using Razorpay's standard test credentials:

- **Cards**: Any 16-digit card starting with `4111 1111 1111 1111`, any future expiry date, CVV `123`, OTP `123456` or `Success` button.
- **UPI**: `success@razorpay` (Instant success) or `failure@razorpay` (To test failed payment flow).
- **NetBanking**: Select any bank $\rightarrow$ Choose **Success** / **Failure** on the mock bank simulator.

---

## 7. Production Migration Checklist

Before switching to live mode:
- [ ] Complete KYC verification on Razorpay dashboard.
- [ ] Generate **Live API Keys** and set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- [ ] Update frontend environment with `VITE_RAZORPAY_KEY_ID` (Live Key).
- [ ] Configure live Webhook URL with HTTPS endpoint and `RAZORPAY_WEBHOOK_SECRET`.
- [ ] Verify Firestore security rules deny direct client writes to `payments`, `entitlements`, and `fusionReports`.
- [ ] Test a live ₹1 or test transaction on production domain.
