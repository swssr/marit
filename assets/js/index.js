const nav = document.querySelector(".nav--top");
const header = document.querySelector("header");
const navOption = {
  root: null,
  rootMargin: "0px",
  threshold: 0.5
};
function toggleNav([entry]) {
  if (!entry.isIntersecting) {
    nav.classList.add("nav--up");
  } else {
    nav.classList.remove("nav--up");
  }
}
const navIO = new IntersectionObserver(toggleNav, navOption);

navIO.observe(header);
