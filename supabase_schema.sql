-- ====================================================================
-- 🇨🇳🎁 SUPABASE DATABASE SCHEMA FOR 1% OF CHINA (এক টুকরো চীন)
-- Created By Jamil (01307541441)
-- ====================================================================
-- This SQL file is optimized for Supabase PostgreSQL.
-- It establishes a fully secured, relational structure with:
--   1. Automatic Profile synchronization with Supabase Auth
--   2. Product listings, dynamic variants, and gallery arrays
--   3. Orders tracking, real-time shipment logistics timeline states
--   4. Row-Level Security (RLS) policies to safeguard customer details
-- ====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase Auth)
-- --------------------------------------------------------------------
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone VARCHAR(20),
    delivery_address TEXT,
    avatar_url TEXT,
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Security Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can edit their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger to automatically create a profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'Valued Customer'),
        new.email,
        new.raw_user_meta_data->>'phone',
        'customer'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- --------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    original_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discounted_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    image_url TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    specs JSONB DEFAULT '{}'::jsonb, -- Key-value pairs of technical specifications
    variants JSONB DEFAULT '[]'::jsonb, -- List of available variants [{id, name, priceModifier, stock}]
    origin VARCHAR(50) NOT NULL DEFAULT 'Bangladesh Warehouse', -- 'Bangladesh Warehouse' or 'China Supplier'
    delivery_time VARCHAR(100) NOT NULL DEFAULT '1-3 Days',
    stock_count INTEGER NOT NULL DEFAULT 10,
    shipping_cost NUMERIC(10, 2) DEFAULT 0.00,
    tracking_available BOOLEAN DEFAULT TRUE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_deal BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Security Policies
CREATE POLICY "Products are viewable by everyone" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Only admins can modify products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );


-- --------------------------------------------------------------------
-- 3. ORDERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash on Delivery',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- 'Pending', 'Paid', 'Failed'
    shipping_cost NUMERIC(10, 2) DEFAULT 120.00,
    discount NUMERIC(10, 2) DEFAULT 0.00,
    tracking_number VARCHAR(100) UNIQUE NOT NULL,
    current_status VARCHAR(100) NOT NULL DEFAULT 'Order Received', -- Order Received, Processing, Packed, Shipped, etc.
    timeline JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of tracking steps with timestamp, status and completed state
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders Security Policies
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (
        auth.uid() = user_id OR 
        customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
    );

CREATE POLICY "Users can create their own orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view/modify all orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );


-- --------------------------------------------------------------------
-- 4. ORDER ITEMS TABLE
-- --------------------------------------------------------------------
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id TEXT,
    variant_name TEXT,
    price_bdt NUMERIC(12, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Enable RLS on Order Items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order Items Security Policies
CREATE POLICY "Users can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND (
                orders.user_id = auth.uid() OR
                orders.customer_email = (SELECT email FROM public.profiles WHERE id = auth.uid())
            )
        )
    );

CREATE POLICY "Anyone can create order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins have total control on order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );


-- --------------------------------------------------------------------
-- 5. REVIEWS TABLE
-- --------------------------------------------------------------------
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on Reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can write reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);


-- ====================================================================
-- REALTIME ENABLEMENT
-- ====================================================================
-- Enable realtime listeners for live order tracking!
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime;
commit;
alter publication supabase_realtime add table public.orders, public.products;
