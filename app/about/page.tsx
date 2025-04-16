import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Mail, MapPin, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">About Om Sai Enterprises</h1>
            <p className="mb-6 text-lg text-muted-foreground">
              Established in 2005, Om Sai Enterprises has been a trusted name in the hardware industry for over 20
              years. We pride ourselves on providing high-quality products, exceptional customer service, and
              competitive pricing.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-medium">Quality Assurance</h3>
                  <p className="text-muted-foreground">
                    All our products undergo rigorous quality checks to ensure they meet the highest standards.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-medium">Customer Satisfaction</h3>
                  <p className="text-muted-foreground">
                    We prioritize customer satisfaction and strive to exceed expectations with every order.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-5 w-5 text-orange-600" />
                <div>
                  <h3 className="font-medium">Competitive Pricing</h3>
                  <p className="text-muted-foreground">
                    We offer the best prices in the market without compromising on quality.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-lg md:h-auto">
            <Image
              src="/logo2.png?height=600&width=800&text=Our+Workshop"
              alt="Om Sai Enterprises workshop"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="mb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Our Story</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Founded by K. Srinivas Reddy in 2005, Om Sai Enterprises began as a small hardware shop in Hyderabad. With a
            vision to provide quality hardware products at affordable prices, we have grown into a trusted supplier for
            businesses and individuals across India.
          </p>
          <div className="relative mx-auto mb-8 h-[300px] w-full max-w-2xl overflow-hidden rounded-lg">
            <Image
              src="/logo2.png?height=600&width=800&text=Our+Journey"
              alt="Om Sai Enterprises journey"
              fill
              className="object-cover"
            />
          </div>
          <p className="text-muted-foreground">
            Over the years, we have expanded our product range, improved our services, and built strong relationships
            with our customers and suppliers. Today, we are proud to be one of the leading hardware suppliers in the
            region, serving thousands of satisfied customers.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Our Team</h2>
          <p className="mx-auto mb-12 max-w-3xl text-lg text-muted-foreground">
            Meet the dedicated professionals who make Om Sai Enterprises a success. Our team combines years of industry
            experience with a passion for customer service.
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "K Srinivas Reddy",
                role: "Founder & CEO",
                bio: "With over 25 years of experience in the hardware industry, Rajesh leads our company with vision and expertise.",
              },
              {
                name: "Bhaskhar",
                role: "Operations Manager",
                bio: "Bhaskhar ensures smooth day-to-day operations and maintains our high standards of service and delivery.",
              },
              {
                name: "Sainath",
                role: "Sales Manager",
                bio: "Sainath leads our sales team with enthusiasm and a deep understanding of customer needs.",
              },
            ].map((member, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src={`/logo2.png?height=150&width=150&text=${member.name[0]}`}
                      alt={member.name}
                      width={150}
                      height={150}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">{member.name}</h3>
                  <p className="mb-3 text-sm text-orange-600">{member.role}</p>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-16">
        <div className="rounded-lg bg-muted p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight">Contact Us</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Have questions or need assistance? Reach out to us through any of the following channels:
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="mr-3 h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-muted-foreground">
                    Sy. No. 157/E, Doolapally Village, IDA Jeedimetla, Hyderabad - 500055
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="mr-3 h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">+91 90109 85402</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="mr-3 h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">omsai5402@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-[300px] overflow-hidden rounded-lg md:h-auto">
              <Image
                src="/logo2.png?height=600&width=800&text=Location+Map"
                alt="Om Sai Enterprises location"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">Business Hours</h2>
          <p className="mb-8 text-lg text-muted-foreground">Visit our store during the following hours:</p>

          <div className="mx-auto max-w-md">
            <div className="rounded-lg border">
              {[
                { day: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
                { day: "Saturday", hours: "10:00 AM - 5:00 PM" },
                { day: "Sunday", hours: "Closed" },
              ].map((schedule, index, arr) => (
                <div key={index} className={`flex justify-between p-4 ${index !== arr.length - 1 ? "border-b" : ""}`}>
                  <span className="font-medium">{schedule.day}</span>
                  <span>{schedule.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
