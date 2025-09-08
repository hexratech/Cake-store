export type Product = {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
};


export const SAMPLE_PRODUCTS: Product[] = [
  {
    _id: "c1",
    name: "Cookies and Cream",
    price: 120,
    image: "https://i.pinimg.com/1200x/50/30/f3/5030f3fe3b4e32a9db8ff09843095493.jpg",
    description: "Light sponge layered with vanilla buttercream and fresh berries.",
  },
  {
    _id: "c2",
    name: "Chocolate Truffle",
    price: 160,
    image: "https://i.pinimg.com/736x/5c/29/b6/5c29b6f5d1d9816a85c180739fa944d2.jpg",
    description: "Decadent chocolate layers with silky ganache.",
  },
  {
    _id: "c3",
    name: "Strawberry Delight",
    price: 140,
    image: "https://i.pinimg.com/736x/e5/b7/e5/e5b7e5d1ad675adc503a49e2daabf23a.jpg",
    description: "Fresh strawberry filling and cream cheese frosting.",
  },
  {
    _id: "c4",
    name: "Red Velvet",
    price: 150,
    image: "https://i.pinimg.com/736x/2e/9b/1e/2e9b1e75f546b99bb29c4564e4ca9f8a.jpg",
    description: "Moist red velvet crumb with cream cheese swirl.",
  },
];
