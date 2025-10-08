import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Ɛvivi Bakery </title>
        <meta
          name="description"
          content="Order delicious cakes, pastries, and desserts from Ɛvivi Bakery — baked fresh in Ghana with love. Custom cakes for birthdays, weddings, and every celebration."
        />
      </Helmet>

      <section className="text-center py-10">
        <h1 className="text-4xl font-bold text-pink-600 mb-4">Welcome to Ɛvivi Bakery 🍰</h1>
        <p className="text-lg text-gray-600">
          Discover the sweetest treats in Ghana — made fresh daily with love and passion.
        </p>
      </section>
    </>
  )
}
