function fadeIn() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      obs.unobserve(entry.target);
    });
  }, {
    threshold: 0.10,
    rootMargin: "0px 0px 0px 0px"
  });

  document.querySelectorAll(".fade-content").forEach((el) => {
    observer.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", fadeIn);
