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
dialogPolyfill.registerDialog(modalEnq);
dialogPolyfill.registerDialog(popup);

//Emaulates a database
const ServicesCollection = [
  {
    name: "Branding",
    subtext: "Let us help you realize your brand identity and messaging.",
    items: [
      {
        label: "Consultation",
        packages: [""],
        note: ``
      },
      {
        label: "Rebrand",
        packages: [""],
        note: ``
      },
      {
        label: "Contractual",
        packages: [""],
        note: ``
      }
    ]
  },
  {
    name: "Development",
    subtext: "We design and build for the web.",
    items: [
      {
        label: "Website Redesign",
        packages: [
          "UX Design & Market research",
          "UI Design - Make it look pretty."
        ],
        note: `You have a website, you know 
              something's not right, but just cannot point 
              it out. We like thing of ourselves as experts 
              at nitpicking. Let us help.`
      },
      {
        label: "New Endeavor",
        packages: [
          "UX & UI Design - Pretty with purpose.",
          "Development - From concept to fruition"
        ],
        note: `Think of us as team of Genies; We'll build everything to your specification. A robust, scalable and beautiful application is the only thing we can produce, it's a shame really.`
      },
      {
        label: "e-Commerce",
        packages: ["Webstore", "landing Page", "Dashboard"],
        note: `This deserves it's own category. Shopify, WordPress, ASP.NET hosted application name your platform we make it happen.`
      }
    ]
  },
  {
    name: "Stationary",
    subtext: "From business function to weedings, we got you covered. see...",
    items: [
      {
        label: "Pack 1",
        packages: [],
        note: ``
      },
      {
        label: "Pack 2",
        packages: [],
        note: ``
      },
      {
        label: "Pack 3",
        packages: [],
        note: ``
      }
    ]
  }
];
//Foreach buttom with "learn more" or "show details" text show dialog/modal
let data = null;
const wideLists = document.querySelectorAll(".wide-list");
const [modalList, projectList] = wideLists;

const subText = document.querySelector(".modal .subtext");
learnLinks.forEach((_trigger, index) => {
  _trigger.addEventListener("click", e => {
    const modHead = modalHeads[index].textContent;
    //
    const { hasData, isForm } = e.currentTarget.dataset;

    if (hasData || isForm) {
      data = ServicesCollection[index - 2];
      modals.forEach(modal => resetModal(modal));
      modalList.style.display = "flex";
      populateList(modalList, data);
    } else {
      popup.classList.add("modal--small");
    }
    //
    modalHead.textContent = data ? data.name : modHead;
    subText.textContent = data && data.subtext ? data.subtext : "";
    modalBody.textContent = !data ? modalTexts[index].textContent : "";
    typeof popup.showModal === "function"
      ? popup.showModal()
      : alert("Dialog not supported");
  });
});

// modal list drag and scroll
let mouseDown = false;
let startX;
let scrollLeft;

wideLists.forEach(listEl => {
  listEl.addEventListener("mousedown", e => {
    e.preventDefault();
    mouseDown = true;
    listEl.classList.add("wide-list--dragged");
    startX = e.pageX - listEl.offsetLeft;
    scrollLeft = listEl.scrollLeft;
  });
  listEl.addEventListener("mouseup", () => {
    mouseDown = false;
    listEl.classList.remove("wide-list--dragged");
  });
  listEl.addEventListener("mouseleave", () => {
    mouseDown = false;
    listEl.classList.remove("wide-list--dragged");
  });
  listEl.addEventListener("mouseenter", () => {
    mouseDown = false;
    listEl.classList.remove("wide-list--dragged");
  });
  listEl.addEventListener("mousemove", e => {
    e.preventDefault;
    if (!mouseDown) return;
    const x = e.pageX - listEl.offsetLeft;
    // console.log({ startX, x });
    const dist = (x - startX) * 0.98;

    listEl.scrollLeft = scrollLeft - dist;
  });
});
//
function populateList(_listElement, _data) {
  _listElement.innerHTML = "";
  data && data.items && _data.items.forEach(x => cardSpawn(x, _listElement));
}

function cardSpawn(data, parent) {
  const listItem = document.createElement("li");
  listItem.className = "list__item";

  const itemName = document.createElement("h3");
  itemName.classList.add("item__name");

  itemName.textContent = data.label;
  listItem.appendChild(itemName);

  const package = document.createElement("ul");
  const packHead = document.createElement("p");
  data.packages && (packHead.textContent = "Pack includes-");
  package.appendChild(packHead);

  data.packages &&
    data.packages.forEach(_item => {
      const packItem = document.createElement("li");
      packItem.textContent = _item;
      package.appendChild(packItem);
    });
  listItem.appendChild(package);
  const packNote = document.createElement("p");
  packNote.textContent = data.note;
  listItem.appendChild(packNote);

  const itemActions = document.createElement("div");
  itemActions.className = "card__actions";

  const itemBtn = document.createElement("button");
  itemBtn.className = "btn with-checkbox";
  itemBtn.textContent = "Order";

  const btnIcon = document.createElement("span");
  btnIcon.className = "btn__icon";
  itemBtn.appendChild(btnIcon);

  itemActions.appendChild(itemBtn);
  listItem.appendChild(itemActions);

  ///
  parent.appendChild(listItem);
}

//Used event propagation to target btn.
modalList.addEventListener("click", ({ target }) => {
  const isBtn = [...target.classList].some(x => x === "btn" || "btn__icon");
  if (isBtn) {
    const btn = target;
    const parentCard = target.closest("li");

    parentCard.classList.toggle("checked");
  } else return;
});

function resetModal(modal, all = false) {
  modalList.style.display = "none";
  // modal.querySelector("ul").style.display = "none";

  popup.classList.remove("modal--small");
  modalEnq.classList.remove("modal--large");
}
//Close modal
modalClose.forEach(btn => {
  btn.addEventListener("click", handleModalClose);
});

function handleModalClose(_event) {
  const _modal = _event.currentTarget;
  _modal.closest("dialog").close();
  resetModal(_modal);
}
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

//Utility functions
function isEmail(_phrase) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(_phrase);
}

function hasError(node) {
  isElement(node) && node.classList.add("hasError");
  setTimeout(() => node.classList.remove("hasError"), 400);
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
