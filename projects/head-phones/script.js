const productGrid = document.getElementById("productGrid");
const chipRow = document.getElementById("chipRow");
const drawerFilters = document.getElementById("drawerFilters");
const resultsSummary = document.getElementById("resultsSummary");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("siteSearch");
const filterDrawer = document.getElementById("filterDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const resetFiltersButton = document.getElementById("resetFilters");
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primaryNav");

const USD_TO_RUB = 90;

const priceFormatter = new Intl.NumberFormat("en-GB", {
  currencyDisplay: "code",
  style: "currency",
  currency: "RUB",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const quickFilters = [
  { id: "all", label: "All" },
  { id: "earbuds", label: "Earbuds" },
  { id: "over-ear", label: "Over-ear" },
  { id: "studio", label: "Studio" },
  { id: "kids", label: "Kids" },
  { id: "travel", label: "Travel" },
  { id: "sale", label: "Deals" },
  { id: "drawer", label: "All filters", drawer: true },
];

const drawerGroups = [
  {
    key: "type",
    title: "Headphone type",
    options: [
      { value: "all", label: "All" },
      { value: "earbuds", label: "Earbuds" },
      { value: "over-ear", label: "Over-ear" },
      { value: "studio", label: "Studio" },
      { value: "open-ear", label: "Open-ear" },
      { value: "kids", label: "Kids" },
      { value: "travel", label: "Travel" },
    ],
  },
  {
    key: "budget",
    title: "Price",
    options: [
      { value: "all", label: "Any" },
      { value: "budget", label: "Under RUB 9,000" },
      { value: "mid", label: "RUB 9,000–27,000" },
      { value: "premium", label: "RUB 27,000 and up" },
    ],
  },
  {
    key: "palette",
    title: "Color",
    options: [
      { value: "all", label: "All" },
      { value: "neutral", label: "Neutral" },
      { value: "warm", label: "Warm" },
      { value: "bright", label: "Bright" },
    ],
  },
  {
    key: "highlights",
    title: "Features",
    options: [
      { value: "topRated", label: "Rated 4.8+", toggle: true },
      { value: "saleOnly", label: "On sale", toggle: true },
    ],
  },
];

const products = [
  {
    id: "wireless-earbuds-ipx8",
    name: "IPX8 Wireless Earbuds",
    description: "Water-resistant earbuds with a fast-charging case and rich bass on the go.",
    price: 89,
    rating: 4.9,
    reviews: 121,
    type: "earbuds",
    collection: "travel",
    budget: "budget",
    palette: "neutral",
    sale: true,
    tag: "Water-resistant",
    featured: 1,
    image: "assets/product-1.webp",
    toneA: "#f2f5f6",
    toneB: "#e3eaed",
    art: {
      kind: "earbuds-case",
      caseColor: "#1a2028",
      lidColor: "#252d37",
      accentColor: "#2f72ff",
      budColor: "#0f141a",
      detailColor: "#83a6ff",
    },
  },
  {
    id: "airpods-max",
    name: "AirPods Max",
    description: "Premium over-ear headphones with soft ear cushions and spacious, balanced sound.",
    price: 559,
    rating: 4.9,
    reviews: 121,
    type: "over-ear",
    collection: "studio",
    budget: "premium",
    palette: "warm",
    sale: true,
    tag: "Flagship",
    featured: 2,
    image: "assets/product-2.webp",
    toneA: "#fff1eb",
    toneB: "#f3e4ea",
    art: {
      kind: "pods-max",
      bandColor: "#dccfce",
      frameColor: "#cb9098",
      cupColor: "#d8a6ad",
      innerColor: "#e7b8be",
      meshColor: "#b7bcc4",
    },
  },
  {
    id: "bose-bt-earphones",
    name: "Bose Bluetooth Headphones",
    description: "A comfortable fit for home or travel, with smooth sound and effective noise cancellation.",
    price: 289,
    rating: 4.7,
    reviews: 121,
    type: "studio",
    collection: "travel",
    budget: "mid",
    palette: "neutral",
    sale: false,
    tag: "ANC",
    featured: 3,
    image: "assets/product-3.webp",
    toneA: "#eef0f3",
    toneB: "#e6eaee",
    art: {
      kind: "headband",
      bandColor: "#1f232b",
      cupColor: "#20252d",
      padColor: "#3b414b",
      accentColor: "#767c86",
    },
  },
  {
    id: "vivefox-headphones",
    name: "VIVEFOX Headphones",
    description: "A lightweight wired headset for desk work, calls, and quick edits.",
    price: 39,
    rating: 4.6,
    reviews: 121,
    type: "over-ear",
    collection: "travel",
    budget: "budget",
    palette: "bright",
    sale: true,
    tag: "Budget pick",
    featured: 4,
    image: "assets/product-4.webp",
    toneA: "#fff1ef",
    toneB: "#f7e6e3",
    art: {
      kind: "wired-headband",
      bandColor: "#d9413f",
      cupColor: "#e74d49",
      padColor: "#f06b66",
      accentColor: "#cf3432",
      wireColor: "#ed5b52",
    },
  },
  {
    id: "jbl-tune-600btnc",
    name: "JBL Tune 600BTNC",
    description: "Comfortable everyday headphones with gentle clamping pressure for long sessions.",
    price: 59,
    rating: 4.5,
    reviews: 121,
    type: "travel",
    collection: "travel",
    budget: "budget",
    palette: "neutral",
    sale: false,
    tag: "Everyday pick",
    featured: 5,
    image: "assets/product-5.webp",
    toneA: "#eff2f2",
    toneB: "#e1e6e7",
    art: {
      kind: "headband",
      bandColor: "#3a3f43",
      cupColor: "#42484d",
      padColor: "#5d6469",
      accentColor: "#8d9398",
    },
  },
  {
    id: "tagry-bluetooth",
    name: "TAGRY Bluetooth",
    description: "Colorful gaming earbuds with a compact case and quick pairing.",
    price: 109,
    rating: 4.8,
    reviews: 121,
    type: "earbuds",
    collection: "studio",
    budget: "mid",
    palette: "bright",
    sale: false,
    tag: "RGB case",
    featured: 6,
    image: "assets/product-6.webp",
    toneA: "#edf3f4",
    toneB: "#dce9ea",
    art: {
      kind: "gaming-buds",
      caseColor: "#1c2329",
      lidColor: "#2b343d",
      accentColor: "#48f6d5",
      accentColorTwo: "#ffa431",
      budColor: "#202730",
    },
  },
  {
    id: "monster-mnflex",
    name: "Monster MNFLEX",
    description: "An open-ear sport headset for runs and commutes that lets you hear your surroundings.",
    price: 89.75,
    rating: 4.6,
    reviews: 121,
    type: "open-ear",
    collection: "travel",
    budget: "budget",
    palette: "neutral",
    sale: false,
    tag: "Open-ear",
    featured: 7,
    image: "assets/product-7.webp",
    toneA: "#eef2f1",
    toneB: "#e6ebe9",
    art: {
      kind: "open-ear",
      frameColor: "#30353b",
      accentColor: "#515a63",
      detailColor: "#1f2328",
    },
  },
  {
    id: "mpow-ch6",
    name: "Mpow CH6",
    description: "Kids’ headphones with a padded headband, volume limiting, and a convenient stand.",
    price: 569,
    rating: 4.8,
    reviews: 121,
    type: "kids",
    collection: "kids",
    budget: "premium",
    palette: "bright",
    sale: false,
    tag: "Kids",
    featured: 8,
    image: "assets/product-8.webp",
    toneA: "#eef4ff",
    toneB: "#dde8ff",
    art: {
      kind: "kids-stand",
      bandColor: "#3f70f1",
      cupColor: "#5ba5ff",
      padColor: "#77c2ff",
      standColor: "#89a5d4",
    },
  },
];

const state = {
  query: "",
  quick: "all",
  type: "all",
  budget: "all",
  palette: "all",
  topRated: false,
  saleOnly: false,
  sort: "featured",
  favorites: new Set(["airpods-max", "mpow-ch6"]),
};

function svgShell(content) {
  return `
    <svg viewBox="0 0 320 240" role="img" aria-hidden="true">
      <ellipse cx="160" cy="212" rx="86" ry="15" fill="rgba(23, 50, 40, 0.10)"></ellipse>
      ${content}
    </svg>
  `;
}

function renderArtwork(art) {
  switch (art.kind) {
    case "earbuds-case":
      return svgShell(`
        <g transform="translate(0 4)">
          <path d="M96 108c0-28 28-48 64-48s64 20 64 48v10H96Z" fill="${art.lidColor}"></path>
          <rect x="88" y="112" width="144" height="88" rx="36" fill="${art.caseColor}"></rect>
          <ellipse cx="160" cy="124" rx="54" ry="10" fill="rgba(255,255,255,0.09)"></ellipse>
          <path d="M130 92c8 0 14 7 14 15v18c0 8-6 15-14 15s-14-7-14-15v-18c0-8 6-15 14-15Z" fill="${art.budColor}"></path>
          <path d="M130 88c4 0 9 3 11 7" fill="none" stroke="${art.detailColor}" stroke-width="4" stroke-linecap="round"></path>
          <path d="M190 92c8 0 14 7 14 15v18c0 8-6 15-14 15s-14-7-14-15v-18c0-8 6-15 14-15Z" fill="${art.budColor}"></path>
          <path d="M190 88c4 0 9 3 11 7" fill="none" stroke="${art.detailColor}" stroke-width="4" stroke-linecap="round"></path>
          <circle cx="160" cy="158" r="11" fill="${art.accentColor}"></circle>
          <circle cx="160" cy="158" r="4" fill="rgba(255,255,255,0.75)"></circle>
        </g>
      `);
    case "pods-max":
      return svgShell(`
        <g transform="translate(0 -6)">
          <path d="M128 78c18-20 46-20 64 0" fill="none" stroke="${art.meshColor}" stroke-width="10" stroke-linecap="round"></path>
          <path d="M122 86c-12 20-18 42-18 66" fill="none" stroke="${art.frameColor}" stroke-width="8" stroke-linecap="round"></path>
          <path d="M198 86c12 20 18 42 18 66" fill="none" stroke="${art.frameColor}" stroke-width="8" stroke-linecap="round"></path>
          <path d="M102 112c0-8 10-18 24-18s24 10 24 18v54c0 8-10 18-24 18s-24-10-24-18Z" fill="${art.cupColor}"></path>
          <path d="M170 112c0-8 10-18 24-18s24 10 24 18v54c0 8-10 18-24 18s-24-10-24-18Z" fill="${art.cupColor}"></path>
          <path d="M111 122c0-6 7-12 15-12s15 6 15 12v35c0 6-7 12-15 12s-15-6-15-12Z" fill="${art.innerColor}"></path>
          <path d="M179 122c0-6 7-12 15-12s15 6 15 12v35c0 6-7 12-15 12s-15-6-15-12Z" fill="${art.innerColor}"></path>
          <path d="M128 78c10-10 44-10 64 0" fill="none" stroke="${art.bandColor}" stroke-width="18" stroke-linecap="round"></path>
        </g>
      `);
    case "wired-headband":
      return svgShell(`
        <g transform="translate(0 6)">
          <path d="M98 146c0-72 42-116 62-116s62 44 62 116" fill="none" stroke="${art.bandColor}" stroke-width="20" stroke-linecap="round"></path>
          <rect x="76" y="134" width="48" height="72" rx="22" fill="${art.cupColor}"></rect>
          <rect x="196" y="134" width="48" height="72" rx="22" fill="${art.cupColor}"></rect>
          <rect x="88" y="145" width="24" height="50" rx="12" fill="${art.padColor}"></rect>
          <rect x="208" y="145" width="24" height="50" rx="12" fill="${art.padColor}"></rect>
          <path d="M224 188c14 18 26 26 36 26" fill="none" stroke="${art.wireColor}" stroke-width="5" stroke-linecap="round"></path>
          <circle cx="108" cy="126" r="6" fill="${art.accentColor}"></circle>
          <circle cx="212" cy="126" r="6" fill="${art.accentColor}"></circle>
        </g>
      `);
    case "gaming-buds":
      return svgShell(`
        <g transform="translate(0 10)">
          <path d="M98 108c0-20 28-44 62-44s62 24 62 44v8H98Z" fill="${art.lidColor}"></path>
          <rect x="92" y="112" width="136" height="82" rx="30" fill="${art.caseColor}"></rect>
          <path d="M108 149h104" fill="none" stroke="${art.accentColor}" stroke-width="6" stroke-linecap="round"></path>
          <circle cx="126" cy="149" r="8" fill="${art.accentColorTwo}"></circle>
          <circle cx="194" cy="149" r="8" fill="${art.accentColor}"></circle>
          <path d="M116 92c10 0 18 8 18 17v16c0 9-8 17-18 17s-18-8-18-17v-16c0-9 8-17 18-17Z" fill="${art.budColor}"></path>
          <path d="M204 92c10 0 18 8 18 17v16c0 9-8 17-18 17s-18-8-18-17v-16c0-9 8-17 18-17Z" fill="${art.budColor}"></path>
          <path d="M94 172c-14 16-20 26-18 34" fill="none" stroke="${art.accentColorTwo}" stroke-width="5" stroke-linecap="round"></path>
          <path d="M226 172c14 16 20 26 18 34" fill="none" stroke="${art.accentColor}" stroke-width="5" stroke-linecap="round"></path>
        </g>
      `);
    case "open-ear":
      return svgShell(`
        <g transform="translate(0 8)">
          <path d="M108 160c0-42 22-76 52-76h0c30 0 52 34 52 76" fill="none" stroke="${art.frameColor}" stroke-width="12" stroke-linecap="round"></path>
          <path d="M112 164c-20 0-34 16-34 34" fill="none" stroke="${art.accentColor}" stroke-width="10" stroke-linecap="round"></path>
          <path d="M208 164c20 0 34 16 34 34" fill="none" stroke="${art.accentColor}" stroke-width="10" stroke-linecap="round"></path>
          <circle cx="88" cy="204" r="12" fill="${art.detailColor}"></circle>
          <circle cx="232" cy="204" r="12" fill="${art.detailColor}"></circle>
          <circle cx="88" cy="204" r="5" fill="${art.accentColor}"></circle>
          <circle cx="232" cy="204" r="5" fill="${art.accentColor}"></circle>
        </g>
      `);
    case "kids-stand":
      return svgShell(`
        <g transform="translate(0 0)">
          <path d="M100 136c0-62 34-102 60-102s60 40 60 102" fill="none" stroke="${art.bandColor}" stroke-width="18" stroke-linecap="round"></path>
          <rect x="82" y="126" width="44" height="66" rx="20" fill="${art.cupColor}"></rect>
          <rect x="194" y="126" width="44" height="66" rx="20" fill="${art.cupColor}"></rect>
          <rect x="94" y="136" width="20" height="46" rx="10" fill="${art.padColor}"></rect>
          <rect x="206" y="136" width="20" height="46" rx="10" fill="${art.padColor}"></rect>
          <path d="M160 72v114" fill="none" stroke="${art.standColor}" stroke-width="10" stroke-linecap="round"></path>
          <path d="M126 194h68" fill="none" stroke="${art.standColor}" stroke-width="12" stroke-linecap="round"></path>
        </g>
      `);
    case "travel-headband":
      return svgShell(`
        <g transform="translate(0 6)">
          <path d="M100 148c0-74 38-118 60-118s60 44 60 118" fill="none" stroke="${art.bandColor}" stroke-width="18" stroke-linecap="round"></path>
          <path d="M88 134c0-8 9-16 20-16h12c11 0 20 8 20 16v58c0 8-9 16-20 16h-12c-11 0-20-8-20-16Z" fill="${art.cupColor}"></path>
          <path d="M180 134c0-8 9-16 20-16h12c11 0 20 8 20 16v58c0 8-9 16-20 16h-12c-11 0-20-8-20-16Z" fill="${art.cupColor}"></path>
          <path d="M102 142h24" fill="none" stroke="${art.accentColor}" stroke-width="4" stroke-linecap="round"></path>
          <path d="M194 142h24" fill="none" stroke="${art.accentColor}" stroke-width="4" stroke-linecap="round"></path>
          <rect x="98" y="146" width="20" height="42" rx="10" fill="${art.padColor}"></rect>
          <rect x="202" y="146" width="20" height="42" rx="10" fill="${art.padColor}"></rect>
        </g>
      `);
    case "headband":
    default:
      return svgShell(`
        <g transform="translate(0 6)">
          <path d="M100 148c0-72 40-118 60-118s60 46 60 118" fill="none" stroke="${art.bandColor}" stroke-width="20" stroke-linecap="round"></path>
          <rect x="80" y="134" width="44" height="72" rx="22" fill="${art.cupColor}"></rect>
          <rect x="196" y="134" width="44" height="72" rx="22" fill="${art.cupColor}"></rect>
          <rect x="92" y="145" width="20" height="50" rx="10" fill="${art.padColor}"></rect>
          <rect x="208" y="145" width="20" height="50" rx="10" fill="${art.padColor}"></rect>
          <path d="M118 116h84" fill="none" stroke="${art.accentColor}" stroke-width="5" stroke-linecap="round" opacity="0.7"></path>
        </g>
      `);
  }
}

function renderStars() {
  return Array.from({ length: 5 }, () => {
    return `<svg class="icon"><use href="#icon-star"></use></svg>`;
  }).join("");
}

function formatPrice(priceInUsd) {
  return priceFormatter.format(Math.round(priceInUsd * USD_TO_RUB));
}

function getDrawerOptionLabel(groupKey, value) {
  const group = drawerGroups.find((item) => item.key === groupKey);
  const option = group?.options.find((item) => item.value === value);
  return option?.label ?? value;
}

function renderProductMedia(product) {
  if (product.image) {
    return `
      <img
        class="product-image"
        src="${product.image}"
        alt="${product.name}"
        loading="lazy"
      />
    `;
  }

  return renderArtwork(product.art);
}

function matchesQuickFilter(product) {
  switch (state.quick) {
    case "all":
    case "drawer":
      return true;
    case "sale":
      return product.sale;
    case "earbuds":
    case "over-ear":
      return product.type === state.quick;
    case "studio":
    case "kids":
    case "travel":
      return product.type === state.quick || product.collection === state.quick;
    default:
      return true;
  }
}

function matchesDrawerFilters(product) {
  const typeMatch =
    state.type === "all" ||
    product.type === state.type ||
    product.collection === state.type;

  const budgetMatch = state.budget === "all" || product.budget === state.budget;
  const paletteMatch = state.palette === "all" || product.palette === state.palette;
  const ratingMatch = !state.topRated || product.rating >= 4.8;
  const saleMatch = !state.saleOnly || product.sale;

  return typeMatch && budgetMatch && paletteMatch && ratingMatch && saleMatch;
}

function matchesQuery(product) {
  if (!state.query) {
    return true;
  }

  const haystack = `${product.name} ${product.description} ${product.tag}`.toLowerCase();
  return haystack.includes(state.query);
}

function getVisibleProducts() {
  const filtered = products.filter((product) => {
    return matchesQuickFilter(product) && matchesDrawerFilters(product) && matchesQuery(product);
  });

  const sorted = [...filtered];
  switch (state.sort) {
    case "price-low":
      sorted.sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      sorted.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      sorted.sort((a, b) => b.rating - a.rating || a.price - b.price);
      break;
    case "featured":
    default:
      sorted.sort((a, b) => a.featured - b.featured);
      break;
  }

  return sorted;
}

function productCardTemplate(product) {
  const isFavorite = state.favorites.has(product.id);
  return `
    <article class="product-card">
      <button
        class="wishlist-button ${isFavorite ? "is-active" : ""}"
        type="button"
        data-wishlist="${product.id}"
        aria-label="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
      >
        <svg class="icon"><use href="#icon-heart"></use></svg>
      </button>

      <div
        class="product-visual"
        style="--tone-a: ${product.toneA}; --tone-b: ${product.toneB};"
      >
        ${renderProductMedia(product)}
      </div>

      <div class="product-meta">
        <div class="product-title-row">
          <h3 class="product-title">${product.name}</h3>
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>

        <p class="product-description">${product.description}</p>

        <div class="product-rating" aria-label="${product.rating} stars from ${product.reviews} reviews">
          <span class="rating-stars">${renderStars()}</span>
          <span>(${product.reviews})</span>
        </div>

        <div class="product-footer">
          <span class="product-tag">${product.tag}</span>
          <button class="button button--secondary product-cta" type="button">Add to cart</button>
        </div>
      </div>
    </article>
  `;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();

  if (!visibleProducts.length) {
    productGrid.innerHTML = `
      <div class="search-empty" style="grid-column: 1 / -1;">
        <strong>No products match these filters.</strong>
        <p>Clear your filters or try a broader search.</p>
      </div>
    `;
  } else {
    productGrid.innerHTML = visibleProducts.map(productCardTemplate).join("");
  }

  const appliedFilters = [];
  if (state.quick !== "all") {
    const chip = quickFilters.find((item) => item.id === state.quick);
    if (chip && !chip.drawer) {
      appliedFilters.push(chip.label);
    }
  }
  if (state.type !== "all") appliedFilters.push(getDrawerOptionLabel("type", state.type));
  if (state.budget !== "all") appliedFilters.push(getDrawerOptionLabel("budget", state.budget));
  if (state.palette !== "all") appliedFilters.push(getDrawerOptionLabel("palette", state.palette));
  if (state.topRated) appliedFilters.push("Rated 4.8+");
  if (state.saleOnly) appliedFilters.push("On sale");
  if (state.query) appliedFilters.push(`"${state.query}"`);

  const suffix = appliedFilters.length ? `, filters: ${appliedFilters.join(", ")}` : "";
  resultsSummary.textContent = `${visibleProducts.length} of ${products.length} products${suffix}`;
}

function renderQuickFilters() {
  chipRow.innerHTML = quickFilters
    .map((filter) => {
      const isActive = state.quick === filter.id;
      const classes = [
        "chip",
        isActive ? "is-active" : "",
        filter.drawer ? "chip--drawer" : "",
      ]
        .filter(Boolean)
        .join(" ");

      return `
        <button
          class="${classes}"
          type="button"
          data-chip="${filter.id}"
          ${filter.drawer ? 'data-open-drawer="true"' : ""}
        >
          <span>${filter.label}</span>
          ${filter.drawer ? '<svg class="icon icon--tiny"><use href="#icon-sliders"></use></svg>' : ""}
        </button>
      `;
    })
    .join("");
}

function renderDrawerFilters() {
  drawerFilters.innerHTML = drawerGroups
    .map((group) => {
      const options = group.options
        .map((option) => {
          const isToggle = Boolean(option.toggle);
          const isActive = isToggle ? state[option.value] : state[group.key] === option.value;
          return `
            <button
              class="filter-pill ${isActive ? "is-active" : ""}"
              type="button"
              data-group="${group.key}"
              data-value="${option.value}"
              ${isToggle ? 'data-toggle="true"' : ""}
            >
              ${option.label}
            </button>
          `;
        })
        .join("");

      return `
        <section class="filter-group">
          <h4>${group.title}</h4>
          <div class="filter-options">${options}</div>
        </section>
      `;
    })
    .join("");
}

function openDrawer() {
  filterDrawer.classList.add("is-open");
  filterDrawer.setAttribute("aria-hidden", "false");
  drawerBackdrop.hidden = false;
  document.body.classList.add("drawer-open");
}

function closeDrawer() {
  filterDrawer.classList.remove("is-open");
  filterDrawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
  document.body.classList.remove("drawer-open");
}

function openNav() {
  primaryNav.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.innerHTML = '<svg class="icon"><use href="#icon-close"></use></svg><span class="sr-only">Close navigation</span>';
  document.body.classList.add("nav-open");
}

function closeNav() {
  primaryNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.innerHTML = '<svg class="icon"><use href="#icon-menu"></use></svg><span class="sr-only">Open navigation</span>';
  document.body.classList.remove("nav-open");
}

function resetFilters() {
  state.quick = "all";
  state.type = "all";
  state.budget = "all";
  state.palette = "all";
  state.topRated = false;
  state.saleOnly = false;
  state.query = "";
  state.sort = "featured";
  searchInput.value = "";
  sortSelect.value = "featured";
  render();
}

function render() {
  renderQuickFilters();
  renderDrawerFilters();
  renderProducts();
}

chipRow.addEventListener("click", (event) => {
  const button = event.target.closest("[data-chip]");
  if (!button) {
    return;
  }

  const { chip } = button.dataset;
  if (chip === "drawer") {
    openDrawer();
    return;
  }

  state.quick = chip === state.quick ? "all" : chip;
  render();
});

drawerFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-group]");
  if (!button) {
    return;
  }

  const { group, value, toggle } = button.dataset;
  if (toggle) {
    state[value] = !state[value];
  } else {
    state[group] = value;
  }

  render();
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-wishlist]");
  if (!button) {
    return;
  }

  const { wishlist } = button.dataset;
  if (state.favorites.has(wishlist)) {
    state.favorites.delete(wishlist);
  } else {
    state.favorites.add(wishlist);
  }

  renderProducts();
});

document.querySelectorAll("[data-open-drawer]").forEach((button) => {
  button.addEventListener("click", openDrawer);
});

document.querySelectorAll("[data-close-drawer]").forEach((button) => {
  button.addEventListener("click", closeDrawer);
});

drawerBackdrop.addEventListener("click", closeDrawer);
resetFiltersButton.addEventListener("click", resetFilters);

sortSelect.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  renderProducts();
});

navToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.contains("is-open");
  if (isOpen) {
    closeNav();
  } else {
    openNav();
  }
});

primaryNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeNav();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
    closeNav();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1080) {
    closeNav();
  }
});

render();
