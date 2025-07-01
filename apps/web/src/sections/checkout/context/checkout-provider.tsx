import PropTypes from "prop-types";
import uniq from "lodash/uniq";
import { useEffect, useMemo, useCallback } from "react";
// hooks
import { useLocalStorage, getStorage } from "@/hooks/use-local-storage";
// routes
import { paths } from "@/routes/paths";
// _mock
import { PRODUCT_CHECKOUT_STEPS } from "@/_mock/_product";
//
import { CheckoutContext } from "./checkout-context";
import { useRouter } from "next/navigation";

// ----------------------------------------------------------------------

const STORAGE_KEY = "checkout";

const initialState = {
  activeStep: 0,
  items: [],
  subTotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  totalItems: 0,
};

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { state, update, reset }: any = useLocalStorage(
    STORAGE_KEY,
    initialState
  );

  const onGetCart = useCallback(() => {
    const totalItems = state.items.reduce(
      (total: any, item: any) => total + item.quantity,
      0
    );

    const subTotal = state.items.reduce(
      (total: any, item: any) => total + item.quantity * item.price,
      0
    );

    update("subTotal", subTotal);
    update("totalItems", totalItems);
    update("billing", state.activeStep === 1 ? null : state.billing);
    update("discount", state.items.length ? state.discount : 0);
    update("shipping", state.items.length ? state.shipping : 0);
    update("total", state.subTotal - state.discount + state.shipping);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.items,
    state.activeStep,
    state.billing,
    state.discount,
    state.shipping,
    state.subTotal,
  ]);

  useEffect(() => {
    const restored = getStorage(STORAGE_KEY);

    if (restored) {
      onGetCart();
    }
  }, [onGetCart]);

  const onAddToCart = useCallback(
    (newItem: any) => {
      const updatedItems = state.items.map((item: any) => {
        if (item.id === newItem.id) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      if (!updatedItems.some((item: any) => item.id === newItem.id)) {
        updatedItems.push(newItem);
      }

      update("items", updatedItems);
    },
    [update, state.items]
  );

  const onDeleteCart = useCallback(
    (itemId: any) => {
      const updatedItems = state.items.filter(
        (item: any) => item.id !== itemId
      );

      update("items", updatedItems);
    },
    [update, state.items]
  );

  const onBackStep = useCallback(() => {
    update("activeStep", state.activeStep - 1);
  }, [update, state.activeStep]);

  const onNextStep = useCallback(() => {
    update("activeStep", state.activeStep + 1);
  }, [update, state.activeStep]);

  const onGotoStep = useCallback(
    (step: any) => {
      update("activeStep", step);
    },
    [update]
  );

  const onIncreaseQuantity = useCallback(
    (itemId: any) => {
      const updatedItems = state.items.map((item: any) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      update("items", updatedItems);
    },
    [update, state.items]
  );

  const onDecreaseQuantity = useCallback(
    (itemId: any) => {
      const updatedItems = state.items.map((item: any) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }
        return item;
      });

      update("items", updatedItems);
    },
    [update, state.items]
  );

  const onCreateBilling = useCallback(
    (address: any) => {
      update("billing", address);

      onNextStep();
    },
    [onNextStep, update]
  );

  const onApplyDiscount = useCallback(
    (discount: any) => {
      update("discount", discount);
    },
    [update]
  );

  const onApplyShipping = useCallback(
    (shipping: any) => {
      update("shipping", shipping);
    },
    [update]
  );

  const completed = state.activeStep === PRODUCT_CHECKOUT_STEPS.length;

  // Reset
  const onReset = useCallback(() => {
    if (completed) {
      reset();
      router.replace(paths.product.root);
    }
  }, [completed, reset, router]);

  const memoizedValue = useMemo(
    () => ({
      ...state,
      completed,
      //
      onAddToCart,
      onDeleteCart,
      //
      onIncreaseQuantity,
      onDecreaseQuantity,
      //
      onCreateBilling,
      onApplyDiscount,
      onApplyShipping,
      //
      onBackStep,
      onNextStep,
      onGotoStep,
      //
      onReset,
    }),
    [
      completed,
      onAddToCart,
      onApplyDiscount,
      onApplyShipping,
      onBackStep,
      onCreateBilling,
      onDecreaseQuantity,
      onDeleteCart,
      onGotoStep,
      onIncreaseQuantity,
      onNextStep,
      onReset,
      state,
    ]
  );

  return (
    <CheckoutContext.Provider value={memoizedValue}>
      {children}
    </CheckoutContext.Provider>
  );
}

CheckoutProvider.propTypes = {
  children: PropTypes.node,
};
