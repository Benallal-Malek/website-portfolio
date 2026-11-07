(() => {
  'use strict';

  const favoriteKey = 'vasella-favorites-v1';
  const memory = new Map();
  const nav = document.querySelector('.primary-nav');
  const menuButton = document.querySelector('.menu-toggle');
  const catalogMenu = document.querySelector('.catalog-menu');
  const favoritesList = document.querySelector('[data-favorites-list]');
  const favoritesEmpty = document.querySelector('[data-favorites-empty]');
  const status = document.querySelector('[data-store-status]');
  let statusTimer;

  function readStorage(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value === null ? fallback : JSON.parse(value);
    } catch {
      return memory.has(key) ? memory.get(key) : fallback;
    }
  }

  function writeStorage(key, value) {
    memory.set(key, value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // A private browser session may restrict persistent storage.
    }
  }

  function icon(name) {
    const namespace = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(namespace, 'svg');
    const use = document.createElementNS(namespace, 'use');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    use.setAttribute('href', '#i-' + name);
    svg.append(use);
    return svg;
  }

  function safeURL(value) {
    if (typeof value !== 'string' || !value) return '';
    try {
      const url = new URL(value, location.href);
      if (url.protocol === 'http:' || url.protocol === 'https:') return url.href;
      if (location.protocol === 'file:' && url.protocol === 'file:' && !/^[a-z][\w+.-]*:/i.test(value)) return value;
    } catch {
      return '';
    }
    return '';
  }

  function getFavorites() {
    const saved = readStorage(favoriteKey, []);
    return Array.isArray(saved)
      ? saved.filter(item => item && typeof item.id === 'string' && typeof item.title === 'string' && safeURL(item.url))
      : [];
  }

  function announce(message) {
    if (!status) return;
    window.clearTimeout(statusTimer);
    status.hidden = false;
    status.textContent = message;
    statusTimer = window.setTimeout(() => {
      status.hidden = true;
      status.textContent = '';
    }, 2400);
  }

  function renderFavorites() {
    if (!favoritesList || !favoritesEmpty) return;
    const favorites = getFavorites();
    const ids = new Set(favorites.map(item => item.id));

    document.querySelectorAll('[data-favorite]').forEach(button => {
      button.setAttribute('aria-pressed', String(ids.has(button.dataset.favorite)));
    });

    favoritesEmpty.hidden = favorites.length > 0;
    favoritesList.replaceChildren(...favorites.map(item => {
      const line = document.createElement('li');
      const preview = document.createElement('span');
      const imageURL = safeURL(item.image);
      if (imageURL) {
        const image = document.createElement('img');
        image.src = imageURL;
        image.alt = '';
        preview.append(image);
      }
      const link = document.createElement('a');
      link.textContent = item.title;
      link.href = safeURL(item.url);
      if (typeof item.demoId === 'string') link.dataset.demoProduct = item.demoId;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'icon-button';
      remove.dataset.removeFavorite = item.id;
      remove.setAttribute('aria-label', 'Remove from favorites — ' + item.title);
      remove.append(icon('close'));
      line.append(preview, link, remove);
      return line;
    }));
  }

  function setMenu(isOpen) {
    if (!nav || !menuButton) return;
    nav.classList.toggle('is-open', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    if (!isOpen && catalogMenu) catalogMenu.open = false;
  }

  function openDialog(id) {
    const dialog = document.getElementById(id);
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const current = document.querySelector('dialog[open]');
    if (current && current !== dialog) current.close();
    if (id === 'site-favorites') renderFavorites();
    if (!dialog.open) dialog.showModal();
    return dialog;
  }

  document.documentElement.classList.add('has-ui');
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));

  document.addEventListener('click', event => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const opener = target.closest('[data-open-dialog]');
    const closer = target.closest('[data-close-dialog]');
    const favorite = target.closest('[data-favorite]');
    const remove = target.closest('[data-remove-favorite]');

    if (opener) {
      event.preventDefault();
      openDialog(opener.dataset.openDialog);
    }
    if (closer) closer.closest('dialog')?.close();

    if (favorite) {
      const id = favorite.dataset.favorite;
      const favorites = getFavorites();
      const wasSaved = favorites.some(item => item.id === id);
      if (wasSaved) {
        writeStorage(favoriteKey, favorites.filter(item => item.id !== id));
      } else if (safeURL(favorite.dataset.url)) {
        favorites.push({
          id,
          title: favorite.dataset.title || '',
          url: favorite.dataset.url,
          image: favorite.dataset.image || '',
          demoId: favorite.dataset.demoId
        });
        writeStorage(favoriteKey, favorites);
      }
      renderFavorites();
      announce(wasSaved ? 'Removed from favorites' : 'Added to favorites');
    }

    if (remove) {
      const buttons = [...favoritesList.querySelectorAll('[data-remove-favorite]')];
      const index = buttons.indexOf(remove);
      writeStorage(favoriteKey, getFavorites().filter(item => item.id !== remove.dataset.removeFavorite));
      renderFavorites();
      const next = favoritesList.querySelectorAll('[data-remove-favorite]');
      (next[Math.min(index, next.length - 1)] || document.querySelector('#site-favorites [data-close-dialog]'))?.focus();
    }

    if (catalogMenu && !catalogMenu.contains(target)) catalogMenu.open = false;
    if (nav?.classList.contains('is-open') && !target.closest('.menu-toggle') && (!nav.contains(target) || target.closest('a'))) {
      setMenu(false);
    }

    if (target instanceof HTMLDialogElement) {
      const bounds = target.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) target.close();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || document.querySelector('dialog[open]')) return;
    if (nav?.classList.contains('is-open')) {
      setMenu(false);
      menuButton.focus();
    } else if (catalogMenu?.open) {
      catalogMenu.open = false;
      catalogMenu.querySelector('summary').focus();
    }
  });

  window.addEventListener('storage', event => {
    if (event.key === favoriteKey) renderFavorites();
  });

  if (window.jQuery) {
    window.jQuery(document.body).on('added_to_cart', () => announce('Item added to cart'));
  }

  renderFavorites();
  window.VasellaUI = { openDialog, renderFavorites, announce, icon, readStorage, writeStorage };
})();
