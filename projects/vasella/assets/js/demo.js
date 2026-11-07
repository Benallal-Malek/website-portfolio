(() => {
  'use strict';

  const ui = window.VasellaUI;
  const products = JSON.parse(document.querySelector('#demo-products').textContent);
  const productById = new Map(products.map(item => [item.id, item]));
  const productTemplate = document.querySelector('#demo-product-card');
  const cartKey = 'vasella-demo-cart-v1';
  const numberFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'RUB', currencyDisplay: 'code', maximumFractionDigits: 0 });
  const money = value => numberFormat.format(value);
  const photoURL = item => 'assets/images/' + item.image;
  const queryInput = document.querySelector('#catalog-query');
  const collectionSelect = document.querySelector('#catalog-collection');
  const sortSelect = document.querySelector('#catalog-sort');
  const catalogCards = document.querySelector('[data-catalog-products]');
  const catalogCount = document.querySelector('[data-catalog-count]');
  const cartItems = document.querySelector('[data-cart-items]');

  function createProductCard(item) {
    const card = productTemplate.content.cloneNode(true);
    const photo = card.querySelector('.product-card__photo');
    const title = card.querySelector('.product-card__title');
    const badge = card.querySelector('.product-card__badge');
    const favorite = card.querySelector('[data-favorite]');
    const add = card.querySelector('[data-add]');

    photo.dataset.demoProduct = item.id;
    photo.setAttribute('aria-label', item.title);
    photo.querySelector('img').src = photoURL(item);
    title.dataset.demoProduct = item.id;
    title.textContent = item.title;
    card.querySelector('.product-card__price').textContent = money(item.price);
    badge.hidden = !item.badge;
    badge.textContent = item.badge;
    badge.classList.toggle('product-card__badge--clay', item.tone === 'clay');
    favorite.dataset.favorite = 'demo-' + item.id;
    favorite.dataset.title = item.title;
    favorite.dataset.url = '#catalog';
    favorite.dataset.image = photoURL(item);
    favorite.dataset.demoId = item.id;
    favorite.setAttribute('aria-label', 'Favorites — ' + item.title);
    add.dataset.add = item.id;
    add.setAttribute('aria-label', 'Add to cart — ' + item.title);
    return card;
  }

  function showCatalog(collection = '', query = '') {
    collectionSelect.value = collection;
    queryInput.value = query;
    sortSelect.value = 'default';
    renderCatalog();
    ui.openDialog('demo-catalog');
  }

  function renderCatalog() {
    const query = queryInput.value.trim().toLocaleLowerCase('en-US');
    const category = collectionSelect.value;
    const filtered = products.filter(item => {
      const matchesQuery = (item.title + ' ' + item.material).toLocaleLowerCase('en-US').includes(query);
      const matchesCategory = !category || (category === 'new' ? item.badge === 'New' : item.categories.includes(category));
      return matchesQuery && matchesCategory;
    });

    if (sortSelect.value === 'price-asc') filtered.sort((left, right) => left.price - right.price);
    if (sortSelect.value === 'price-desc') filtered.sort((left, right) => right.price - left.price);

    catalogCount.textContent = filtered.length ? 'Products found: ' + filtered.length : 'No results match your search.';
    catalogCards.replaceChildren(...filtered.map(createProductCard));
    ui.renderFavorites();
  }

  function showProduct(item) {
    const detail = document.querySelector('#demo-product');
    detail.querySelector('#demo-product-title').textContent = item.title;
    const image = detail.querySelector('[data-detail-image]');
    image.src = photoURL(item);
    image.alt = item.title;
    detail.querySelector('[data-detail-description]').textContent = item.description;
    detail.querySelector('[data-detail-material]').textContent = item.material + ' · ' + item.height + ' cm';
    detail.querySelector('[data-detail-price]').textContent = money(item.price);
    detail.querySelector('[data-dialog-status]').textContent = '';

    const add = detail.querySelector('[data-add]');
    add.dataset.add = item.id;
    add.querySelector('span').textContent = 'Add to cart';
    ui.openDialog('demo-product');
  }

  function getCart() {
    const stored = ui.readStorage(cartKey, {});
    const cart = {};
    for (const item of products) {
      const count = Number(stored?.[item.id]);
      if (Number.isInteger(count) && count > 0) cart[item.id] = Math.min(count, 99);
    }
    return cart;
  }

  function getCartLines() {
    return Object.entries(getCart()).map(([id, count]) => ({ item: productById.get(id), count }));
  }

  function total(lines) {
    return lines.reduce((sum, { item, count }) => sum + item.price * count, 0);
  }

  function quantityButton(item, delta) {
    const button = document.createElement('button');
    button.className = 'icon-button';
    button.type = 'button';
    button.dataset.quantityItem = item.id;
    button.dataset.delta = delta;
    button.setAttribute('aria-label', (delta < 0 ? 'Decrease quantity — ' : 'Increase quantity — ') + item.title);
    button.append(ui.icon(delta < 0 ? 'minus' : 'plus'));
    return button;
  }

  function createCartLine({ item, count }) {
    const row = document.createElement('li');
    const image = document.createElement('img');
    image.src = photoURL(item);
    image.alt = '';

    const details = document.createElement('div');
    const link = document.createElement('a');
    link.dataset.demoProduct = item.id;
    link.href = '#catalog';
    link.textContent = item.title;
    const price = document.createElement('p');
    price.textContent = money(item.price * count);
    details.append(link, price);

    const controls = document.createElement('div');
    controls.className = 'cart-line__controls';
    const quantity = document.createElement('span');
    quantity.textContent = count;
    quantity.setAttribute('aria-label', 'Quantity — ' + count);
    controls.append(quantityButton(item, -1), quantity, quantityButton(item, 1));
    row.append(image, details, controls);
    return row;
  }

  function renderCart() {
    const lines = getCartLines();
    const count = lines.reduce((sum, line) => sum + line.count, 0);
    document.querySelector('[data-cart-count]').textContent = count;
    document.querySelector('[data-cart-summary]').hidden = count === 0;
    document.querySelector('[data-cart-empty]').hidden = count > 0;
    document.querySelector('[data-cart-total]').textContent = money(total(lines));
    cartItems.replaceChildren(...lines.map(createCartLine));
  }

  function changeQuantity(item, delta) {
    const cart = getCart();
    const count = Math.min((cart[item.id] || 0) + delta, 99);
    if (count > 0) cart[item.id] = count;
    else delete cart[item.id];
    ui.writeStorage(cartKey, cart);
    renderCart();
  }

  function showCheckout() {
    const lines = getCartLines();
    if (!lines.length) return;

    document.querySelector('[data-checkout-items]').replaceChildren(...lines.map(({ item, count }) => {
      const line = document.createElement('li');
      line.textContent = item.title + ' · ' + count + ' pcs';
      return line;
    }));
    document.querySelector('[data-checkout-total]').textContent = money(total(lines));
    document.querySelector('[data-checkout-review]').hidden = false;
    document.querySelector('[data-checkout-confirmation]').hidden = true;
    ui.openDialog('demo-checkout');
  }

  document.querySelector('[data-home-products]').replaceChildren(...products.filter(item => item.featured).map(createProductCard));
  ui.renderFavorites();
  renderCart();

  queryInput.addEventListener('input', renderCatalog);
  collectionSelect.addEventListener('change', renderCatalog);
  sortSelect.addEventListener('change', renderCatalog);

  document.querySelector('#demo-search').addEventListener('submit', event => {
    event.preventDefault();
    showCatalog('', document.querySelector('#demo-search-input').value.trim());
  });

  document.querySelector('#demo-newsletter').addEventListener('submit', event => {
    event.preventDefault();
    document.querySelector('[data-newsletter-message]').textContent = 'Newsletter form tested in demo mode.';
    event.currentTarget.reset();
  });

  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;

    const catalogLink = event.target.closest('[data-catalog]');
    const productLink = event.target.closest('[data-demo-product]');
    const addButton = event.target.closest('[data-add]');
    const quantity = event.target.closest('[data-quantity-item]');

    if (catalogLink) {
      event.preventDefault();
      showCatalog(catalogLink.dataset.catalog);
    }

    if (productLink) {
      const item = productById.get(productLink.dataset.demoProduct);
      if (item) {
        event.preventDefault();
        showProduct(item);
      }
    }

    if (addButton) {
      const item = productById.get(addButton.dataset.add);
      if (item) {
        changeQuantity(item, 1);
        const dialog = addButton.closest('dialog');
        if (dialog) {
          const detailLabel = addButton.querySelector('span');
          const live = dialog.querySelector('[data-dialog-status]');
          if (detailLabel) detailLabel.textContent = 'Added · add another';
          if (live) live.textContent = 'Added to cart — ' + item.title;
          addButton.classList.add('is-added');
        } else {
          ui.announce('Added to cart');
        }
      }
    }

    if (quantity) {
      const item = productById.get(quantity.dataset.quantityItem);
      if (item) {
        const delta = Number(quantity.dataset.delta);
        changeQuantity(item, delta);
        const remaining = [...cartItems.querySelectorAll('[data-quantity-item]')].find(button => button.dataset.quantityItem === item.id && Number(button.dataset.delta) === delta);
        (remaining || cartItems.querySelector('button') || document.querySelector('#demo-cart [data-close-dialog]')).focus();
      }
    }

    if (event.target.closest('[data-demo-checkout]')) showCheckout();
    if (event.target.closest('[data-confirm-demo]')) {
      ui.writeStorage(cartKey, {});
      renderCart();
      document.querySelector('[data-checkout-review]').hidden = true;
      const confirmation = document.querySelector('[data-checkout-confirmation]');
      confirmation.hidden = false;
      confirmation.querySelector('a').focus();
    }
  });

  window.addEventListener('storage', event => {
    if (event.key === cartKey) renderCart();
  });
})();
