document.addEventListener('alpine:init', () => {

  const shippingThreshold = window.freeShippingThreshold || 50;

  Alpine.store('cart', {
    items: [],
    itemsCount: 0,
    totalPrice: '0.00',
    isCartOpen: false,
    isLoading: false,
    errorMessage: '',

    get remainingForFreeShipping() {
      const total = parseFloat(this.totalPrice);
      const remaining = shippingThreshold - total;

      if (remaining <= 0) return '0.00';

      return remaining.toFixed(2);
    },

    get isFreeShippingUnlocked() {
      return parseFloat(this.totalPrice) >= shippingThreshold;
    },

    loadCart() {
      this.isLoading = true;
      this.errorMessage = '';
      fetch('/cart.js')
        .then((response) => response.json())
        .then((data) => {
          this.items = data.items;
          this.updateItemsCount();
          this.updateTotalPrice();
        })
        .catch(() => {
          this.errorMessage = 'Failed to load the cart. Please try again.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    addToCart(productId) {
      this.isLoading = true;
      this.errorMessage = '';
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId, quantity: 1 }),
      })
        .then(() => {
          this.loadCart();
          this.toggleCart();
        })
        // .then(response => {
        //   console.log(response.json());
        //   return response.json();
        // })
        .catch(() => {
          this.errorMessage = 'Failed to add the product. Please try again.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    addMultiplyToCart(productsArr) {
      this.isLoading = true;
      this.errorMessage = '';

      let formData = {
        items: productsArr,
      };

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(() => {
          this.loadCart();
          window.location.href = '/checkout';
        })
        .catch(() => {
          this.errorMessage = 'Failed to add the product. Please try again.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    updateCart(itemId, quantity) {
      this.isLoading = true;
      this.errorMessage = '';

      fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: String(itemId), quantity: quantity }),
      })
        .then((response) => {
          if (!response.ok) {
            this.errorMessage = 'Failed to update the cart.';
            throw new Error('Failed to update the cart.');
          }
          return response.json();
        })
        .then((data) => {
          this.items = data.items;
          this.updateItemsCount();
          this.updateTotalPrice();
        })
        .catch((error) => {
          this.errorMessage = error.message;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    decrementQuantity(itemId, quantity) {
      console.log(quantity);
      if (quantity > 1) {
        this.updateCart(itemId, quantity - 1);
      } else {
        this.updateCart(itemId, 0);
      }
    },

    clearCart() {
      this.isLoading = true;
      this.errorMessage = '';
      fetch('/cart/clear.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(() => {
          this.items = [];
          this.itemsCount = 0;
          this.updateTotalPrice();
        })
        .catch(() => {
          this.errorMessage = 'Failed to clear the cart. Please try again.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    removeFromCart(itemId) {
      this.updateCart(itemId, 0);
    },

    toggleCart() {
      this.isCartOpen = !this.isCartOpen;
    },

    updateItemsCount() {
      this.itemsCount = this.items.reduce((total, item) => total + item.quantity, 0);
    },

    updateTotalPrice() {
      this.totalPrice = (this.items.reduce((total, item) => total + (item.price * item.quantity), 0) / 100).toFixed(2);
    },
  });

  Alpine.store('cart').loadCart();
});
