import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const ProductNotification = ({ productId, currentProductId, productName }) => {
  if (productId !== currentProductId) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
    >
      <div className="flex items-center gap-2">
        <span>{productName} a été ajouté au panier</span>
        <Link 
          to="/panier" 
          className="ml-2 underline font-medium hover:text-green-200"
        >
          Voir le panier
        </Link>
      </div>
    </motion.div>
  );
};