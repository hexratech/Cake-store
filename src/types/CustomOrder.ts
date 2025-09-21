export interface CustomCakeItem {
  flavor?: string;
  icing?: string;
  layers?: string | number;
  size?: string;
  toppings?: string[];
  note?: string;
  design?: string;
  designImage?: string;
  estimatedPrice?: number;
}

export interface CustomCakeOrder {
  _id: string;
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress?: string;
  customItems?: CustomCakeItem[];
  totalPrice?: number;
  status?: string;
  createdAt?: string;
}
