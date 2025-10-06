import { createRootRoute, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <header className="p-4 flex justify-between items-center bg-pink-50 shadow-sm">
        <Link to="/" className="text-2xl font-bold text-pink-600">
          Ɛvivi Bakery
        </Link>
        <nav className="flex gap-4">
          <Link to="/" className="[&.active]:font-bold text-gray-700 hover:text-pink-500">
            Home
          </Link>
          <Link to="/about" className="[&.active]:font-bold text-gray-700 hover:text-pink-500">
            About
          </Link>
          <Link to="/products" className="[&.active]:font-bold text-gray-700 hover:text-pink-500">
            Products
          </Link>
          <Link to="/contact" className="[&.active]:font-bold text-gray-700 hover:text-pink-500">
            Contact
          </Link>
          <Link to="/shop" className="[&.active]:font-bold text-gray-700 hover:text-pink-500">
            Shop
          </Link>
        </nav>
      </header>

      <main className="p-6 min-h-[80vh] bg-white">
        <Outlet />
      </main>

      <footer className="p-4 text-center text-gray-500 border-t">
        © {new Date().getFullYear()} Ɛvivi Bakery — Love at first bite 🍰
      </footer>

      <TanStackRouterDevtools />
    </>
  ),
})
