/**
 * Core Type Definitions for 1% of China
 */

export enum ShippingOrigin {
  BANGLADESH = "Bangladesh Warehouse",
  CHINA = "China Supplier"
}

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number; // to add or subtract from base price
  stock: number;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  originalPrice: number; // in BDT
  discountedPrice: number; // in BDT
  rating: number;
  reviewCount: number;
  image: string;
  gallery?: string[];
  specs: Record<string, string>;
  variants: ProductVariant[];
  reviews: Review[];
  qa: QAItem[];
  origin: ShippingOrigin;
  deliveryTime: string; // "1-3 days" or "25-30 days"
  stockCount: number;
  shippingCost: number; // in BDT
  trackingAvailable: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isDeal?: boolean;
  tags: string[];
}

export interface CartItem {
  product: Product;
  selectedVariant: ProductVariant | null;
  quantity: number;
}

export enum OrderStatus {
  RECEIVED = "Order Received",
  PROCESSING = "Processing",
  PACKED = "Packed",
  SHIPPED = "Shipped",
  IN_TRANSIT = "In Transit",
  CUSTOMS = "CustomS Clearance",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered"
}

export interface TrackingStep {
  status: OrderStatus;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number; // in BDT
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  shippingCost: number;
  discount: number;
  trackingNumber: string;
  currentStatus: OrderStatus;
  timeline: TrackingStep[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

export type CurrencyCode = "BDT" | "USD" | "CNY";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to BDT (1 BDT = rate currency)
}

export type LanguageCode = "en" | "bn" | "zh" | "ar" | "hi";

export interface LanguageConfig {
  code: LanguageCode;
  name: string;
}

// ==========================================
// Relational Database Schema Emulation Types
// ==========================================

export enum AdminRole {
  SUPER_ADMIN = "Super Admin",
  ADMIN = "Admin",
  MANAGER = "Manager",
  WAREHOUSE_STAFF = "Warehouse Staff",
  CUSTOMER_SUPPORT = "Customer Support",
  MARKETING_STAFF = "Marketing Staff",
  CUSTOMER = "Customer"
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto: string;
  role: AdminRole;
  createdAt: string;
  lastLogin: string;
  emailVerified: boolean;
  loyaltyPoints: number;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface RolePermissionMatrix {
  role: AdminRole;
  permissions: string[]; // List of permission IDs
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  origin: ShippingOrigin;
  stockCount: number;
  activeStaff: number;
}

export interface Supplier {
  id: string;
  name: string;
  country: string;
  contact: string;
  performanceScore: number;
  activeOrdersCount: number;
}

export interface Coupon {
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  value: number;
  minPurchase: number;
  active: boolean;
  usedCount: number;
}

export interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: "OPEN" | "RESOLVED" | "PENDING";
  createdAt: string;
  reply?: string;
}

export interface ActivityLog {
  id: string;
  userEmail: string;
  role: string;
  action: string;
  details: string;
  ip: string;
  timestamp: string;
}

export interface LoginHistory {
  id: string;
  userEmail: string;
  ip: string;
  timestamp: string;
  twoFactorPassed: boolean;
}

