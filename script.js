const products = [
  {
    id: "all-purpose-cleaner",
    name: "All-Purpose Cleaner",
    image: "assets/product-all-purpose-cleaner.svg",
  },
  {
    id: "industrial-degreaser",
    name: "Industrial Degreaser",
    image: "assets/product-industrial-degreaser.svg",
  },
  {
    id: "sanitizing-solution",
    name: "Sanitizing Solution",
    image: "assets/product-sanitizing-solution.svg",
  },
  {
    id: "surface-disinfectant",
    name: "Surface Disinfectant",
    image: "assets/product-surface-disinfectant.svg",
  },
  {
    id: "laundry-enhancer",
    name: "Laundry Enhancer",
    image: "assets/product-laundry-enhancer.svg",
  },
  {
    id: "water-treatment-blend",
    name: "Water Treatment Blend",
    image: "assets/product-water-treatment-blend.svg",
  },
];

const productGrid = document.getElementById("productGrid");
const quoteList = document.getElementById("quoteList");
const requestQuoteFromProducts = document.getElementById("requestQuoteFromProducts");
const sendRequestBtn = document.getElementById("sendRequestBtn");
const menuToggle = document.getElementById("menuToggle");
const siteMenu = document.getElementById("siteMenu");

const selectionState = new Set();

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
      <article class="product-card" data-product-card="${product.id}">
        <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" />
        <div class="product-content">
          <h3>${product.name}</h3>
          <label class="checkbox-row">
            <input type="checkbox" data-product-checkbox="${product.id}" />
            <span>Select for quote</span>
          </label>
        </div>
      </article>
    `
    )
    .join("");
}

function renderQuoteList() {
  quoteList.innerHTML = products
    .map(
      (product) => `
      <label class="quote-item">
        <input type="checkbox" data-quote-checkbox="${product.id}" />
        <span>${product.name}</span>
      </label>
    `
    )
    .join("");
}

function applySelectionVisuals() {
  products.forEach((product) => {
    const selected = selectionState.has(product.id);
    const productCard = document.querySelector(`[data-product-card="${product.id}"]`);
    const productCheckbox = document.querySelector(`[data-product-checkbox="${product.id}"]`);
    const quoteCheckbox = document.querySelector(`[data-quote-checkbox="${product.id}"]`);

    if (productCard) {
      productCard.classList.toggle("selected", selected);
    }

    if (productCheckbox) {
      productCheckbox.checked = selected;
    }

    if (quoteCheckbox) {
      quoteCheckbox.checked = selected;
    }
  });
}

function updateSelection(productId, selected) {
  if (selected) {
    selectionState.add(productId);
  } else {
    selectionState.delete(productId);
  }
  applySelectionVisuals();
}

function getSelectedProductNames() {
  return products
    .filter((product) => selectionState.has(product.id))
    .map((product) => product.name);
}

function buildQuoteMailto() {
  const selectedNames = getSelectedProductNames();
  if (selectedNames.length === 0) {
    alert("Please select at least one product before requesting a quote.");
    return null;
  }

  const subject = "Quote Request - Rangechem (Pty) Ltd";
  const bodyLines = [
    "Hello Rangechem (Pty) Ltd Team,",
    "",
    "Please provide a quote for the following products:",
    ...selectedNames.map((name) => `- ${name}`),
    "",
    "Company Name:",
    "Contact Person:",
    "Phone Number:",
    "Additional Notes:",
  ];

  const body = bodyLines.join("\n");
  return `mailto:quotes@rangechem.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function triggerQuoteMail() {
  const mailto = buildQuoteMailto();
  if (!mailto) {
    return;
  }
  window.location.href = mailto;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) {
    return;
  }
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  if (!document.querySelector(".modal.is-open")) {
    document.body.classList.remove("modal-open");
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal.is-open").forEach((modal) => closeModal(modal));
}

renderProducts();
renderQuoteList();
applySelectionVisuals();

document.getElementById("year").textContent = new Date().getFullYear();

document.addEventListener("change", (event) => {
  const productCheckbox = event.target.closest("[data-product-checkbox]");
  if (productCheckbox) {
    updateSelection(productCheckbox.dataset.productCheckbox, productCheckbox.checked);
    return;
  }

  const quoteCheckbox = event.target.closest("[data-quote-checkbox]");
  if (quoteCheckbox) {
    updateSelection(quoteCheckbox.dataset.quoteCheckbox, quoteCheckbox.checked);
  }
});

document.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-modal-open]");
  if (openButton) {
    openModal(openButton.dataset.modalOpen);
    if (siteMenu.classList.contains("show")) {
      siteMenu.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    }
    return;
  }

  const closeButton = event.target.closest("[data-modal-close]");
  if (closeButton) {
    const modal = closeButton.closest(".modal");
    if (modal) {
      closeModal(modal);
    }
    return;
  }

  const backdrop = event.target.classList.contains("modal") ? event.target : null;
  if (backdrop) {
    closeModal(backdrop);
  }

  const navLink = event.target.closest(".menu a[href^='#']");
  if (navLink && siteMenu.classList.contains("show")) {
    siteMenu.classList.remove("show");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

requestQuoteFromProducts.addEventListener("click", triggerQuoteMail);

sendRequestBtn.addEventListener("click", () => {
  triggerQuoteMail();
  closeAllModals();
});

menuToggle.addEventListener("click", () => {
  const isOpen = siteMenu.classList.toggle("show");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllModals();
    if (siteMenu.classList.contains("show")) {
      siteMenu.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  }
});