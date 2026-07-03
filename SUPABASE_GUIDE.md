# 🇨🇳🎁 Supabase Connection Guide - 1% of China (এক টুকরো চীন)
### Designed By Jamil (01307541441)

This guide documents how to establish a robust full-stack integration with **Supabase**, connecting your React application and Node backend to real-time PostgreSQL databases, authentication services, and row-level storage.

---

## 🛠️ Step 1: Provisioning your Supabase Project
1. Log in to [Supabase Console](https://supabase.com).
2. Click **New Project**, specify your Organization, choose a database name (e.g. `1-percent-china-db`), set a secure password, and pick a cloud region near Bangladesh (e.g. **Singapore (ap-southeast-1)**).
3. Wait for the database container to finish provisioning (usually takes less than 60 seconds).

---

## 💾 Step 2: Injecting the Database Schema
1. Inside your Supabase dashboard, click on the **SQL Editor** tab from the left sidebar.
2. Select **New Query** (or use the Quick Start default).
3. Open the `supabase_schema.sql` file provided at your project root, copy the entire script, and paste it into the query area.
4. Click **Run**. 
5. You should see a success message indicating that the `profiles`, `products`, `orders`, `order_items`, `reviews` tables, RLS security policies, and automatic signup triggers are compiled and operational!

---

## 🔑 Step 3: Configuring Local Environment Variables
To securely link your frontend application with Supabase APIs, configure your API keys in the `.env` configuration.

Add these lines to your `.env` (and document their keys inside `.env.example`):

```env
# Client-side Public Keys (Vite accessible)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key-here

# Server-side Administrative Key (Hidden from browser clients)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-service-role-key-here
```

---

## ⚡ Step 4: Initializing the Supabase Client (React / Node)

### 📦 Install the Supabase SDK
Ensure you have the required packages:
```bash
npm install @supabase/supabase-js
```

### 🧱 Client Initialization Code (`src/lib/supabaseClient.ts`)
Create a single global client export:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase API keys are missing! Offline mock storage is fallback active.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
```

---

## 📡 Step 5: Common Operational Queries Examples

### 1. Fetching Sourced Sku Products Catalog
```typescript
import { supabase } from './supabaseClient';

export async function fetchProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}
```

### 2. Creating an Order with Purchased Items (Transactional Transaction)
```typescript
import { supabase } from './supabaseClient';

export async function checkoutOrder(orderData: any, cartItems: any[]) {
  // 1. Insert master order row
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert([{
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_address: orderData.customerAddress,
      customer_phone: orderData.customerPhone,
      total_amount: orderData.totalAmount,
      payment_method: orderData.paymentMethod,
      payment_status: 'Pending',
      shipping_cost: orderData.shippingCost,
      tracking_number: orderData.trackingNumber,
      timeline: orderData.timeline
    }])
    .select()
    .single();

  if (orderErr) throw orderErr;

  // 2. Map items with order relation key ID
  const itemRows = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product.id,
    variant_id: item.selectedVariant?.id || null,
    variant_name: item.selectedVariant?.name || 'Standard',
    price_bdt: item.product.discountedPrice,
    quantity: item.quantity
  }));

  // 3. Bulk insert items rows
  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(itemRows);

  if (itemsErr) throw itemsErr;
  return order;
}
```

### 3. Subscribing to Live Shipment Logistics Updates (Real-time Timeline tracking)
```typescript
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

export function useLiveOrderTracker(trackingNumber: string) {
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    // 1. Initial fetch
    supabase
      .from('orders')
      .select('*')
      .eq('tracking_number', trackingNumber)
      .single()
      .then(({ data }) => setOrder(data));

    // 2. Subscribe to real-time updates for live cargo GPS changes
    const channel = supabase
      .channel('orders-timeline-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `tracking_number=eq.${trackingNumber}` },
        (payload) => {
          setOrder(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [trackingNumber]);

  return order;
}
```

---
*For support or customization requests regarding database triggers or secure auth setups, contact the Developer (Jamil) directly.*
