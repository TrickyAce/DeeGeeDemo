import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { 
  getFirestore, 
  collection,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBuVUetybKkcqMZ9asfa9BOWY9Sznt5CmI",
  authDomain: "tricky-ace-cms-e7674.firebaseapp.com",
  projectId: "tricky-ace-cms-e7674",
  storageBucket: "tricky-ace-cms-e7674.firebasestorage.app",
  messagingSenderId: "601244410366",
  appId: "1:601244410366:web:8ba3a4be15cbbc900020af"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.querySelector(".product-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const navLinks = document.querySelector(".nav-links");
  const sectionsToAnimate = document.querySelectorAll(".animate-on-scroll");
  const backToTopBtn = document.getElementById("backToTopBtn");

  let products = [];
  let currentFilter = "all";
  let unsubscribeOrder, unsubscribeProducts;
 
  // **Auto-sync function**
async function syncOrderWithProducts() {
  try {
    console.log("🔄 Syncing order with products...");
    
    // Get current order
    const orderDoc = await getDoc(doc(db, "Config", "productOrder"));
    let orderString = orderDoc.data()?.orderString || "";
    let orderedIds = orderString.split(',').filter(id => id.trim());
    
    // Get all current products
    const productsSnapshot = await getDocs(collection(db, "Products"));
    const allProductIds = [];
    productsSnapshot.forEach(doc => allProductIds.push(doc.id));

    // ⭐ ADD THIS CHECK ⭐
    if (orderString === "" && allProductIds.length > 0) {
      console.log("🆕 First-time setup: Creating initial order");
      orderedIds = [...allProductIds];
      needsUpdate = true;
    }

    
    // Find NEW products (in Products but not in order)
    const newProducts = allProductIds.filter(id => !orderedIds.includes(id));
    
    // Find DELETED products (in order but not in Products)
    const deletedProducts = orderedIds.filter(id => !allProductIds.includes(id));
    
    let needsUpdate = false;
    
    // Step 1: Add NEW products to BEGINNING
    if (newProducts.length > 0) {
      console.log(`➕ Adding new products to beginning:`, newProducts);
      orderedIds = [...newProducts, ...orderedIds]; // Add to beginning
      needsUpdate = true;
    }
    
    // Step 2: Remove DELETED products
    if (deletedProducts.length > 0) {
      console.log(`➖ Removing deleted products:`, deletedProducts);
      orderedIds = orderedIds.filter(id => !deletedProducts.includes(id));
      needsUpdate = true;
    }
    
    // Update Firebase if changes needed
    if (needsUpdate) {
      const newOrderString = orderedIds.join(',');
      await updateDoc(doc(db, "Config", "productOrder"), {
        orderString: newOrderString
      });
      console.log("✅ Order synced with products");
    } else {
      console.log("✅ Order already in sync");
    }
    
    return orderedIds;
    
  } catch (error) {
    console.error("Error syncing:", error);
    return [];
  }
}

function setupRealtimeListeners() {
  console.log("Setting up auto-sync listeners...");
  
  // **Listener 1: Watch Products collection for changes**
  unsubscribeProducts = onSnapshot(
    collection(db, "Products"),
    async () => {
      console.log("📦 Products collection changed");
      // Auto-sync when products change
      await syncOrderWithProducts();
    }
  );
  
  // **Listener 2: Watch Order document for changes**
  unsubscribeOrder = onSnapshot(
    doc(db, "Config", "productOrder"),
    async (orderSnap) => {
      if (!orderSnap.exists()) {
        console.log("⚠️ No order document found");
        return;
      }
      
      console.log("📋 Order updated");
      const orderString = orderSnap.data().orderString || "";
      const orderedIds = orderString.split(',').map(id => id.trim()).filter(id => id.length > 0);
      
      // Load and display products in order
      await loadAndDisplayProducts(orderedIds);
    }
  );
  
  // **Initial sync on page load**
  setTimeout(async () => {
    console.log("🔄 Initial auto-sync on page load...");
    await syncOrderWithProducts();
  }, 1000);
}

    // **Load products and display in order**
  async function loadAndDisplayProducts(orderedIds) {
    // Get all products
    const productsSnapshot = await getDocs(collection(db, "Products"));
    
    // Create a map for quick lookup
    const productsMap = {};
    productsSnapshot.forEach(doc => {
      productsMap[doc.id] = {
        id: doc.id,
        ...doc.data()
      };
    });
    
    // Create ordered array based on orderIds
    const orderedProducts = [];
    
    // Add products in the order from array
    for (const productId of orderedIds) {
      if (productsMap[productId]) {
        orderedProducts.push(productsMap[productId]);
      }
    }
    
    // Add any products not in the order array (new products)
    productsSnapshot.forEach(doc => {
      if (!orderedIds.includes(doc.id)) {
        orderedProducts.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });
    
    console.log("Displaying products in order:");
    orderedProducts.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (ID: ${p.id})`);
    });
    
    products = orderedProducts;
    
    // Apply current filter
    const filtered = currentFilter === "all" 
      ? products 
      : products.filter((p) => p.category === currentFilter);
    
    renderProducts(filtered);
  }

  // **Render products** - Simplified
function renderProducts(filteredProducts) {
    productGrid.innerHTML = "";
    
    if (filteredProducts.length === 0) {
        const noProducts = document.createElement("p");
        noProducts.className = "no-products";
        noProducts.textContent = "No products found.";
        productGrid.appendChild(noProducts);
        return;
    }
    
    filteredProducts.forEach((product) => {
        // Create product card container
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.setAttribute("data-category", product.category);
        
        // Create product image
        const productImage = document.createElement("img");
        productImage.src = product.image;
        productImage.alt = product.name;
        
        // Create product info container
        const productInfo = document.createElement("div");
        productInfo.classList.add("product-info");
        
        // Create product name heading
        const productName = document.createElement("h3");
        productName.textContent = product.name;
        
        // Create product description paragraph
        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;
        
        // Create product price div
        const productPrice = document.createElement("div");
        productPrice.classList.add("product-price");
        productPrice.textContent = product.price;
        
        // Create WhatsApp button
        const whatsappBtn = document.createElement("a");
        whatsappBtn.href = "#";
        whatsappBtn.classList.add("btn", "btn-primary", "shop-whatsapp-btn");
        whatsappBtn.setAttribute("data-product-name", product.name);
        whatsappBtn.textContent = "Shop on WhatsApp";
        
        // Build the structure
        // Add elements to productInfo
        productInfo.appendChild(productName);
        productInfo.appendChild(productDescription);
        productInfo.appendChild(productPrice);
        productInfo.appendChild(whatsappBtn);
        
        // Add image and info to productCard
        productCard.appendChild(productImage);
        productCard.appendChild(productInfo);
        
        // Add productCard to grid
        productGrid.appendChild(productCard);
    });
}

  // **Setup filter buttons** - Same
  function setupFilterButtons() {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.category;
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        currentFilter = category;
        
        const filtered = category === "all" 
          ? products 
          : products.filter((p) => p.category === category);
        
        renderProducts(filtered);
      });
    });
  }

  // **All your UI code stays the same**
  productGrid.addEventListener("click", (event) => {
    if (event.target.classList.contains("shop-whatsapp-btn")) {
      event.preventDefault();
      const productName = event.target.dataset.productName;
      const whatsappMessage = encodeURIComponent(`Hi, I'm interested in the ${productName} I saw on your website.`);
      const whatsappUrl = `https://wa.me/2347088771679?text=${whatsappMessage}`;
      window.open(whatsappUrl, "_blank");
    }
  });

  hamburgerMenu.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburgerMenu.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  sectionsToAnimate.forEach((section) => {
    observer.observe(section);
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  window.addEventListener("scroll", () => {
    backToTopBtn.classList.toggle("show", window.scrollY > 300);
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // **Cleanup**

  window.addEventListener('beforeunload', () => {
    if (unsubscribeOrder) unsubscribeOrder();
    if (unsubscribeProducts) unsubscribeProducts();
  });

  // **Initialize - just load and display**
  setupRealtimeListeners();
  setupFilterButtons();
});
