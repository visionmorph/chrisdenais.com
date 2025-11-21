function fadeInSections() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      // Fade in *all* fade-content inside this section
      entry.target.querySelectorAll(".fade-content").forEach((el) => {
        el.classList.add("visible");
      });

      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.25,
    rootMargin: "0px 0px 0px 0px"
  });

  document.querySelectorAll(".fade-in-section").forEach((section) => {
    observer.observe(section);
  });
}

document.addEventListener("DOMContentLoaded", fadeInSections);
