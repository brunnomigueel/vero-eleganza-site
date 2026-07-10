/* ============================================================
   VERO ELEGANZA — Script Principal
   Alfaiataria Premium • Vale dos Sinos
   ============================================================ */

(function () {
  'use strict';

  // ---- CONFIGURAÇÃO VIA ADMIN (localStorage) ----
  let WHATSAPP_NUMBER = '5551999999999';
  let CHECKOUT_BASE_URL = '#';
  
  const savedConfig = JSON.parse(localStorage.getItem('veroEleganza_config'));
  if (savedConfig && savedConfig.whatsappNumber) {
    WHATSAPP_NUMBER = savedConfig.whatsappNumber;
  }

  // Atualizar link do Instagram no footer se existir
  if (savedConfig && savedConfig.instagramUrl) {
    const instaLink = document.querySelector('.social-links a[aria-label="Instagram"]');
    if (instaLink) instaLink.href = savedConfig.instagramUrl;
  }

  // ---- RENDERIZAR PRODUTOS (se houver no Admin) ----
  const savedProducts = JSON.parse(localStorage.getItem('veroEleganza_products'));
  if (savedProducts) {
    const formatCurrency = (value) => {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const formatInstallments = (value) => {
      const inst = value / 3;
      return `ou 3x de ${inst.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} sem juros`;
    };

    const whatsappSvg = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

    ['ternos', 'camisas', 'sueteres', 'gravatas'].forEach(cat => {
      const container = document.getElementById('products-' + cat);
      if (container) {
        container.innerHTML = ''; // Limpar produtos hardcoded
        
        const activeProducts = savedProducts[cat].filter(p => p.active);
        
        activeProducts.forEach((product, index) => {
          // Delay de reveal escalonado (0 a 3)
          const delayClass = (index % 4 !== 0) ? `reveal-delay-${index % 4}` : '';
          
          const badgeHtml = product.badge ? `<span class="product-badge">${product.badge}</span>` : '';
          const imageSrc = product.image.startsWith('data:') || product.image.startsWith('http') || product.image.startsWith('assets') ? product.image : 'assets/images/hero-bg.jpg';
          
          const waMessage = `Olá! Tenho interesse no ${product.name} (${formatCurrency(product.price)}). Poderia me ajudar?`;
          
          const checkoutBtn = product.link 
            ? `<a href="${product.link}" class="btn btn-checkout" target="_blank">Finalizar Compra</a>`
            : `<a href="#" class="btn btn-checkout" data-product="${product.id}">Finalizar Compra</a>`;

          const html = \`
            <div class="product-card reveal \${delayClass}">
              <div class="product-image">
                <img src="\${imageSrc}" alt="\${product.name}" loading="lazy" width="600" height="800">
                \${badgeHtml}
              </div>
              <div class="product-info">
                <h3 class="product-name">\${product.name}</h3>
                <p class="product-price">\${formatCurrency(product.price)}</p>
                <p class="product-installment">\${formatInstallments(product.price)}</p>
                <div class="product-actions">
                  <a href="#" class="btn btn-whatsapp" data-whatsapp="\${waMessage}">
                    \${whatsappSvg} Comprar via WhatsApp
                  </a>
                  \${checkoutBtn}
                </div>
              </div>
            </div>
          \`;
          container.insertAdjacentHTML('beforeend', html);
        });
      }
    });
  }

  // ---- HEADER SCROLL EFFECT ----
  const header = document.getElementById('header');

  function handleHeaderScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  // ---- MOBILE MENU ----
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  menuToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when clicking a nav link
  document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
      menuToggle.classList.remove('active');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
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

  // ---- CATEGORY TABS ----
  const tabs = document.querySelectorAll('.category-tab');
  const categories = document.querySelectorAll('.product-category');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const category = this.dataset.category;

      // Update active tab
      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');

      // Show corresponding category
      categories.forEach(function (cat) {
        if (cat.dataset.category === category) {
          cat.classList.add('active');
          // Re-trigger reveal animations for newly visible cards
          cat.querySelectorAll('.reveal').forEach(function (el) {
            el.classList.remove('visible');
            // Small delay to allow re-animation
            requestAnimationFrame(function () {
              requestAnimationFrame(function () {
                el.classList.add('visible');
              });
            });
          });
        } else {
          cat.classList.remove('active');
        }
      });
    });
  });

  // ---- FOOTER CATEGORY LINKS ----
  document.querySelectorAll('[data-tab]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const tabName = this.dataset.tab;
      const targetTab = document.querySelector('.category-tab[data-category="' + tabName + '"]');
      if (targetTab) {
        targetTab.click();
        // Scroll to collections
        document.getElementById('colecoes').scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- SCROLL REVEAL (Intersection Observer) ----
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });

  // ---- WHATSAPP BUTTONS ----
  function buildWhatsAppUrl(message) {
    var encoded = encodeURIComponent(message);
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encoded;
  }

  // Handle all WhatsApp buttons
  document.querySelectorAll('[data-whatsapp]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var message = this.dataset.whatsapp;
      window.open(buildWhatsAppUrl(message), '_blank');
    });
  });

  // ---- CHECKOUT BUTTONS ----
  document.querySelectorAll('[data-product]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var productId = this.dataset.product;

      if (CHECKOUT_BASE_URL === '#') {
        // Fallback: redirect to WhatsApp with purchase intent
        var productName = this.closest('.product-card').querySelector('.product-name').textContent;
        var productPrice = this.closest('.product-card').querySelector('.product-price').textContent;
        var message = 'Olá! Gostaria de finalizar a compra: ' + productName + ' (' + productPrice + '). Como posso proceder com o pagamento?';
        window.open(buildWhatsAppUrl(message), '_blank');
      } else {
        // Redirect to checkout
        window.open(CHECKOUT_BASE_URL + '?product=' + productId, '_blank');
      }
    });
  });

  // ---- TIP MODALS ----
  var tipCards = document.querySelectorAll('.tip-card');
  var tipModals = document.querySelectorAll('.tip-modal-overlay');

  tipCards.forEach(function (card) {
    card.addEventListener('click', function () {
      var tipId = this.dataset.tip;
      var modal = document.getElementById('modal-' + tipId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Close modals
  tipModals.forEach(function (overlay) {
    // Close on overlay click
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close on X button
    var closeBtn = overlay.querySelector('.tip-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // Close modal on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      tipModals.forEach(function (overlay) {
        if (overlay.classList.contains('active')) {
          overlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Also close mobile menu
      if (navMenu.classList.contains('open')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // ---- INITIAL STATE ----
  // Trigger header check on load
  handleHeaderScroll();

})();
