import { useSnackbar } from "notistack";
import { createContext, useMemo, useReducer } from "react";

export const CartContext = createContext({
  cart: [],
});

const initialState = {
  cart: [
    {
      id: "1",
      name: "Product 1",
      quantity: 2,
      mrp: 450999,
      price: 439999,
    },
    {
      id: "2",
      name: "Product 2",
      quantity: 1,
      mrp: 450999,
      price: 439999,
    },
    {
      id: "3",
      name: "Product 3",
      quantity: 1,
      mrp: 450999,
      price: 439999,
    },
    {
      id: "4",
      name: "Product 4",
      quantity: 1,
      mrp: 450999,
      price: 439999,
    },
    {
      id: "5",
      name: "Product 5",
      quantity: 1,
      mrp: 450999,
      price: 439999,
    },
  ],
};

const cartReducer = (state: any, action: any) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, action.payload],
      };
    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item: any) => item.id !== action.payload.id),
      };

    case "UPDATE_CART_ITEM":
      if (action.payload.quantity === 0) {
        return {
          ...state,
          cart: state.cart.filter((item: any) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        cart: state.cart.map((item: any) => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              ...action.payload,
            };
          }
          return item;
        }),
      };
    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { enqueueSnackbar } = useSnackbar();

  // reducer functions
  const addToCart = (item: any) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
    enqueueSnackbar("Added to cart", { variant: "success" });
  };

  const removeFromCart = (item: any) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
    enqueueSnackbar("Removed from cart", { variant: "success" });
  };

  const updateCartItem = (item: any) => {
    dispatch({ type: "UPDATE_CART_ITEM", payload: item });
    if (item.quantity <= 0) {
      enqueueSnackbar("Removed product", { variant: "success" });
    }
  };

  // memoized value
  const memoizedValue = useMemo(
    () => ({
      ...state,
      addToCart,
      removeFromCart,
      updateCartItem,
    }),
    [state]
  );

  return (
    <CartContext.Provider value={memoizedValue}>
      {children}
    </CartContext.Provider>
  );
};
