document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const hamburgerMenu = document.querySelector(".hamburger-menu");
  const navLinks = document.querySelector(".nav-links");
  const sectionsToAnimate = document.querySelectorAll(".animate-on-scroll");
  const backToTopBtn = document.getElementById("backToTopBtn");

  // **Simple filter function**
  function setupFilterButtons() {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.category;
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        
        // Show/hide products
        document.querySelectorAll('.product-card').forEach(card => {
          const show = (category === 'all' || card.dataset.category === category);
          card.style.display = show ? 'block' : 'none';
        });
      });
    });
  }

  // **UI Code**
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

  // **Initialize filters after CMS loads products**
  setTimeout(() => {
    setupFilterButtons();
  }, 1000);
});