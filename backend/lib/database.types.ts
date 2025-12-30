export type OrderRow = {
  id: string;
  product_name: string;
  product_image: string;
  price: string;
  customer_name: string;
  customer_phone: string;
  size: string;
  size_category: "adult" | "kids";
  sleeve_type: "short" | "long";
  transfer_slip_uri: string | null;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at: string;
};

export type OrderInsert = {
  id?: string;
  product_name: string;
  product_image: string;
  price: string;
  customer_name: string;
  customer_phone: string;
  size: string;
  size_category: "adult" | "kids";
  sleeve_type?: "short" | "long";
  transfer_slip_uri?: string | null;
  status?: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  created_at?: string;
};

export type MerchItemRow = {
  id: string;
  name: string;
  price: string;
  image: string;
  created_at: string;
};

export type MerchItemInsert = {
  id?: string;
  name: string;
  price: string;
  image: string;
  created_at?: string;
};

export type HeroRow = {
  id: string;
  name: string;
  position: string;
  number: string;
  image: string;
  created_at: string;
};

export type HeroInsert = {
  id?: string;
  name: string;
  position: string;
  number: string;
  image: string;
  created_at?: string;
};
