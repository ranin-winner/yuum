document.addEventListener('alpine:init', () => {
  Alpine.store('cart', {
    items: [],
    itemsCount: 0,
    totalPrice: '0.00',
    isCartOpen: false,
    isLoading: false,
    errorMessage: '',
    shippingDiscount: {
      shippingProgress: 0,
      shippingPrice: 35,
      shippingLeft: 35,
      isFreeShippingUnlocked: false,
    },

    loadCart() {
      this.isLoading = true;
      this.errorMessage = '';
      console.log('Test');
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
      this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity) / 100, 0).toFixed(2);

      const total = parseFloat(this.totalPrice);
      this.shippingDiscount.isFreeShippingUnlocked = total >= this.shippingDiscount.shippingPrice;
      this.shippingDiscount.shippingLeft = (this.shippingDiscount.shippingPrice - total).toFixed(2);
      this.shippingDiscount.shippingProgress = Math.min(100, (total / this.shippingDiscount.shippingPrice) * 100);
    },
  });

  Alpine.store('cart').loadCart();
});
