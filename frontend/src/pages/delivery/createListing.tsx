import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import type { Recipe } from "@/services/recipeService"
import { toast } from "sonner"

interface LocationState {
  recipe: Recipe | null
  recipeName: string
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

const CreateListing = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { recipe, recipeName } = location.state as LocationState

  const [title, setTitle] = useState(recipeName || "")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageLink, setImageLink] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)

  const handleImageLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageLink(e.target.value)
    setUploadedImage(null)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedImage(file)
      setImageLink(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!recipe) {
      toast.error("No recipe data to list.")
      return
    }

    if (!title.trim() || !description.trim() || !price.trim()) {
      toast.error("Please fill in all the listing details.")
      return
    }

    const listingData = {
      title,
      description,
      price: parseFloat(price),
      image: imageLink || (uploadedImage ? "uploaded" : null),
      recipeName,
      recipe,
    }

    console.log("Listing Data:", listingData)
    toast.success("Listing created successfully! (Data logged to console)")

    // navigate("/marketplace");
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto py-12 px-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-3xl font-extrabold text-gray-900 mb-8 text-center"
        variants={fadeIn}
      >
        Create Recipe Listing
      </motion.h2>

      {recipe ? (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8 bg-white shadow-xl rounded-2xl p-6 border border-gray-100"
          variants={fadeIn}
          transition={{ staggerChildren: 0.1 }}
        >
          <motion.div variants={fadeIn}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Listing Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
              required
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
              required
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:outline-none shadow-sm"
              required
            />
          </motion.div>

          <motion.div variants={fadeIn}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Image
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Enter image link"
                className="flex-1 border border-gray-500 rounded-xl px-3 py-2 shadow-sm focus:ring-primary-500 focus:border-primary-500 "
                value={imageLink || ""}
                onChange={handleImageLinkChange}
              />
              <div>
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer inline-block bg-primary-600 text-gray-700 px-4 py-2 rounded-xl shadow hover:bg-primary-700 transition  border border-gray-300"
                >
                  Upload Image
                </label>
                <input
                  id="image-upload"
                  type="file"
                  className="sr-only text-gray-700"
                  onChange={handleImageUpload}
                  accept="image/*"
                />
              </div>
            </div>
            {uploadedImage && (
              <p className="mt-2 text-sm text-gray-500">{uploadedImage.name}</p>
            )}
            <p className="mt-1 text-sm text-gray-400">
              You can either provide an image link or upload an image.
            </p>
          </motion.div>

          <motion.div variants={fadeIn}>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 text-gray-700  border border-gray-300 font-semibold bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition"
            >
              List Recipe
            </motion.button>
          </motion.div>
        </motion.form>
      ) : (
        <p className="text-center text-gray-500">
          No recipe data available to create a listing.
        </p>
      )}
    </motion.div>
  )
}

export default CreateListing
