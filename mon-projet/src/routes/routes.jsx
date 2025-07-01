import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage";
import Signup from "../pages/Signup";
import Auth from "../pages/auth";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import DashboardAdmin from "../pages/admin/DashboradAdmin";
import UserPage from "../pages/user/UserPage";
import AnnoncesPage from "../pages/user/AnnoncesPage";
import DetailAnnoncePage from "../pages/user/DetailAnnoncePage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import ProductManagementPage from "../pages/admin/ProductManagementPage";
import ProductDetailPage from '../pages/user/ProductDetailPage';
import AdminProductDetailPage from "../pages/admin/AdminProductDetailPage";
import AjouterProduit from "../pages/admin/AjouterProuit";
import ModifierProduit from "../pages/admin/ModifierProduit";
import AnnonceManagementPage from "../pages/admin/AnnonceManagementPage";
import ShopPage from "../pages/user/ShopPage";
import CartPage from "../pages/user/CartPage";
import GestionProfil from "../pages/user/GestionProfil";
import CreerAnnonce from "../pages/user/CreerAnnonce";
import CheckoutDetails from "../pages/user/CheckoutDetails";
import UserOrders from "../pages/user/UserOrders";
import UserDetailsPage from "../pages/admin/UserDetailsPage";


import AdminOrders from "../pages/admin/AdminOrders";
import MesAnnonces from "../pages/user/MesAnnonces";
import MesCommandes from "../pages/user/MesCommandes";
import DetailsCommande from "../pages/user/DetailsCommande";
import CreateAnimalForm from "../pages/user/CreateAnimalForm";


import MesAnimaux from "../pages/user/MesAnimaux";
import DetailAnimal from "../pages/user/DetailAnimal";
import VoirProfilAnimal from "../pages/user/voirProfilAnimal";
import DetailAnnonceAdmin from "../pages/admin/detailAnnonceAdmin";
import ModifierAnnonce from "../pages/user/ModifierAnnonce";
import CandidatsAnnoncePage from "../pages/user/CandidatsAnnoncePage";
import UserProfilePage from "../pages/user/UserProfilPage";
import GestionDemandes from "../pages/admin/GestionDemandes";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/Signup" element={<Signup />} />
        <Route  path="/dashboard-admin" element={<DashboardAdmin/>} />
        <Route  path="/UserPage" element={<UserPage/>} />
        <Route path="/annonce/:id" element={<DetailAnnoncePage />} />
        <Route  path="/annonce" element={<AnnoncesPage/>} />
        <Route    path="/gestionUser" element={<UserManagementPage/>}/>
        <Route  path="/gestionProduit" element={<ProductManagementPage/>} />

        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/admin/products/:productId" element={<AdminProductDetailPage />} />
        <Route path="/admin/addProduit" element={<AjouterProduit />} />
        <Route path="/admin/products/edit/:id" element={<ModifierProduit/>}/>
        <Route path="/admin/gestionAnnonce"  element={<AnnonceManagementPage/>}/>
        <Route path="/admin/detailAnnonce/:id"  element={<DetailAnnonceAdmin/>}/>
        <Route  path="/shop" element={<ShopPage/>}/>
        <Route path="/user/panier" element={<CartPage/>}      />
        <Route path="/user/AjouterAnnonnce" element={<CreerAnnonce/>} />
        <Route path="/user/profil" element={<GestionProfil/>} />
        <Route path="/user/commandeDetails" element={<CheckoutDetails/>} />
        <Route path="/user/AllCommande" element={<UserOrders/>} />
        <Route path="/admin/gestionCommande" element={<AdminOrders/>} />
        <Route path="/user/mes-annonces" element={<MesAnnonces/>} />
        <Route path="/user/mes-commandes" element={<MesCommandes/>}/>
        <Route path="/mes-commandes/:id" element={<DetailsCommande/>}/>
        <Route      path="/admin/users/:id"   element={<UserDetailsPage />}/>

        <Route path="/user/create-animal" element={<CreateAnimalForm />} />
        <Route path="/user/mes-animaux" element={<MesAnimaux />} />
        <Route path="/animal/:id" element={<DetailAnimal />} />
        <Route path="/user/animal/:id" element={<VoirProfilAnimal />} />
        <Route path="/modifier-annonce/:id" element={<ModifierAnnonce />} />
        <Route path="/candidats/:id" element={<CandidatsAnnoncePage />} />
        <Route path="/condidat/profil/:id" element={<UserProfilePage />} />
        <Route path="/admin/gestionDemande" element={<GestionDemandes />} />
      </Routes>
    </Router>
  );
}
