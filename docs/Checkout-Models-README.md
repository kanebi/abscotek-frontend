### Checkout, Cart, Order, and Delivery Models (JSON Schemas)

This document defines JSON Schemas for the domain models involved in cart, checkout, delivery addresses, and delivery methods, inferred from the current UI and services.

- Models included: `User`, `DeliveryAddress`, `DeliveryMethod`, `Cart`, `CartItem`, `Order`, `OrderItem`, `Payment`
- Payloads included: `CreateOrderRequest`
- Money values are in minor or major units depending on backend; UI assumes major units and always displays using `AmountCurrency` with conversion based on user currency.

#### Conventions
- All `currency` fields should use ISO codes (e.g., "USDC", "USD", "NGN", "EUR").
- IDs may appear as `_id` (backend) or `id` (frontend). Where both are present, `_id` is the canonical backend identifier.
- Timestamps use ISO 8601 `date-time` strings.

---

#### User
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/user.json",
  "title": "User",
  "type": "object",
  "properties": {
    "_id": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "firstName": { "type": "string" },
    "lastName": { "type": "string" },
    "walletAddress": { "type": "string", "pattern": "^0x[0-9a-fA-F]{40}$" },
    "areaNumber": { "type": "string", "description": "Phone country/area code, e.g. +234" },
    "phoneNumber": { "type": "string", "pattern": "^[0-9]{7,14}$" },
    "addresses": {
      "type": "array",
      "items": { "$ref": "https://abscotek.com/schemas/delivery-address.json" }
    },
    "preferences": {
      "type": "object",
      "properties": {
        "currency": { "type": "string", "enum": ["USDC", "USD", "NGN", "EUR"] }
      },
      "additionalProperties": false
    },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["email"],
  "additionalProperties": true
}
```

---

#### DeliveryAddress
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/delivery-address.json",
  "title": "DeliveryAddress",
  "type": "object",
  "properties": {
    "_id": { "type": "string" },
    "id": { "type": "string", "description": "Frontend identifier (optional)" },
    "firstName": { "type": "string" },
    "lastName": { "type": "string" },
    "email": { "type": "string", "format": "email" },
    "areaNumber": { "type": "string", "default": "+234", "description": "E.g. +234" },
    "phoneNumber": { "type": "string", "pattern": "^[0-9]{7,14}$" },
    "streetAddress": { "type": "string" },
    "city": { "type": "string", "enum": ["lagos", "abuja", "port-harcourt", "kano"], "default": "lagos" },
    "state": { "type": "string", "enum": ["lagos", "fct", "rivers", "kano"], "default": "lagos" },
    "country": { "type": "string", "default": "NG" },
    "isDefault": { "type": "boolean", "default": false },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["firstName", "lastName", "email", "areaNumber", "phoneNumber", "streetAddress", "city", "state"],
  "additionalProperties": false
}
```

---

#### DeliveryMethod
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/delivery-method.json",
  "title": "DeliveryMethod",
  "type": "object",
  "properties": {
    "_id": { "type": "string" },
    "name": { "type": "string" },
    "description": { "type": "string" },
    "price": { "type": "number", "minimum": 0 },
    "currency": { "type": "string", "enum": ["USDC", "USD", "NGN", "EUR"], "default": "USDC" },
    "estimatedDeliveryTime": { "type": "string", "examples": ["1-2 days", "3-5 business days"] },
    "targetRegion": { "type": "string", "enum": ["lagos", "other-state"], "description": "Optional segmentation used in UI" },
    "active": { "type": "boolean", "default": true },
    "sortOrder": { "type": "integer", "default": 0 },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["name", "price"],
  "additionalProperties": false
}
```

---

#### Product (snapshot used in cart/order)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/product-snapshot.json",
  "title": "ProductSnapshot",
  "type": "object",
  "properties": {
    "_id": { "type": "string" },
    "name": { "type": "string" },
    "price": { "type": "number" },
    "currency": { "type": "string", "enum": ["USDC", "USD", "NGN", "EUR"], "default": "USDC" },
    "image": { "type": "string", "format": "uri" },
    "images": { "type": "array", "items": { "type": "string", "format": "uri" } },
    "badge": { "type": "string" },
    "outOfStock": { "type": "boolean" }
  },
  "required": ["_id", "name", "price"],
  "additionalProperties": true
}
```

---

#### CartItem
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/cart-item.json",
  "title": "CartItem",
  "type": "object",
  "properties": {
    "productId": { "type": "string" },
    "product": { "$ref": "https://abscotek.com/schemas/product-snapshot.json" },
    "quantity": { "type": "integer", "minimum": 1 },
    "unitPrice": { "type": "number", "minimum": 0 },
    "currency": { "type": "string", "enum": ["USDC", "USD", "NGN", "EUR"] },
    "totalPrice": { "type": "number", "readOnly": true }
  },
  "required": ["productId", "quantity"],
  "additionalProperties": true
}
```

---

#### Cart
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/cart.json",
  "title": "Cart",
  "type": "object",
  "properties": {
    "_id": { "type": "string" },
    "userId": { "type": "string" },
    "walletAddress": { "type": "string", "pattern": "^0x[0-9a-fA-F]{40}$" },
    "items": { "type": "array", "items": { "$ref": "https://abscotek.com/schemas/cart-item.json" } },
    "currency": { "type": "string", "enum": ["USDC", "USD", "NGN", "EUR"], "default": "USDC" },
    "subtotal": { "type": "number", "readOnly": true },
    "deliveryFee": { "type": "number", "readOnly": true, "default": 0 },
    "discount": { "type": "number", "readOnly": true, "default": 0 },
    "total": { "type": "number", "readOnly": true },
    "selectedAddressId": { "type": "string" },
    "selectedDeliveryMethodId": { "type": "string" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["items"],
  "additionalProperties": true
}
```

---

#### OrderItem
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/order-item.json",
  "title": "OrderItem",
  "type": "object",
  "properties": {
    "productId": { "type": "string" },
    "product": { "$ref": "https://abscotek.com/schemas/product-snapshot.json" },
    "quantity": { "type": "integer", "minimum": 1 },
    "unitPrice": { "type": "number", "minimum": 0 },
    "currency": { "type": "string", "enum": ["USDC", "USD", "NGN", "EUR"] },
    "totalPrice": { "type": "number", "readOnly": true }
  },
  "required": ["productId", "quantity"],
  "additionalProperties": true
}
```

---

#### Payment
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/payment.json",
  "title": "Payment",
  "type": "object",
  "properties": {
    "transactionId": { "type": "string" },
    "method": { "type": "string", "enum": ["USDC", "CRYPTO", "CARD", "BANK_TRANSFER", "CASH_ON_DELIVERY"] },
    "provider": { "type": "string", "description": "Gateway/provider identifier (e.g., walletconnect)" },
    "amount": { "type": "number" },
    "currency": { "type": "string", "enum": ["USDC", "USD", "NGN", "EUR"] },
    "status": { "type": "string", "enum": ["pending", "confirmed", "failed", "refunded"] },
    "paidAt": { "type": "string", "format": "date-time" },
    "metadata": { "type": "object", "additionalProperties": true }
  },
  "required": ["method", "amount", "currency"],
  "additionalProperties": true
}
```

---

