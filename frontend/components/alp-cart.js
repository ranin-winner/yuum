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
    options: {
      showSellingPlan: true,
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
          console.log('Test this.items', this.items);
        })
        .catch(() => {
          this.errorMessage = 'Failed to load the cart. Please try again.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    addToCart ({
        variantId,
        quantity = 1,
        properties = {},
        sellingPlanId = null
      }, showCart = true) {
      if (!variantId) {
        console.error('Variant ID is required to add a product to the cart.');
        return;
      }
      this.isLoading = true;
      this.errorMessage = '';
      const requestData = {
        id: variantId,
        quantity: quantity,
        properties,
      };
      if (sellingPlanId) {
        requestData.selling_plan = sellingPlanId;
      }
      console.log('requestData', requestData);
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
      .then(() => {
        this.loadCart();
        if (showCart) {
          this.toggleCart();
        }
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

    addMultiplyToCart(productsArr, showCart = true) {
      this.isLoading = true;
      this.errorMessage = '';

      const formData = { items: productsArr };

      return fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(() => this.loadCart())
        .then(() => {
          if (showCart) this.toggleCart(true);
        })
        .catch(() => {
          this.errorMessage = 'Failed to add the product. Please try again.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    async addBundleToCart({ bundleTitle = 'Bundle', bundleImage = '', items = [] }, showCart = true) {
      if (!items?.length) return;

      const bundleId = `bndl_${Date.now()}_${Math.random().toString(16).slice(2)}`;

      const payload = {
        items: items.map(it => ({
          id: Number(it.variantId),
          quantity: Number(it.quantity) || 1,
          properties: {
            _bundle_id: bundleId,
            _bundle_title: bundleTitle,
            _bundle_image: bundleImage
          }
        }))
      };

      this.isLoading = true;
      this.errorMessage = '';

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Failed to add bundle');

        await this.loadCart();

        if (showCart) this.toggleCart(true);
      } catch (e) {
        console.error(e);
        this.errorMessage = 'Failed to add the bundle. Please try again.';
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    updateCart(itemKey, quantity) {
      this.isLoading = true;
      this.errorMessage = '';

      fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: String(itemKey), quantity: quantity }),
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

    removeFromCart(itemKey) {
      this.updateCart(itemKey, 0);
    },

    get bundles() {
      const map = new Map();

      for (const item of this.items) {
        const bid = item?.properties?._bundle_id;
        if (!bid) continue;

        if (!map.has(bid)) {
          map.set(bid, {
            id: bid,
            title: item?.properties?._bundle_title || 'Bundle',
            image: item?.properties?._bundle_image || item.image, // <= ОЦЕ
            qty: 0,
            total: 0
          });
        }

        const b = map.get(bid);
        b.qty += Number(item.quantity) || 0;
        b.total += Number(item.final_line_price ?? item.line_price ?? 0);
        // якщо раптом у якихось item нема _bundle_image — підхопимо з інших
        if (!b.image) b.image = item?.properties?._bundle_image || item.image;
      }

      return Array.from(map.values());
    },

    get nonBundleItems() {
      return this.items.filter(item => !item?.properties?._bundle_id);
    },
    removeBundle(bundleId) {
      if (!bundleId) return;

      this.isLoading = true;
      this.errorMessage = '';

      const updates = {};
      for (const item of this.items) {
        if (item?.properties?._bundle_id === bundleId) {
          updates[item.key] = 0;
        }
      }

      return fetch('/cart/update.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      })
        .then(res => res.json())
        .then((data) => {
          this.items = data.items;
          this.updateItemsCount();
          this.updateTotalPrice();
        })
        .catch(() => {
          this.errorMessage = 'Failed to remove bundle.';
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    toggleCart(status) {
      if (status !== undefined) {
        this.isCartOpen = status;
        Alpine.store('shopMainStore').body_no_scroll = status;
      } else {
        this.isCartOpen = !this.isCartOpen;
        Alpine.store('shopMainStore').body_no_scroll = this.isCartOpen;
      }

      // Close search when cart opens (only when opening, not closing)
      if (this.isCartOpen) {
        const header = document.querySelector('.b-header');
        const wrapper = document.querySelector('.b-header__wrapper');
        const searchModal = document.querySelector('.c-search-modal, .search-modal, [class*="search-modal"]');

        // Remove header classes
        if (header) header.classList.remove('search-open');
        if (wrapper) wrapper.classList.remove('has-search-open');

        // Hide search modal completely
        if (searchModal) {
          searchModal.style.display = 'none';
          searchModal.classList.remove('is-open', 'active', 'open', 'show');
          searchModal.setAttribute('aria-hidden', 'true');
        }

        console.log('✅ Closed search modal when opening cart');
      }
    },

    updateItemsCount() {
      this.itemsCount = this.items.reduce((total, item) => total + item.quantity, 0);
    },

    showQuantity(itemId) {
      const item = this.items.find((item) => item.id === itemId);
      return item ? item.quantity : 0;
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
