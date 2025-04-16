import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PenToolIcon as Tool, Truck, Users } from "lucide-react"; // Assuming PenToolIcon is aliased as Tool

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 py-20 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Quality Hardware Solutions for Your Business
              </h1>
              <p className="text-xl text-gray-300">
                Om Sai Enterprises provides premium hardware products with reliable service and competitive pricing.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/products">
                    Browse Products <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-gray-900"
                >
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="/logo2.png" // Make sure this image exists in public/
                alt="Hardware products showcase"
                width={500}
                height={400}
                className="rounded-lg shadow-xl"
                priority // Added priority for LCP element
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose Om Sai Enterprises?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We pride ourselves on quality, reliability, and exceptional service
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-orange-100 p-3">
                <Tool className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Premium Quality</h3>
              <p className="text-gray-600">
                All our products meet the highest industry standards and come with quality assurance.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-orange-100 p-3">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Fast Delivery</h3>
              <p className="text-gray-600">
                We ensure timely delivery of all orders with our efficient logistics network.
              </p>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6 text-center shadow-md">
              <div className="mb-4 rounded-full bg-orange-100 p-3">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Customer Support</h3>
              <p className="text-gray-600">
                Our dedicated team is always ready to assist you with any queries or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === Popular Products Section Removed === */}

      {/* Testimonials Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What Our Customers Say</h2>
            <p className="mt-4 text-lg text-gray-600">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sainath Reddy",
                company: "Venkateswara Enterprises",
                quote:
                  "Om Sai Enterprises has been our trusted hardware supplier for over 3 years. Their products are reliable and their service is exceptional.",
                avatarInitial: "S",
              },
              {
                name: "Vijay Bhaskhar",
                company: "Vijay Industries",
                quote:
                  "The quality of hardware products from Om Sai Enterprises is unmatched. We've never had any issues with their supplies.",
                avatarInitial: "V",
              },
              {
                name: "Ramana Reddy",
                company: "Sri Krishna Engineering Works",
                quote:
                  "As a retailer, I appreciate the consistent quality and competitive pricing offered by Om Sai Enterprises. Highly recommended!",
                 avatarInitial: "R",
              },
            ].map((testimonial, index) => (
              <div key={index} className="rounded-lg bg-gray-50 p-6 shadow-md">
                <div className="mb-4 text-orange-600">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i} className="text-xl">
                        ★
                      </span>
                    ))}
                </div>
                <p className="mb-4 italic text-gray-600">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-300 text-gray-600">
                    <span className="text-xl font-medium">{testimonial.avatarInitial}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to get started?</h2>
              <p className="mt-4 text-lg text-orange-100">
                Register now to browse our full catalog and place your first order.
              </p>
            </div>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button asChild size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                <Link href="/register">
                  Register Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-orange-600"
              >
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}