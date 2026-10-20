
/* ==========================================
   LeoTechWorld — Main JavaScript
   Founder: LeoAthi
   ========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const loader = document.querySelector(".loader");
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const ideaForm = document.querySelector("#ideaForm");
  const formResult = document.querySelector(".form-result");
  const yearElement = document.querySelector("#year");
  const backToTop = document.querySelector("#backToTop");

  // 1. Loading screen
  function hideLoader() {
    if (loader) {
      loader.classList.add("loaded");
      loader.setAttribute("aria-hidden", "true");
    }

    body.classList.remove("loading");
  }

  window.addEventListener("load", hideLoader, { once: true });

  // Fallback if the load event has already passed
  if (document.readyState === "complete") {
    hideLoader();
  }

  // 2. Mobile navigation menu
  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.classList.remove("active");
    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");

      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        !menuToggle.contains(event.target) &&
        !navLinks.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // 3. Navbar scroll effect
  function updateNavbar() {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 30);
    }

    if (backToTop) {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    }
  }

  updateNavbar();

  window.addEventListener("scroll", updateNavbar, {
    passive: true
  });

  // 4. Automatically update footer year
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 5. Scroll reveal animations
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // 6. Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
          block: "start"
        });
      }
    });
  });

  // 7. Back-to-top button
  if (backToTop) {
    backToTop.addEventListener("click", (event) => {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth"
      });
    });
  }

  // 8. Animated background particles
  const canvas = document.querySelector("#particles");
  const context = canvas?.getContext("2d");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (canvas && context && !reducedMotion) {
    let particles = [];
    let animationFrame;
    let width = 0;
    let height = 0;

    const particleCount = () =>
      Math.min(65, Math.floor(window.innerWidth / 20));

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      particles = Array.from(
        { length: particleCount() },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.8 + 0.5,
          speedX: (Math.random() - 0.5) * 0.35,
          speedY: (Math.random() - 0.5) * 0.35,
          alpha: Math.random() * 0.45 + 0.15
        })
      );
    }

    function animateParticles() {
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = width;
        if (particle.x > width) particle.x = 0;
        if (particle.y < 0) particle.y = height;
        if (particle.y > height) particle.y = 0;

        context.beginPath();
        context.arc(
          particle.x,
          particle.y,
          particle.radius,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          `rgba(110, 130, 255, ${particle.alpha})`;

        context.fill();
      });

      animationFrame = requestAnimationFrame(animateParticles);
    }

    resizeCanvas();
    animateParticles();

    window.addEventListener("resize", resizeCanvas, {
      passive: true
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrame);
      } else {
        cancelAnimationFrame(animationFrame);
        animateParticles();
      }
    });
  }

  // 9. Idea feedback form
  if (ideaForm) {
    ideaForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!ideaForm.checkValidity()) {
        ideaForm.reportValidity();
        return;
      }

      const formData = new FormData(ideaForm);
      const idea = {};

      formData.forEach((value, key) => {
        idea[key] = String(value).trim();
      });

      if (formResult) {
        formResult.hidden = false;
        formResult.replaceChildren();

        const heading = document.createElement("h4");
        heading.textContent = "Your idea is ready!";

        const message = document.createElement("p");
        message.textContent =
          "This website is currently a static demo. Your idea has not been sent or saved. A form service or backend must be connected to receive submissions.";

        const summary = document.createElement("pre");
        summary.style.whiteSpace = "pre-wrap";
        summary.style.overflowWrap = "anywhere";
        summary.textContent = Object.entries(idea)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.textContent = "Copy My Idea";

        copyButton.addEventListener("click", async () => {
          const textToCopy = summary.textContent || "";

          try {
            await navigator.clipboard.writeText(textToCopy);
            copyButton.textContent = "Copied!";
          } catch {
            const textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            textArea.setAttribute("readonly", "");
            document.body.appendChild(textArea);
            textArea.select();

            const copied = document.execCommand("copy");
            textArea.remove();

            copyButton.textContent = copied
              ? "Copied!"
              : "Please copy the text manually";
          }
        });

        formResult.append(heading, message, summary, copyButton);
        formResult.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    });
  }

  // 10. Prevent empty placeholder links from jumping to the top
  document.querySelectorAll('a[href="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
    });
  });
});
