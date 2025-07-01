import React from "react";
import { FaHeart, FaShoppingBasket, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="relative bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition-all">
      {/* Image & Wishlist + Cart Buttons */}
      <div className="relative">
        <Link to={`/shop/${product._id}`}>
          <img
            src={product.image || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-48 object-cover rounded-xl"
          />
        </Link>

        <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
          <button className="bg-white p-2 rounded-full shadow hover:text-red-500 transition-colors">
            <FaHeart size={18} />
          </button>
          <button
            className="bg-white p-2 rounded-full shadow hover:text-orange-500 transition-colors"
            onClick={() => addToCart(product)}
          >
            <FaShoppingBasket size={18} />
          </button>
        </div>
      </div>

      {/* Title & Rating */}
      <h3 className="mt-4 font-semibold text-gray-800 text-lg truncate">
        {product.name}
      </h3>
      <div className="flex items-center gap-1 text-yellow-500 mt-1">
        <FaStar className="text-yellow-400" />
        <span className="text-sm font-medium">4.8</span>
        <span className="text-sm text-gray-500">(3)</span>
      </div>

      {/* Price */}
      <div className="mt-2 flex items-center gap-2">
        <h4 className="text-lg font-bold text-orange-500">
          {product.price} €
        </h4>
        <p className="text-sm text-gray-400 line-through">{product.oldPrice || ""}</p>
      </div>
    </div>
  );
};

export default ProductCard;
