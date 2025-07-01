import { CartProvider } from "./pages/user/CartContext";
import AppRoutes from "./routes/routes";
import { NotificationProvider } from "./hooks/NotificationContext";
export default function App() {
  return (
    //<NotificationProvider>
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  //  </NotificationProvider>
  );
}