const nav = document.querySelector(".nav--top");
const header = document.querySelector("header");
const navOption = {
  root: null,
  rootMargin: "0px",
  threshold: 0.8
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

//Modal toggler
const learnLinks = document.querySelectorAll("[data-trigger-for]");
const modalTexts = document.querySelectorAll("[data-modal-text-for]");
//
const modal = document.querySelector(".modal");
const modalHead = document.querySelector(".modal__head");
const modalBody = document.querySelector(".modal__text");
const modalClose = document.querySelector("#btnModalClose");

//Dialog polyfill
dialogPolyfill.registerDialog(modal);

learnLinks.forEach((link, index) => {
  link.addEventListener("click", e => {
    const modHead = link.parentNode.querySelector(".card__head").textContent;

    modalHead.textContent = modHead;
    modalBody.textContent = modalTexts[index].textContent;
    modal.showModal();
    typeof modal.showModal === "function"
      ? modal.showModal()
      : alert("Dialog not supported");
  });
});

modalClose.addEventListener("click", () => modal.close());

//card hover
const switchList = node => {
  const { classList } = node;
  const siblings = document.querySelectorAll(classList[0]);
  const activeClass = classList[0] + "--active";

  siblings.forEach(n => n.classList.remove(activeClass));
  node.classList.remove(activeClass);
};
const serviceCards = document.querySelectorAll(".service");
serviceCards.forEach(s =>
  s.addEventListener("click", ({ currentTarget }) => switchList(currentTarget))
);
