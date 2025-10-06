export type NavLink = {
  id: string;
  label: string;
  path: string; // always required
};

export const NAV_LINKS: NavLink[] = [
  { id: "home", label: "Home", path: "/" },
  { id: "about", label: "About", path: "/about" },
  { id: "products", label: "Products", path: "/products" },
  { id: "shop", label: "Shop", path: "/shop" },
  { id: "contact", label: "Contact", path: "/contact" },
];
