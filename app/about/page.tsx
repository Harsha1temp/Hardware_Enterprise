import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Us | Hardware Enterprise",
  description: "Learn more about our hardware enterprise and manufacturing unit",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">About Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-700 mb-4">
            Founded in 2005, Hardware Enterprise has grown from a small local supplier to a leading manufacturer of
            high-quality hardware components. Our journey has been driven by a commitment to excellence, innovation, and
            customer satisfaction.
          </p>
          <p className="text-gray-700">
            Today, we serve clients across various industries, providing both standard and custom hardware solutions
            that meet the highest standards of quality and reliability.
          </p>
        </div>
        <div className="relative h-[300px] rounded-lg overflow-hidden">
          <Image src="/placeholder.svg?height=300&width=500" alt="Our factory" fill className="object-cover" />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700">
          Our mission is to provide high-quality hardware products and manufacturing solutions that help our clients
          succeed in their respective industries. We strive to combine innovative technology with traditional
          craftsmanship to deliver products that exceed expectations.
        </p>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Quality",
              description: "We are committed to maintaining the highest standards in all our products and services.",
            },
            {
              title: "Innovation",
              description: "We continuously explore new technologies and methods to improve our offerings.",
            },
            {
              title: "Integrity",
              description: "We conduct our business with honesty, transparency, and respect for all stakeholders.",
            },
          ].map((value, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-700">{value.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              name: "John Doe",
              position: "CEO & Founder",
              image: "/placeholder.svg?height=200&width=200",
            },
            {
              name: "Jane Smith",
              position: "Head of Manufacturing",
              image: "/placeholder.svg?height=200&width=200",
            },
            {
              name: "Robert Johnson",
              position: "Chief Technology Officer",
              image: "/placeholder.svg?height=200&width=200",
            },
            {
              name: "Emily Brown",
              position: "Customer Relations Manager",
              image: "/placeholder.svg?height=200&width=200",
            },
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative h-[200px] w-[200px] mx-auto rounded-full overflow-hidden mb-4">
                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
              </div>
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-gray-600">{member.position}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

