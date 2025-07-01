import React, { useEffect, useState } from 'react';
import { FaSearch, FaTrash, FaEye, FaEdit, FaSpinner, FaPlus } from 'react-icons/fa';
import AdminLayout from '../../layouts/admin/AdminLayout';
import axiosConfig from '../../config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [animalFilter, setAnimalFilter] = useState(''); // New state for animal filter
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const categories = [...new Set(products.map(p => p.category))];
  const animals = [...new Set(products.map(p => p.animal).filter(Boolean))]; // Get unique animals

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Number of products per page

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.token) {
        navigate("/login");
        return;
      }

      const res = await axiosConfig.get('/products', {
        headers: { Authorization: `Bearer ${userData.token}` },
      });

      setProducts(res.data.data.products || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError('Erreur lors du chargement des produits');
        toast.error('Erreur lors du chargement des produits');
      }
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Liste des Produits", 14, 16);
    const tableColumn = ["Nom", "Catégorie", "Animal", "Prix", "Quantité"];
    const tableRows = [];

    filteredProducts.forEach(product => {
      const row = [
        product.name,
        product.category,
        product.animal,
        product.price.toFixed(2) + " TND",
        product.quantity
      ];
      tableRows.push(row);
    });
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("produits.pdf");
  };

  const exportExcel = () => {
    const data = filteredProducts.map(product => ({
      Nom: product.name,
      Catégorie: product.category,
      Animal: product.animal,
      Prix: product.price,
      Quantité: product.quantity,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produits");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'produits.xlsx');
  };

  const handleDelete = async (productId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.token) {
        navigate("/login");
        return;
      }

      if (!window.confirm('Voulez-vous vraiment supprimer ce produit ?')) return;

      setDeletingId(productId);

      await axiosConfig.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });

      setProducts(prev => prev.filter(p => p._id !== productId));
      toast.success('Produit supprimé avec succès');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Échec de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                        product.category.toLowerCase().includes(search.toLowerCase()) ||
                        (product.animal && product.animal.toLowerCase().includes(search.toLowerCase())); // Include animal in search
    const matchCategory = categoryFilter ? product.category.toLowerCase() === categoryFilter : true;
    const matchAnimal = animalFilter ? (product.animal && product.animal.toLowerCase() === animalFilter) : true; // Filter by animal
    const matchPriceMin = priceMin ? product.price >= parseFloat(priceMin) : true;
    const matchPriceMax = priceMax ? product.price <= parseFloat(priceMax) : true;
    const matchStock = stockFilter === 'in' ? product.quantity > 0
                        : stockFilter === 'out' ? product.quantity === 0
                        : true;

    return matchSearch && matchCategory && matchAnimal && matchPriceMin && matchPriceMax && matchStock;
  });

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    // Ensure the page number is within valid bounds
    if (pageNumber >= 1 && pageNumber <= Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <AdminLayout>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Gestion des produits</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/addProduit')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <FaPlus /> Ajouter un produit
          </motion.button>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Rechercher par nom, catégorie ou animal..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>

            {/* New Animal Filter */}
            <select
              value={animalFilter}
              onChange={(e) => setAnimalFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les animaux</option>
              {animals.map(animal => (
                <option key={animal} value={animal.toLowerCase()}>{animal}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
              Exporter PDF
            </button>
            <button onClick={exportExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Exporter Excel
            </button>
          </div>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex justify-center py-10">
            <FaSpinner className="animate-spin text-3xl text-blue-500" />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span>{error}</span>
            <button
              onClick={fetchProducts}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-sm"
            >
              Réessayer
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600 text-sm uppercase">
                  <th className="p-4 font-medium">Image</th>
                  <th className="p-4 font-medium">Nom</th>
                  <th className="p-4 font-medium">Catégorie</th>
                  <th className="p-4 font-medium">Animal</th> {/* New column for Animal */}
                  <th className="p-4 font-medium">Prix</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition">
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded-lg border border-gray-200"
                      />
                    </td>
                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                    <td className="p-4 text-gray-600 capitalize">{product.category}</td>
                    <td className="p-4 text-gray-600 capitalize">{product.animal}</td> {/* Display Animal */}
                    <td className="p-4 font-semibold text-green-600">{product.price.toFixed(2)} TND</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.quantity > 0 ? `${product.quantity} en stock` : 'Rupture'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/admin/products/${product._id}`)}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                          title="Voir détails"
                        >
                          <FaEye />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                          className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50"
                          title="Modifier"
                        >
                          <FaEdit />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(product._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                          title="Supprimer"
                          disabled={deletingId === product._id}
                        >
                          {deletingId === product._id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <FaTrash />
                          )}
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
                {currentProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      {products.length === 0
                        ? 'Aucun produit disponible'
                        : 'Aucun résultat pour ces filtres'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {filteredProducts.length > 0 && (
              <div className="flex justify-center mt-6">
                <ul className="flex gap-3">
                  <li>
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Précédent
                    </button>
                  </li>
                  {pageNumbers.map(number => (
                    <li key={number}>
                      <button
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {number}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === pageNumbers.length}
                      className={`px-4 py-2 rounded-lg ${
                        currentPage === pageNumbers.length ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Suivant
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductManagementPage;