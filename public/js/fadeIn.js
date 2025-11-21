function fadeInSections() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {

        // Apply the visible class to the inner fade-content
        const content = entry.target.querySelector(".fade-content");
        if (content) {
          content.classList.add("visible");
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: "-160px 0px 0px 0px" // ← trigger 96px *after* entering viewport
  });

  document.querySelectorAll(".fade-in-section").forEach((section) => {
    observer.observe(section);
  });
}

document.addEventListener("DOMContentLoaded", fadeInSections);
