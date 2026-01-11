// Products pages - Enhanced functionality
let categoryTitle = document.querySelector(".categorys__title");
let categorysList = document.querySelector(".categorys__list");

let manufacturersTitle = document.querySelector(".manufacturers__title");
let manufacturersList = document.querySelector(".manufacturers__list");

let priceTitle = document.querySelector(".price__title");
let priceList = document.querySelector(".price__list");

let colorsTitle = document.querySelector(".colors__title");
let colorsList = document.querySelector(".colors__list");

// Enhanced toggle function with animation
function toggleClass(clickEl, classEl) {
  if (clickEl && classEl) {
    clickEl.addEventListener("click", () => {
      classEl.classList.toggle("active-lists");
      clickEl.classList.toggle("active-arrow");
    });
  }
}

toggleClass(categoryTitle, categorysList);
toggleClass(manufacturersTitle, manufacturersList);
toggleClass(priceTitle, priceList);
if (colorsTitle && colorsList) {
  toggleClass(colorsTitle, colorsList);
}

// Price range functionality
const priceRange = document.getElementById('price_range');
const minPriceInput = document.getElementById('min_price');
const maxPriceInput = document.getElementById('max_price');
const priceDisplayMin = document.getElementById('price_display');
const priceDisplayMax = document.getElementById('price_display_max');

if (priceRange && priceDisplayMin && priceDisplayMax) {
  // Update display when range slider changes
  priceRange.addEventListener('input', function() {
    const maxValue = this.value;
    const minValue = minPriceInput.value || 5;
    
    priceDisplayMin.textContent = minValue;
    priceDisplayMax.textContent = maxValue;
    maxPriceInput.value = maxValue;
  });

  // Update display when input fields change
  if (minPriceInput) {
    minPriceInput.addEventListener('input', function() {
      priceDisplayMin.textContent = this.value || 5;
    });
  }

  if (maxPriceInput) {
    maxPriceInput.addEventListener('input', function() {
      priceDisplayMax.textContent = this.value || 90;
      if (priceRange) {
        priceRange.value = this.value || 90;
      }
    });
  }
}

// Filter functionality
const applyFiltersBtn = document.querySelector('.apply-filters-btn');
const restartBtn = document.querySelector('.restart-btn');
const brandCheckboxes = document.querySelectorAll('input[name="brand"]');

if (applyFiltersBtn) {
  applyFiltersBtn.addEventListener('click', function() {
    const url = new URL(window.location);
    
    // Clear existing brand filters
    url.searchParams.delete('brand');
    
    // Add selected brands
    const selectedBrands = [];
    brandCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedBrands.push(checkbox.value);
      }
    });
    
    if (selectedBrands.length > 0) {
      selectedBrands.forEach(brand => {
        url.searchParams.append('brand', brand);
      });
    }
    
    // Add price filters
    if (minPriceInput && minPriceInput.value) {
      url.searchParams.set('min_price', minPriceInput.value);
    }
    if (maxPriceInput && maxPriceInput.value) {
      url.searchParams.set('max_price', maxPriceInput.value);
    }
    
    // Redirect with filters
    window.location.href = url.toString();
  });
}

if (restartBtn) {
  restartBtn.addEventListener('click', function() {
    // Clear all filters and redirect to clean URL
    const baseUrl = window.location.pathname;
    window.location.href = baseUrl;
  });
}

// Auto-apply brand filters on checkbox change
brandCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    // Add visual feedback
    const item = this.closest('.manufacturer-item');
    if (item) {
      if (this.checked) {
        item.style.backgroundColor = '#e8f4fd';
        item.style.borderLeft = '3px solid #394DFF';
      } else {
        item.style.backgroundColor = '';
        item.style.borderLeft = '';
      }
    }
  });
});

