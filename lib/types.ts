export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category?: string
  specifications?: Record<string, string>
  stock?: number
}

export interface Order {
  id: string
  date: string
  total: number
  status: string
  items: {
    id: string
    name: string
    price: number
    quantity: number
    image: string
  }[]
  shippingAddress: {
    name: string
    address: string
    city: string
    state: string
    zipCode: string
  }
}