#### Order
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/order.json",
  "title": "Order",
  "type": "object",
  "properties": {
    "_id": { "type": "string" },
    "userId": { "type": "string" },
    "walletAddress": { "type": "string", "pattern": "^0x[0-9a-fA-F]{40}$" },
    "items": {
      "type": "array",
      "items": { "$ref": "https://abscotek.com/schemas/order-item.json" },
      "minItems": 1
    },
    "shippingAddress": { "$ref": "https://abscotek.com/schemas/delivery-address.json" },
    "deliveryMethod": { "$ref": "https://abscotek.com/schemas/delivery-method.json" },
    "subtotal": { "type": "number" },
    "deliveryFee": { "type": "number" },
    "discount": { "type": "number", "default": 0 },
    "totalAmount": { "type": "number" },
    "currency": { "type": "string", "enum": ["USDC", "USD", "NGN", "EUR"], "default": "USDC" },
    "status": { "type": "string", "enum": ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"], "default": "pending" },
    "payment": { "$ref": "https://abscotek.com/schemas/payment.json" },
    "createdAt": { "type": "string", "format": "date-time" },
    "updatedAt": { "type": "string", "format": "date-time" }
  },
  "required": ["items", "subtotal", "totalAmount", "currency", "status"],
  "additionalProperties": true
}
```

---

#### CreateOrderRequest (payload from Checkout)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://abscotek.com/schemas/create-order-request.json",
  "title": "CreateOrderRequest",
  "type": "object",
  "properties": {
    "products": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "properties": {
          "productId": { "type": "string" },
          "quantity": { "type": "integer", "minimum": 1 }
        },
        "required": ["productId", "quantity"],
        "additionalProperties": false
      }
    },
    "shippingAddressId": { "type": "string" },
    "shippingAddress": { "$ref": "https://abscotek.com/schemas/delivery-address.json" },
    "deliveryMethodId": { "type": "string" },
    "currency": { "type": "string", "enum": ["USDC", "USD", "NGN", "EUR"] },
    "totalAmount": { "type": "number", "description": "Client-calculated total, server should re-verify" },
    "walletAddress": { "type": "string", "pattern": "^0x[0-9a-fA-F]{40}$" },
    "notes": { "type": "string" }
  },
  "anyOf": [
    { "required": ["shippingAddressId"] },
    { "required": ["shippingAddress"] }
  ],
  "required": ["products"],
  "additionalProperties": false
}
```

---

#### Examples

DeliveryAddress example
```json
{
  "id": "addr_123",
  "firstName": "Ada",
  "lastName": "Lovelace",
  "email": "ada@example.com",
  "areaNumber": "+234",
  "phoneNumber": "8012345678",
  "streetAddress": "42 Alpha Street",
  "city": "lagos",
  "state": "lagos",
  "country": "NG",
  "isDefault": true
}
```

DeliveryMethod example
```json
{
  "_id": "dm_lagos",
  "name": "Lagos: 1-2 days",
  "price": 5000,
  "currency": "NGN",
  "estimatedDeliveryTime": "1-2 days",
  "targetRegion": "lagos",
  "active": true
}
```

Cart example
```json
{
  "_id": "cart_abc",
  "walletAddress": "0x0123456789abcdef0123456789abcdef01234567",
  "currency": "USDC",
  "items": [
    {
      "productId": "p_1",
      "product": { "_id": "p_1", "name": "Phone X", "price": 300, "currency": "USDC", "image": "/img/1.png" },
      "quantity": 2,
      "unitPrice": 300
    }
  ]
}
```

Order example
```json
{
  "_id": "ord_123",
  "walletAddress": "0x0123456789abcdef0123456789abcdef01234567",
  "items": [
    { "productId": "p_1", "product": { "_id": "p_1", "name": "Phone X", "price": 300 }, "quantity": 2, "unitPrice": 300 }
  ],
  "shippingAddress": { "id": "addr_123", "firstName": "Ada", "lastName": "Lovelace", "email": "ada@example.com", "areaNumber": "+234", "phoneNumber": "8012345678", "streetAddress": "42 Alpha Street", "city": "lagos", "state": "lagos", "country": "NG" },
  "deliveryMethod": { "_id": "dm_lagos", "name": "Lagos: 1-2 days", "price": 5000, "currency": "NGN", "estimatedDeliveryTime": "1-2 days" },
  "subtotal": 600,
  "deliveryFee": 5000,
  "discount": 0,
  "totalAmount": 5600,
  "currency": "USDC",
  "status": "pending"
}
```

