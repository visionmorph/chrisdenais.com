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
    threshold: 0.25,
    rootMargin: "0px 0px 0px 0px
  });

  document.querySelectorAll(".fade-in-section").forEach((section) => {
    observer.observe(section);
  });
}

document.addEventListener("DOMContentLoaded", fadeInSections);
