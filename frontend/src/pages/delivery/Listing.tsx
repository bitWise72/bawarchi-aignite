import React, { useState } from "react"

type FoodItem = {
  id: number
  title: string
  price: number
  isVeg: boolean
  image: string
  creator: string
  chefImage: string
}

type CartItem = {
  food: FoodItem
  quantity: number
}

const foodItems: FoodItem[] = [
  {
    id: 1,
    title: "Paneer Butter Masala",
    price: 220,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1701579231378-3726490a407b",
    creator: "Sweta Singh",
    chefImage: "https://avatar.iran.liara.run/public/",
  },
  {
    id: 2,
    title: "Chicken Biryani",
    price: 280,
    isVeg: false,
    image: "https://plus.unsplash.com/premium_photo-1694141251673-1758913ade48",
    creator: "Ayesha Khan",
    chefImage: "https://avatar.iran.liara.run/public",
  },
  {
    id: 3,
    title: "Samosa",
    price: 80,
    isVeg: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950",
    creator: "Sweta Singh",
    chefImage: "https://avatar.iran.liara.run/public",
  },
  {
    id: 4,
    title: "Mutton Rogan Josh",
    price: 350,
    isVeg: false,
    image: "https://images.unsplash.com/photo-1559203244-78de52adba0e",
    creator: "Fatima Khan",
    chefImage: "https://avatar.iran.liara.run/public",
  },
  {
    id: 5,
    title: "Rajma Chawal",
    price: 160,
    isVeg: true,
    image:
      "https://images.unsplash.com/photo-1668236534990-73c4ed23043c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Emily Jones",
    chefImage: "https://avatar.iran.liara.run/public",
  },
  {
    id: 6,
    title: "Fish Curry",
    price: 310,
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1654863404432-cac67587e25d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Fatima Khan",
    chefImage: "https://avatar.iran.liara.run/public",
  },
  {
    id: 7,
    title: "Masala Dosa",
    price: 120,
    isVeg: true,
    image:
      "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Ayesha Khan",
    chefImage: "https://avatar.iran.liara.run/public",
  },
  {
    id: 8,
    title: "Butter Chicken",
    price: 270,
    isVeg: false,
    image:
      "https://images.unsplash.com/photo-1728910107534-e04e261768ae?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    creator: "Sweta Singh",
    chefImage: "https://avatar.iran.liara.run/public",
  },
]

const FoodList: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
const [isCheckingOut, setIsCheckingOut] = useState(false)
const [orderPlaced, setOrderPlaced] = useState(false)

  const handleAddToCart = (food: FoodItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.food.id === food.id)
      if (existing) {
        return prev.map((item) =>
          item.food.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prev, { food, quantity: 1 }]
      }
    })
    setCartOpen(true)
  }

  const updateQuantity = (foodId: number, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.food.id === foodId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }
const handleCheckout = () => {
  setIsCheckingOut(true)
  setOrderPlaced(false)

  setTimeout(() => {
    setIsCheckingOut(false)
    setOrderPlaced(true) // Optional: keep cart visible for a bit, then clear it

    setTimeout(() => {
      setCartItems([])
      setOrderPlaced(false) // reset for next time
      setCartOpen(false) // optionally close cart
    }, 2500)
  }, 2000)
}



  const groupedByChef = foodItems.reduce((acc, item) => {
    if (!acc[item.creator]) acc[item.creator] = []
    acc[item.creator].push(item)
    return acc
  }, {} as Record<string, FoodItem[]>)

  return (
    <div className="min-h-screen bg-orange-50 px-4 py-6 md:px-6 md:py-10 relative overflow-hidden">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
        🍽️ Explore Your Nearest Kitchens
      </h2>

      <div
        className={`transition-all duration-300 ${cartOpen ? "md:mr-80" : ""}`}
      >
        {Object.entries(groupedByChef).map(([chef, foods]) => (
          <div key={chef} className="mb-10">
            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-1">
              <div className="flex items-center gap-2">
                <img
                  src={foods[0].chefImage}
                  alt={chef}
                  className="w-8 h-8 rounded-full"
                />
                <span>{chef}</span>
              </div>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {foods.map((food) => (
                <div
                  key={food.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-[1.02] transition transform duration-300 flex flex-col"
                >
                  <img
                    src={food.image}
                    alt={food.title}
                    className="h-40 w-full object-cover"
                  />
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {food.title}
                      </h3>
                      <span
                        className={`w-3 h-3 rounded-full ${
                          food.isVeg ? "bg-green-600" : "bg-red-600"
                        }`}
                        title={food.isVeg ? "Veg" : "Non-Veg"}
                      ></span>
                    </div>
                    <p className="text-gray-700 font-medium mb-4">
                      ₹{food.price}
                    </p>
                    <button
                      onClick={() => handleAddToCart(food)}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                      Add to Cart 🛒
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">🛒 Your Cart</h3>
          <button
            onClick={() => setCartOpen(false)}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-160px)]">
          {cartItems.length === 0 && !orderPlaced  ? (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={item.food.image}
                  alt={item.food.title}
                  className="w-14 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">
                    {item.food.title}
                  </p>
                  <p className="text-sm text-gray-600">₹{item.food.price}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.food.id, -1)}
                      className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      –
                    </button>
                    <span className="text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.food.id, 1)}
                      className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-4 border-t space-y-2">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>
                ₹
                {cartItems.reduce(
                  (acc, item) => acc + item.food.price * item.quantity,
                  0
                )}
              </span>
            </div>
            <div className="flex justify-between font-semibold text-gray-800">
              <span>Total</span>
              <span>
                ₹
                {(
                  cartItems.reduce(
                    (acc, item) => acc + item.food.price * item.quantity,
                    0
                  ) * 1.05
                ).toFixed(2)}
              </span>
            </div>
            {isCheckingOut && (
              <div className="text-center text-orange-600 font-medium animate-pulse mt-2">
                ⏳ Processing your order...
              </div>
            )}

            {orderPlaced && !isCheckingOut && (
              <div className="text-center text-green-600 font-semibold mt-2">
                🎉 Your order has been placed!
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
            >
              Go to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodList
