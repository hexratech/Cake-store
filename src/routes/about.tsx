import { createFileRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Ɛvivi Bakery | Our Story & Passion</title>
        <meta
          name="description"
          content="Learn about Ɛvivi Bakery’s journey — from our humble beginnings in Ghana to becoming your go-to bakery for cakes, pastries, and desserts."
        />
      </Helmet>

      <section className="max-w-3xl mx-auto py-10 text-center">
        <h1 className="text-3xl font-semibold text-pink-600 mb-4">Our Story</h1>
        <p className="text-gray-700 leading-relaxed">
          Ɛvivi Bakery began with a simple dream — to bring joy to people through the art of baking.
          Every cake and pastry is handcrafted with love, care, and the finest ingredients Ghana has
          to offer.
        </p>
      </section>
    </>
  )
}
