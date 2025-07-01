import { CartContext } from "@/contexts/cart";
import { useContext } from "react";

export default function useCartContext() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCartContext must be used within a CartProvider");
  }

  return context;
}
