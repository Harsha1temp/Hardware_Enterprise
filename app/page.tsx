import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import FeaturedProducts from "@/components/featured-products"

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Quality Hardware for Your Manufacturing Needs</h1>
            <p className="text-lg text-gray-600 mb-6">
              We provide high-quality hardware components and manufacturing solutions for businesses of all sizes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Hardware manufacturing"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <FeaturedProducts />
      </section>

      {/* Services */}
      <section className="py-12 bg-gray-50 -mx-4 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Custom Manufacturing",
                description: "Tailored hardware solutions for your specific needs",
                icon: "Settings",
              },
              {
                title: "Wholesale Supply",
                description: "Bulk orders at competitive prices for businesses",
                icon: "Package",
              },
              {
                title: "Technical Support",
                description: "24/7 expert assistance for all your hardware needs",
                icon: "HeadsetHelp",
              },
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-xl">
                    {service.icon === "Settings" && "⚙️"}
                    {service.icon === "Package" && "📦"}
                    {service.icon === "HeadsetHelp" && "🎧"}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "John Smith",
              company: "ABC Manufacturing",
              quote: "The quality of hardware components we received exceeded our expectations. Highly recommended!",
            },
            {
              name: "Sarah Johnson",
              company: "XYZ Industries",
              quote: "Their custom manufacturing service helped us solve a complex production challenge.",
            },
            {
              name: "Michael Brown",
              company: "Global Tech Solutions",
              quote:
                "Reliable products, on-time delivery, and excellent customer service. A trusted partner for our business.",
            },
          ].map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <p className="italic mb-4">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary text-white -mx-4 px-4 mt-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join hundreds of businesses that trust us for their hardware and manufacturing needs.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">Create an Account</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

