const url = new URL(window.location);
var transitioned = url.searchParams.get("transition") != null;
url.searchParams.delete("transition");
window.history.replaceState({},"", url.toString());

document.addEventListener("DOMContentLoaded", () => {
  const ease = "power4.inOut";

  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");

      if (href.includes("?page")) {
        return;
      }

      console.log(href);
      console.log(href.trim().concat("?transition"));

      if (href) {
        event.preventDefault();
        animateTransition().then(() => {
          window.location.href = href.trim().concat("?transition");
        });
      }
    });
  });

  if (transitioned)
  {
    revealTransition().then(() => {
      gsap.set(".transition", { opacity: 1, clearProps: "transform" });
      gsap.set(".mainImage", { opacity: 1 });
    });
  }
  else
  {
    gsap.set(".transition", { opacity: 1, clearProps: "transform" });
    gsap.set(".mainImage", { opacity: 1 });
  }

  function revealTransition() {
    return new Promise((resolve) => {
      gsap.set(".transition", { translateY: "7%", opacity: 0 });
      gsap.to(".transition", {
        translateY: 0,
        opacity: 1,
        duration: 0.9,
        ease: ease,
        onComplete: resolve,
      });

      gsap.set(".mainImage", { opacity: 0 });
      gsap.to(".mainImage", {
        opacity: 1,
        duration: 0.7,
        ease: ease,
      });
    });
  }

  function animateTransition() {
    return new Promise((resolve) => {
      gsap.set(".transition", { translateY: 0, opacity: 1 });
      gsap.to(".transition", {
        translateY: "2%",
        opacity: 0,
        duration: 0.4,
        ease: ease,
        onComplete: resolve,
      });

      gsap.set(".mainImage", { opacity: 1 });
      gsap.to(".mainImage", {
        opacity: 0,
        duration: 0.3,
        ease: ease,
      });
    });
  }
});