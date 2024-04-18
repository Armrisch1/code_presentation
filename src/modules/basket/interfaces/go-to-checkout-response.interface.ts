export interface UnavailableProductInterface {
  productId: number;
  requestedQty: number;
  availableQty: number;
}

export interface GoToCheckoutResponseInterface {
  unavailableProducts: UnavailableProductInterface[];
  needToRedirectToCheckout: boolean;
}
