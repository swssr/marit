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
const modalHeads = document.querySelectorAll("[data-modal-head-for]");
//
const modals = document.querySelectorAll(".modal");
const modalHead = document.querySelector(".modal__head");
const modalBody = document.querySelector(".modal__text");
const modalClose = document.querySelectorAll("#btnModalClose");

const [popup, modalEnq] = modals;
//Dialog polyfill
dialogPolyfill.registerDialog(popup);

learnLinks.forEach((_trigger, index) => {
  _trigger.addEventListener("click", e => {
    const modHead = modalHeads[index].textContent;

    modalHead.textContent = modHead;
    modalBody.textContent = modalTexts[index].textContent;
    typeof popup.showModal === "function"
      ? popup.showModal()
      : alert("Dialog not supported");
  });
});

//Close modal
const closeModal = () => {
  popup.close();
  modalEnq.close();
};

modalClose.forEach(btn => {
  btn.addEventListener("click", closeModal);
});

//card hover
const switchList = (node, arr) => {
  const { classList } = node;
  const siblings = arr || document.querySelectorAll(classList[0]);
  const activeClass = classList[0] + "--active";
  siblings.forEach(n => n.classList.remove(activeClass));
  node.classList.add(activeClass);
};

const serviceCards = document.querySelectorAll(".service");
serviceCards.forEach((s, _, arr) =>
  s.addEventListener("mouseover", ({ currentTarget }) => {
    switchList(currentTarget, arr);
  })
);

//Close menu on nav link click
const navLinks = document.querySelectorAll(".nav__links .link");
const btnMenu = document.querySelector(".menu--chk");

navLinks.forEach(link =>
  link.addEventListener("click", e => {
    btnMenu.click();
  })
);

//Handle email form submit
const form = document.querySelector("form");
const emailInput = form.querySelector("[name=email]");

//Enquiry modal popup
const enqModal = document.querySelector(".modal--enquiry");

form.addEventListener("submit", e => {
  e.preventDefault();

  //Email validation
  const isValidEmail = isEmail(emailInput.value.trim());

  if (isValidEmail) {
    enqModal.showModal();
  } else {
    //Prevent default and modified modal from showing on error.
    closeModal();
    //Adds error class to form
    hasError(form);
  }
});

//Utility functions
function isEmail(_phrase) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(_phrase);
}

function hasError(node) {
  isElement(node) && node.classList.add("hasError");

  setTimeout(() => {
    node.classList.remove("hasError");
  }, 400);
}

function isElement(obj) {
  try {
    return obj instanceof HTMLElement;
  } catch (e) {
    return (
      typeof obj === "object" &&
      obj.nodeType === 1 &&
      typeof obj.style === "object" &&
      typeof obj.ownerDocument === "object"
    );
  }
}
