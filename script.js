document.addEventListener("DOMContentLoaded", () => {
  const products = [
    {
      id: "product2",
      name: "Elegant restaurant chair",
      description: "Crafted with the finest wood, ideal for luxury restaurants.",
      price: "₦ 35,000",
      category: "restaurant-chair",
      image: "images/product2.jpeg",
    },
    {
      id: "product1",
      name: "Elegant Dining Table",
      description: "Sleek black round design dining table",
      price: "₦ 85,000",
      category: "dining-table",
      image: "images/product1.jpeg",
    },
    {
      id: "product3",
      name: "Velvet Restaurant Chair",
      description: "Luxurious velvet upholstery and ergonomic design for ultimate comfort.",
      price: "₦ 80,000",
      category: "restaurant-chair",
      image: "images/product3.jpeg",
    },
    {
      id: "product4",
      name: "Modern Bar Stool with Backrest",
      description: "Comfortable and stylish, with a supportive backrest for extended seating.",
      price: "₦ 80,000",
      category: "bar-stool",
      image: "images/product4.jpeg",
    },
    {
      id: "product5",
      name: "Beautiful Bar Stool",
      description: "Tall legged bar stool, perfect for premium feels.",
      price: "₦ 80,000",
      category: "bar-stool",
      image: "images/product5.jpeg",
    },
    {
      id: "product6",
      name: "Contemporary Bar Stool",
      description: "Unique backrest design, combining modern aesthetics with practical comfort.",
      price: "₦ 85,000",
      category: "bar-stool",
      image: "images/product6.jpeg",
    },
    {
      id: "product7",
      name: "High-Back Bar Stool",
      description: "Provides excellent back support, ideal for kitchen islands and high counters.",
      price: "₦ 80,000",
      category: "bar-stool",
      image: "images/product7.jpeg",
    },
    {
      id: "product8",
      name: "Chrome Bar Stool",
      description: "Minimalist design with a polished chrome finish, a statement piece for any bar.",
      price: "₦ 75,000",
      category: "bar-stool",
      image: "images/product8.jpeg",
    },
    {
      id: "product9",
      name: "Contemporary Restaurant Chair",
      description: "Unique backrest design, combining modern aesthetics with practical comfort.",
      price: "₦ 75,000",
      category: "restaurant-chair",
      image: "images/product9.jpeg",
    },
    {
      id: "product10",
      name: "Industrial Bar Stool",
      description: "Robust design with a raw, urban appeal, suitable for modern industrial interiors.",
      price: "₦ 130,000",
      category: "bar-stool",
      image: "images/product10.jpeg",
    },
    {
      id: "product11",
      name: "Stackable Restaurant Chair",
      description: "Durable and space-saving, perfect for commercial environments.",
      price: "₦ 80,000",
      category: "restaurant-chair",
      image: "images/product11.jpeg",
    },
    {
      id: "product12",
      name: "Classic Dining Chair",
      description: "Timeless design crafted from high-quality material, offering enduring elegance.",
      price: "₦ 65,000",
      category: "dining-table",
      image: "images/product12.jpeg",
    },
    {
      id: "product13",
      name: "Modern Bar Stool with Backrest",
      description: "Comfortable and stylish, with a supportive backrest for extended seating.",
      price: "₦ 80,000",
      category: "bar-stool",
      image: "images/product13.jpeg",
    },
  ]

  const productGrid = document.querySelector(".product-grid")
  const filterButtons = document.querySelectorAll(".filter-btn")
  const hamburgerMenu = document.querySelector(".hamburger-menu")
  const navLinks = document.querySelector(".nav-links")
  const sectionsToAnimate = document.querySelectorAll(".animate-on-scroll")
  const backToTopBtn = document.getElementById("backToTopBtn")

  // Function to render products
  function renderProducts(filteredProducts) {
    productGrid.innerHTML = "" // Clear existing products
    filteredProducts.forEach((product) => {
      const productCard = document.createElement("div")
      productCard.classList.add("product-card")
      productCard.setAttribute("data-category", product.category)

      productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <div class="product-price">${product.price}</div>
                    <a href="#" class="btn btn-primary shop-whatsapp-btn" data-product-name="${product.name}">Shop on WhatsApp</a>
                </div>
            `
      productGrid.appendChild(productCard)
    })
  }

  // Initial render of all products
  renderProducts(products)

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category

      // Update active button state
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filter products
      const filtered = category === "all" ? products : products.filter((p) => p.category === category)
      renderProducts(filtered)
    })
  })

  // WhatsApp button logic (using event delegation)
  productGrid.addEventListener("click", (event) => {
    if (event.target.classList.contains("shop-whatsapp-btn")) {
      event.preventDefault()
      const productName = event.target.dataset.productName
      const whatsappMessage = encodeURIComponent(`Hi, I'm interested in the ${productName} I saw on your website.`)
      const whatsappUrl = `https://wa.me/2347088771679?text=${whatsappMessage}` // Updated WhatsApp number
      window.open(whatsappUrl, "_blank")
    }
  })

  // Hamburger menu toggle
  hamburgerMenu.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active")
    navLinks.classList.toggle("active")
    // Disable scroll when menu is open
    document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : ""
  })

  // Close mobile menu when a nav link is clicked
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerMenu.classList.remove("active")
      navLinks.classList.remove("active")
      document.body.style.overflow = "" // Re-enable scroll
    })
  })

  // Scroll-triggered animations using IntersectionObserver
  const observerOptions = {
    root: null, // viewport
    rootMargin: "0px",
    threshold: 0.2, // Trigger when 20% of the element is visible
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        observer.unobserve(entry.target) // Stop observing once animated
      }
    })
  }, observerOptions)

  sectionsToAnimate.forEach((section) => {
    observer.observe(section)
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      })
    })
  })

  // Back to Top button logic
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      // Show button after scrolling 300px
      backToTopBtn.classList.add("show")
    } else {
      backToTopBtn.classList.remove("show")
    }
  })

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })
})