// Initialize selected states on page load
document.addEventListener('DOMContentLoaded', function() {
  brandCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const item = checkbox.closest('.manufacturer-item');
      if (item) {
        item.style.backgroundColor = '#e8f4fd';
        item.style.borderLeft = '3px solid #394DFF';
      }
    }
  });
});

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const headerNav = document.querySelector('.header-nav');

if (mobileMenuToggle && headerNav) {
  mobileMenuToggle.addEventListener('click', () => {
    mobileMenuToggle.classList.toggle('active');
    headerNav.classList.toggle('mobile-menu-open');
  });

  // Close menu when clicking on nav links
  const navLinks = document.querySelectorAll('.nav-list__link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
      headerNav.classList.remove('mobile-menu-open');
    });
  });
}

// Search Enhancement
const searchInput = document.querySelector('.search-input');
const searchForm = document.querySelector('.search-form');

if (searchInput && searchForm) {
  // Auto-submit on Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchForm.submit();
    }
  });

  // Search suggestions (placeholder for future enhancement)
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 2) {
      // Future: Add search suggestions
      console.log('Search query:', query);
    }
  });
}

// Cart functionality placeholder
const cartBtns = document.querySelectorAll('.content__shop-btn, .cart-btn');
cartBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Add to cart animation
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 150);

    // Update cart count (placeholder)
    const cartCount = document.querySelector('.cart-btn .action-count');
    if (cartCount) {
      let currentCount = parseInt(cartCount.textContent) || 0;
      cartCount.textContent = currentCount + 1;
      
      // Animate count
      cartCount.style.transform = 'scale(1.3)';
      setTimeout(() => {
        cartCount.style.transform = 'scale(1)';
      }, 200);
    }
  });
});

// Wishlist functionality placeholder
const wishlistBtns = document.querySelectorAll('.wishlist-btn');
wishlistBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Toggle wishlist
    btn.classList.toggle('active');
    
    // Update wishlist count (placeholder)
    const wishlistCount = document.querySelector('.wishlist-btn .action-count');
    if (wishlistCount) {
      let currentCount = parseInt(wishlistCount.textContent) || 0;
      const isActive = btn.classList.contains('active');
      wishlistCount.textContent = isActive ? currentCount + 1 : Math.max(0, currentCount - 1);
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    // Scrolling down
    header.style.transform = 'translateY(-100%)';
  } else {
    // Scrolling up
    header.style.transform = 'translateY(0)';
  }
  
  lastScrollTop = scrollTop;
});

// Add loading states
const addLoadingState = (element) => {
  element.classList.add('loading');
  element.style.pointerEvents = 'none';
};

const removeLoadingState = (element) => {
  element.classList.remove('loading');
  element.style.pointerEvents = 'auto';
};

// Form submission with loading state
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', (e) => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      addLoadingState(submitBtn);
      
      // Remove loading state after form submission
      setTimeout(() => {
        removeLoadingState(submitBtn);
      }, 2000);
    }
  });
});

// Page load animation
document.addEventListener('DOMContentLoaded', function() {
    const headerElements = document.querySelectorAll('.header-inner > *');
    const cardsContainer = document.querySelector('.cards');
    const sidebarElements = document.querySelectorAll('.sidebar > *');
    
    // Animate header elements
    headerElements.forEach((element, index) => {
        element.style.transform = 'translateY(-30px)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.transform = 'translateY(0)';
            element.style.opacity = '1';
        }, 100 + (index * 100));
    });
    
    // Animate product cards
    if (cardsContainer) {
        const cards = cardsContainer.querySelectorAll('.card');
        cards.forEach((card, index) => {
            card.style.transform = 'translateY(50px)';
            card.style.opacity = '0';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            }, 300 + (index * 150));
        });
    }
    
    // Animate sidebar elements
    sidebarElements.forEach((element, index) => {
        element.style.transform = 'translateX(-30px)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease';
            element.style.transform = 'translateX(0)';
            element.style.opacity = '1';
        }, 200 + (index * 100));
    });
});