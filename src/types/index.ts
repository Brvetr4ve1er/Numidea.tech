
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  // Custom fields
  username?: string;
  shippingAddress?: any; // Define more specifically
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string; // URL to image in Firebase Storage
  price: number;
  specs: Record<string, string>;
  colors: string[];
  tags: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: any; // Define more specifically
  paymentIntentId?: string; // Stripe Payment Intent ID
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceRequest {
    id: string;
    name: string;
    email: string;
    serviceType: 'web-design' | 'branding' | 'automation' | 'print' | 'sourcing';
    message: string;
    status: 'new' | 'contacted' | 'in-progress' | 'completed';
    createdAt: Date;
}
