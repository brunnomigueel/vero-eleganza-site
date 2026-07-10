import { db, doc, getDoc } from './firebase.js';

let WHATSAPP_NUMBER = '5551999999999';
let CHECKOUT_BASE_URL = '#';

const formatCurrency = (value) => {
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatInstallments = (value) => {
  const inst = parseFloat(value) / 3;
  return `ou 3x de ${inst.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros`;
};

const whatsappSvg = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

async function loadStoreData() {
  try {
    const storeDoc = await getDoc(doc(db, "vero_eleganza", "store_data"));
    if (storeDoc.exists()) {
      const data = storeDoc.data();
      if (data.config && data.config.whatsappNumber) {
        WHATSAPP_NUMBER = data.config.whatsappNumber;
      }
      if (data.config && data.config.instagramUrl) {
        const instaLink = document.querySelector('.social-links a[aria-label="Instagram"]');
        if (instaLink) instaLink.href = data.config.instagramUrl;
      }
      renderCategoriesAndProducts(data.categories || [], data.products || {});
    } else {
      // Fallback para dados locais se o Firebase estiver vazio
      const localData = JSON.parse(localStorage.getItem('veroEleganza_products'));
      if (localData) {
        const defaultCats = [
          {id: 'ternos', name: 'Ternos'},
          {id: 'camisas', name: 'Camisas'},
          {id: 'sueteres', name: 'Suéteres'},
          {id: 'gravatas', name: 'Gravatas'}
        ];
        renderCategoriesAndProducts(defaultCats, localData);
      }
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

function renderCategoriesAndProducts(categories, productsDict) {
  const tabsContainer = document.getElementById('dynamic-category-tabs');
  const productsContainer = document.getElementById('dynamic-products-container');
  
  if (!tabsContainer || !productsContainer) return;
  
  tabsContainer.innerHTML = '';
  productsContainer.innerHTML = '';
  
  categories.forEach((cat, index) => {
    // Aba
    const tabHtml = `<button class="category-tab ${index === 0 ? 'active' : ''}" data-category="${cat.id}">${cat.name}</button>`;
    tabsContainer.insertAdjacentHTML('beforeend', tabHtml);
    
    // Container de Produtos da Categoria
    const catHtml = `<div class="product-category ${index === 0 ? 'active' : ''}" data-category="${cat.id}" id="products-${cat.id}"></div>`;
    productsContainer.insertAdjacentHTML('beforeend', catHtml);
    
    const currContainer = document.getElementById(`products-${cat.id}`);
    const activeProducts = (productsDict[cat.id] || []).filter(p => p.active);
    
    activeProducts.forEach((product, pIdx) => {
      const delayClass = (pIdx % 4 !== 0) ? `reveal-delay-${pIdx % 4}` : '';
      const badgeHtml = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
      const imageSrc = product.image ? product.image : 'assets/images/hero-bg.jpg';
      const waMessage = `Olá! Tenho interesse no ${product.name} (${formatCurrency(product.price)}). Poderia me ajudar?`;
      
      const checkoutBtn = product.link 
        ? `<a href="${product.link}" class="btn btn-checkout" target="_blank">Finalizar Compra</a>`
        : `<a href="#" class="btn btn-checkout" data-product="${product.id}">Finalizar Compra</a>`;

      const pHTML = `
        <div class="product-card reveal ${delayClass}">
          <div class="product-image">
            <img src="${imageSrc}" alt="${product.name}" loading="lazy" width="600" height="800">
            ${badgeHtml}
          </div>
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${formatCurrency(product.price)}</p>
            <p class="product-installment">${formatInstallments(product.price)}</p>
            <div class="product-actions">
              <a href="#" class="btn btn-whatsapp" data-whatsapp="${waMessage}">
                ${whatsappSvg} Comprar via WhatsApp
              </a>
              ${checkoutBtn}
            </div>
          </div>
        </div>
      `;
      currContainer.insertAdjacentHTML('beforeend', pHTML);
    });
  });
  
  initDynamicInteractions();
}

function buildWhatsAppUrl(message) {
  var encoded = encodeURIComponent(message);
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded;
}

function initDynamicInteractions() {
  // TABS
  const tabs = document.querySelectorAll('.category-tab');
  const categoriesList = document.querySelectorAll('.product-category');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const category = this.dataset.category;

      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      categoriesList.forEach(function (cat) {
        if (cat.dataset.category === category) {
          cat.classList.add('active');
          cat.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.remove('visible');
            requestAnimationFrame(() => {
              requestAnimationFrame(() => el.classList.add('visible'));
            });
          });
        } else {
          cat.classList.remove('active');
        }
      });
    });
  });
  
  // REVEAL OBSERVER
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));
  
  // WHATSAPP
  document.querySelectorAll('[data-whatsapp]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var message = this.dataset.whatsapp;
      window.open(buildWhatsAppUrl(message), '_blank');
    });
  });

  // CHECKOUT
  document.querySelectorAll('[data-product]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var productId = this.dataset.product;

      if (CHECKOUT_BASE_URL === '#') {
        var productName = this.closest('.product-card').querySelector('.product-name').textContent;
        var productPrice = this.closest('.product-card').querySelector('.product-price').textContent;
        var message = 'Olá! Gostaria de finalizar a compra: ' + productName + ' (' + productPrice + '). Como posso proceder com o pagamento?';
        window.open(buildWhatsAppUrl(message), '_blank');
      } else {
        window.open(CHECKOUT_BASE_URL + '?product=' + productId, '_blank');
      }
    });
  });
}

// ---- STATIC INTERACTIONS ----

// Header Scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
}, { passive: true });

// Mobile Menu
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle.addEventListener('click', function () {
  this.classList.toggle('active');
  navMenu.classList.toggle('open');
  document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Footer category links
document.querySelectorAll('[data-tab]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const tabName = this.dataset.tab;
    const targetTab = document.querySelector('.category-tab[data-category="' + tabName + '"]');
    if (targetTab) {
      targetTab.click();
      document.getElementById('colecoes').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Tip Modals
const tipCards = document.querySelectorAll('.tip-card');
const tipModals = document.querySelectorAll('.tip-modal-overlay');

tipCards.forEach(card => {
  card.addEventListener('click', function () {
    const tipId = this.dataset.tip;
    const modal = document.getElementById('modal-' + tipId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

tipModals.forEach(overlay => {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  const closeBtn = overlay.querySelector('.tip-modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    tipModals.forEach(overlay => {
      if (overlay.classList.contains('active')) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
    if (navMenu.classList.contains('open')) {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});

// INIT
loadStoreData();
