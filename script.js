/* ==========================================================================
   Ritika Chhaperwal - Interior Design Portfolio JS Interactions
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initScrollAnimations();
  initLightbox();
  initContactForm();
});

/* --------------------------------------------------------------------------
   1. Navigation & Header Shrink
   -------------------------------------------------------------------------- */
function initNavigation() {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");
  
  // Header shrink on scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Toggle mobile menu
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    menuToggle.classList.toggle("open");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  // Close mobile menu when nav-link clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  // Active section tracking in header
  const sections = document.querySelectorAll("section[id], header[id]");
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute("id");
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.add("active");
      } else {
        document.querySelector(`.nav-menu a[href*=${sectionId}]`)?.classList.remove("active");
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Intersection Observer for Scroll Reveal
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll(".scroll-reveal");
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        // Once revealed, no need to observe again
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* --------------------------------------------------------------------------
   3. Interactive Lightbox Modal
   -------------------------------------------------------------------------- */
function initLightbox() {
  const modal = document.getElementById("lightboxModal");
  const modalImg = document.getElementById("lightboxImage");
  const modalCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  
  let currentGroup = [];
  let currentIndex = 0;

  // Find all lightbox-trigger images in document
  const allTriggers = Array.from(document.querySelectorAll(".lightbox-trigger"));

  allTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      // Find what section/group this image belongs to (e.g. current project block)
      const parentBlock = trigger.closest(".project-showcase, .about-section, .hero-section");
      
      if (parentBlock) {
        // Group images in the same section
        currentGroup = Array.from(parentBlock.querySelectorAll(".lightbox-trigger"));
      } else {
        // Fallback to all images
        currentGroup = allTriggers;
      }
      
      currentIndex = currentGroup.indexOf(trigger);
      openLightbox();
    });
  });

  function openLightbox() {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    updateLightboxContent();
  }

  function closeLightbox() {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function updateLightboxContent() {
    if (currentGroup.length === 0) return;
    
    const activeImg = currentGroup[currentIndex];
    modalImg.src = activeImg.src;
    modalImg.alt = activeImg.alt || "Portfolio image";
    modalCaption.textContent = activeImg.alt || "";
    
    // Show/hide navigation arrows if there is only 1 image
    if (currentGroup.length <= 1) {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    } else {
      prevBtn.style.display = "block";
      nextBtn.style.display = "block";
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % currentGroup.length;
    updateLightboxContent();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + currentGroup.length) % currentGroup.length;
    updateLightboxContent();
  }

  // Click handlers
  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);
  
  // Close when clicking overlay (outside content/nav buttons)
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("lightbox-content")) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    
    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowRight") {
      showNext();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    }
  });
}

/* --------------------------------------------------------------------------
   4. Mock Contact Form Submission Handler
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill in all fields.";
      status.className = "form-status error";
      return;
    }

    // Submit state animation
    const submitBtn = form.querySelector(".btn-submit");
    const originalText = submitBtn.querySelector("span").textContent;
    submitBtn.querySelector("span").textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate Server Request delay
    setTimeout(() => {
      status.textContent = "Thank you! Your message has been sent successfully.";
      status.className = "form-status success";
      form.reset();
      
      submitBtn.querySelector("span").textContent = originalText;
      submitBtn.disabled = false;
      
      // Clear status after 5 seconds
      setTimeout(() => {
        status.textContent = "";
        status.className = "form-status";
      }, 5000);
    }, 1500);
  });
}
