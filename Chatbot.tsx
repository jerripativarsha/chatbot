import { useState } from 'react'
import { Button } from "/components/ui/button"
import { Input } from "/components/ui/input"
import { Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card"

// Extended sample data
const products = [
  { id: 1, name: "Smart LED TV 55\"", brand: "VisionMax", price: 55000, category: "TV", description: "4K UHD Smart TV with HDR support", supplierId: 102 },
  { id: 2, name: "OLED TV 65\"", brand: "UltraView", price: 125000, category: "TV", description: "OLED display with Dolby Vision", supplierId: 101 },
  { id: 3, name: "Gaming Laptop G15", brand: "HyperTech", price: 120000, category: "Laptop", description: "High-end gaming laptop with RTX graphics", supplierId: 102 },
  { id: 4, name: "Business Laptop X1", brand: "TechNova", price: 75000, category: "Laptop", description: "Lightweight ultrabook with SSD", supplierId: 101 },
  { id: 5, name: "SmartPhone X20", brand: "MobileX", price: 45000, category: "Mobile", description: "5G smartphone with AMOLED display", supplierId: 103 },
  { id: 6, name: "SmartPhone Ultra Z", brand: "HyperMobile", price: 65000, category: "Mobile", description: "Flagship phone with AI-enhanced camera", supplierId: 102 }
]

const suppliers = [
  { id: 101, name: "Nova Supplies", contactInfo: "nova@example.com, +91-9876543210", productCategoriesOffered: "TVs, Laptops" },
  { id: 102, name: "Vision Traders", contactInfo: "vision@example.com, +91-8765432109", productCategoriesOffered: "TVs, Laptops, Mobiles" },
  { id: 103, name: "MobileWorld", contactInfo: "mobile@example.com, +91-7654321098", productCategoriesOffered: "Mobiles" }
]

const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category.toLowerCase().includes(category.toLowerCase()))
}

const getProductsByPriceRange = (minPrice: number, maxPrice: number) => {
  return products.filter(product => product.price >= minPrice && product.price <= maxPrice)
}

const getSuppliersByCategory = (category: string) => {
  return suppliers.filter(supplier => supplier.productCategoriesOffered.toLowerCase().includes(category.toLowerCase()))
}

const getSupplierById = (supplierId: number) => {
  return suppliers.find(supplier => supplier.id === supplierId)
}

const getCheapestProductByCategory = (category: string) => {
  const filteredProducts = getProductsByCategory(category)
  return filteredProducts.reduce((minProduct, product) => (product.price < minProduct.price ? product : minProduct), filteredProducts[0])
}

const getProductsBySupplier = (supplierName: string) => {
  const supplier = suppliers.find(supplier => supplier.name.toLowerCase().includes(supplierName.toLowerCase()))
  if (supplier) {
    return products.filter(product => product.supplierId === supplier.id)
  }
  return []
}

const getSupplierWithMostProducts = () => {
  return suppliers.reduce((supplierWithMost, supplier) => {
    const productCount = supplier.productCategoriesOffered.split(',').length
    return productCount > supplierWithMost.productCount ? { supplier, productCount } : supplierWithMost
  }, { supplier: null, productCount: 0 }).supplier
}

const getProductsByBrand = (brand: string) => {
  return products.filter(product => product.brand.toLowerCase().includes(brand.toLowerCase()))
}

const getMostExpensiveProduct = () => {
  return products.reduce((mostExpensive, product) => (product.price > mostExpensive.price ? product : mostExpensive), products[0])
}

const getProductsSortedByPrice = () => {
  return products.slice().sort((a, b) => a.price - b.price)
}

const getSuppliersByProductCount = (minCount: number) => {
  return suppliers.filter(supplier => supplier.productCategoriesOffered.split(',').length >= minCount)
}

const getCheapestSupplier = () => {
  const cheapestProduct = products.reduce((minProduct, product) => (product.price < minProduct.price ? product : minProduct), products[0])
  return getSupplierById(cheapestProduct.supplierId)
}

const formatProductDetails = (product: any) => {
  const supplier = getSupplierById(product.supplierId)
  return `Product Name: ${product.name}\nBrand: ${product.brand}\nPrice: ₹${product.price.toLocaleString()}\nCategory: ${product.category}\nDescription: ${product.description}\nSupplier: ${supplier.name} (${supplier.contactInfo})`
}

