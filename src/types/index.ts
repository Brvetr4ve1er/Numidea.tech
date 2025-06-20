
// Firestore data models (example structure)

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  // Custom fields
  username?: string;
  favorites?: string[]; // Array of sticker IDs
  bio?: string;
  // Web3 related
  walletAddress?: string;
}

export interface Sticker {
  id: string;
  name: string;
  description?: string;
  imageUrl: string; // URL to image in Firebase Storage
  tags?: string[]; // For visual search by vibe/aesthetic
  creatorUid?: string; // UID of the user who generated it (if applicable)
  isTemplate?: boolean; // If it's an admin-uploaded template
  price?: number; // If purchasable
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: Array<{ stickerId: string; quantity: number; price: number }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: any; // Define more specifically
  paymentIntentId?: string; // Stripe Payment Intent ID
  createdAt: Date;
  updatedAt: Date;
}

// For AI Sticker generation
export interface StickerGenerationJob {
  id: string;
  userId: string;
  prompt: string;
  vibe?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultUrl?: string; // URL to generated sticker in Storage
  createdAt: Date;
  completedAt?: Date;
}
