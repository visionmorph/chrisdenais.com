function fadeInSections() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.25,
    rootMargin: "0px 0px 0px 0px"
  });

  // Observe every fade-content directly
  document.querySelectorAll(".fade-content").forEach((el) => {
    observer.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", fadeInSections);
do