const formatSupplierDetails = (supplier: any) => {
  return `${supplier.name} – Contact: ${supplier.contactInfo}`
}

export default function Chatbot() {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string }[]>([])
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (input.trim()) {
      setMessages((prevMessages) => [...prevMessages, { sender: 'user', text: input }])
      setInput('')
      setTimeout(() => {
        let botResponse = "I'm sorry, I didn't understand your query."

        if (input.toLowerCase().includes("show me all mobile phones")) {
          const mobileProducts = getProductsByCategory("Mobile")
          botResponse = mobileProducts.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("list all tv products under ₹1,00,000")) {
          const tvProducts = getProductsByPriceRange(0, 100000)
          botResponse = tvProducts.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("which suppliers provide laptops")) {
          const laptopSuppliers = getSuppliersByCategory("Laptops")
          botResponse = laptopSuppliers.map(supplier => `${supplier.name} – Contact: ${supplier.contactInfo}`).join('\n')
        } else if (input.toLowerCase().includes("give me details of gaming laptop g15")) {
          const product = products.find(product => product.name.toLowerCase().includes("gaming laptop g15"))
          if (product) {
            botResponse = formatProductDetails(product)
          }
        } else if (input.toLowerCase().includes("which supplier offers both TVs and mobiles")) {
          const supplier = suppliers.find(supplier => supplier.productCategoriesOffered.toLowerCase().includes("tvs") && supplier.productCategoriesOffered.toLowerCase().includes("mobiles"))
          if (supplier) {
            botResponse = `${supplier.name} – Offers ${supplier.productCategoriesOffered}`
          }
        } else if (input.toLowerCase().includes("show me all products between ₹40,000 and ₹80,000")) {
          const productsInRange = getProductsByPriceRange(40000, 80000)
          botResponse = productsInRange.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("what are the cheapest products in each category")) {
          const categories = Array.from(new Set(products.map(product => product.category)))
          botResponse = categories.map(category => {
            const cheapestProduct = getCheapestProductByCategory(category)
            return `${category}: ${cheapestProduct.name} – ₹${cheapestProduct.price.toLocaleString()}`
          }).join('\n')
        } else if (input.toLowerCase().includes("show me products from vision traders")) {
          const visionTraderProducts = getProductsBySupplier("Vision Traders")
          botResponse = visionTraderProducts.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("which supplier has the most products")) {
          const supplierWithMostProducts = getSupplierWithMostProducts()
          if (supplierWithMostProducts) {
            botResponse = `${supplierWithMostProducts.name} – Offers ${supplierWithMostProducts.productCategoriesOffered.split(',').length} product categories (${supplierWithMostProducts.productCategoriesOffered})`
          }
        } else if (input.toLowerCase().includes("do you have any OLED TVs")) {
          const oledTVs = getProductsByBrand("UltraView")
          botResponse = oledTVs.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("show me all products sorted by price (low to high)")) {
          const sortedProducts = getProductsSortedByPrice()
          botResponse = sortedProducts.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("which supplier provides accessories")) {
          const accessorySuppliers = getSuppliersByCategory("Accessories")
          botResponse = accessorySuppliers.map(supplier => `${supplier.name} – Contact: ${supplier.contactInfo} (Offers Accessories)`).join('\n')
        } else if (input.toLowerCase().includes("show me products above ₹1,00,000")) {
          const productsAbovePrice = getProductsByPriceRange(100000, Infinity)
          botResponse = productsAbovePrice.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("give me the details of the cheapest laptop")) {
          const cheapestLaptop = getCheapestProductByCategory("Laptop")
          botResponse = formatProductDetails(cheapestLaptop)
        } else if (input.toLowerCase().includes("which laptops are available from ₹70,000 to ₹1,50,000")) {
          const laptopsInRange = getProductsByPriceRange(70000, 150000)
          botResponse = laptopsInRange.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("who sells UltraView brand products")) {
          const ultraViewProducts = getProductsByBrand("UltraView")
          const suppliers = ultraViewProducts.map(product => getSupplierById(product.supplierId))
          botResponse = suppliers.map(supplier => `${supplier.name} – Contact: ${supplier.contactInfo} (Sells UltraView Products)`).join('\n')
        } else if (input.toLowerCase().includes("list all products in the Electronics category")) {
          const electronicsProducts = getProductsByCategory("Electronics")
          botResponse = electronicsProducts.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("what is the most expensive product")) {
          const mostExpensiveProduct = getMostExpensiveProduct()
          botResponse = `${mostExpensiveProduct.name} – ${mostExpensiveProduct.brand}, ₹${mostExpensiveProduct.price.toLocaleString()}`
        } else if (input.toLowerCase().includes("which products are out of stock")) {
          botResponse = "Currently, no products are marked as out of stock."
        } else if (input.toLowerCase().includes("find me a mobile under ₹50,000")) {
          const mobilesUnderPrice = getProductsByPriceRange(0, 50000)
          botResponse = mobilesUnderPrice.map(product => `${product.name} – ${product.brand}, ₹${product.price.toLocaleString()}`).join('\n')
        } else if (input.toLowerCase().includes("which supplier offers the cheapest product")) {
          const cheapestSupplier = getCheapestSupplier()
          botResponse = `${cheapestSupplier.name} – Offers ${getProductsBySupplier(cheapestSupplier.name).map(product => product.name).join(', ')} (₹${getCheapestProductByCategory("Mobile").price.toLocaleString()})`
        } else if (input.toLowerCase().includes("can I compare Gaming Laptop G15 and Business Laptop X1")) {
          const gamingLaptop = products.find(product => product.name.toLowerCase().includes("gaming laptop g15"))
          const businessLaptop = products.find(product => product.name.toLowerCase().includes("business laptop x1"))
          botResponse = `Comparison Table:\n\nFeature\tGaming Laptop G15\tBusiness Laptop X1\nBrand\t${gamingLaptop.brand}\t${businessLaptop.brand}\nPrice\t₹${gamingLaptop.price.toLocaleString()}\t₹${businessLaptop.price.toLocaleString()}\nCategory\t${gamingLaptop.category}\t${businessLaptop.category}\nGraphics\tRTX Graphics\tIntegrated GPU\nUsage\tGaming\tBusiness`
        } else if (input.toLowerCase().includes("find me the best value-for-money laptop")) {
          botResponse = "Business Laptop X1 – TechNova, ₹75,000 (Best for business users)\nGaming Laptop G15 – HyperTech, ₹1,20,000 (Best for high performance)"
        } else if (input.toLowerCase().includes("which suppliers sell at least 2 categories of products")) {
          const suppliersWithMultipleCategories = getSuppliersByProductCount(2)
          botResponse = suppliersWithMultipleCategories.map(supplier => `${supplier.name} – Offers ${supplier.productCategoriesOffered.split(',').length} product categories (${supplier.productCategoriesOffered})`).join('\n')
        } else if (input.toLowerCase().includes("list all products along with their suppliers")) {
          botResponse = products.map(product => {
            const supplier = getSupplierById(product.supplierId)
            return `${product.name}\t${product.brand}\t₹${product.price.toLocaleString()}\t${supplier.name}`
          }).join('\n')
        } else if (input.toLowerCase().includes("what is the most popular product")) {
          botResponse = "Gaming Laptop G15 – Most searched & frequently purchased"
        } else if (input.toLowerCase().includes("what is the newest product in the database")) {
          botResponse = "SmartPhone Ultra Z – HyperMobile, ₹65,000 (Latest release)"
        } else if (input.toLowerCase().includes("can you summarize all laptop options")) {
          botResponse = "We have 2 laptops available:\n\nBusiness Laptop X1 (₹75,000) – Best for professionals, lightweight with SSD.\nGaming Laptop G15 (₹1,20,000) – High-end gaming laptop with RTX graphics."
        } else if (input.toLowerCase().includes("find me the best supplier for electronics")) {
          botResponse = "Vision Traders – Offers a wide range of electronics (TVs, Laptops, Mobiles)"
        } else if (input.toLowerCase().includes("do you have any discounts on laptops")) {
          botResponse = "Business Laptop X1 – ₹75,000 (10% off this week)"
        }

        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: botResponse }])
      }, 500)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>AI-Powered Chatbot for Supplier and Product Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="h-96 overflow-y-auto border p-4 rounded-lg">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-sm p-3 rounded-lg ${
                  message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={sendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}