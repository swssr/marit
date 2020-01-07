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
const readMoreBtns = document.querySelectorAll(".card--info .link--more");
const details = document.querySelectorAll(".card--info details summary");

readMoreBtns.forEach((btn, index) => {
  btn.addEventListener("click", () => details[index].click());
});
//
const modals = document.querySelectorAll(".modal");
const modalHead = document.querySelector(".modal__head");
const modalBody = document.querySelector(".modal__text");
const modalClose = document.querySelectorAll("#btnModalClose");

const [popup, modalEnq] = modals;
//Dialog polyfill
dialogPolyfill.registerDialog(modalEnq);
dialogPolyfill.registerDialog(popup);

/**
 * Emulates a database or State.
 * I could've saved a lot of time by using react. I know!
 * */
const State = {
  services: [
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
      subtext: "Branded useful stuff, we got you.",
      items: [
        {
          label: "Merch",
          packages: ["Shirts, Hoodies", "Phone cases.", "Say it."],
          note: `See branded merchendise.`
        },
        {
          label: "Office",
          packages: ["Writting stationary.", "Calenders"],
          note: `Brand your office supplies. Everyone one likes this one.`
        },
        {
          label: "Event Supplies",
          packages: ["Posters", "Invitaions", "Other cool stuff"],
          note: `You've probably been planning this for a while now, we provide the above and more tastefully.`
        }
      ]
    }
  ]
};
// localStorage.setItem("cart", []);
const CartState = {
  sender: "",
  items: [],
  find(item) {
    return this.get().items.find(_item => _item.p === item.title);
  },
  get() {
    /**
     * @summary WIll get cart object from local storage.
     * @desc Get latest cart from local storage
     * @returns cart object.
     * */
    const cartStr = localStorage.getItem("cart");
    return cartStr ? JSON.parse(cartStr) : { items: [] };
  },
  set(item) {
    //@params
    console.log({ item });
    const cart = this.get();
    this.items = cart.items;
    !this.find(item) && localStorage.setItem("cart", JSON.stringify(cart));
    return { item, cart };
  },
  remove(item = {}) {
    const updatedCart = this.cart.filter(x => x.title !== item.title);
    this.reset(updatedCart);
    return updatedCart;
  },
  reset(force = []) {
    const cartStr = JSON.stringify(force);
    localStorage.setItem("cart", cartStr);
  }
};

//Foreach buttom with "learn more" or "show details" text show dialog/modal
let data = null;
const wideLists = document.querySelectorAll(".wide-list");
const [modalList, projectList] = wideLists;

const subText = document.querySelector(".modal .subtext");
const serviceTriggers = document.querySelectorAll(".service .link--more");

serviceTriggers.forEach((_trigger, index) => {
  _trigger.addEventListener("click", e => {
    //
    const { isForm } = e.currentTarget.dataset;
    data = State.services[index];
    resetModal(true);

    const _cards = e.target;

    if (data || isForm) {
      modalList.style.display = "flex";
      populateList(modalList, data);
      popup.classList.add("modal--fullscreen");
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
  _listElement.dataset.serviceGroup = _data.name;

  data &&
    data.items &&
    _data.items.forEach((serviceItem, index) =>
      cardSpawn(serviceItem, _listElement)
    );

  /**Persist checked
   * */
  const cards = modalList.childNodes;
  cards.forEach(card => persistChecked(card));
}

function cardSpawn(data, parent) {
  const listItem = document.createElement("li");
  listItem.className = "list__item";
  listItem.dataset.title = data.label;

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
  packNote.className = "note";
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
  listItem.dataset.group = parent.dataset.serviceGroup;
}
//Reset local storage on load
localStorage.setItem("cart", JSON.stringify([]));
//Add to cart
const localStore = () => JSON.parse(localStorage.getItem("cart")) || [];
//Used event propagation to target btn.
modalList.addEventListener("click", ({ target }) => {
  const isBtn = [...target.classList].some(x => x === "btn" || "btn__icon");
  if (isBtn) {
    const btn = target;

    const parentCard = target.closest("li");
    const { group, title } = parentCard.dataset;

    let item = {
      title,
      group
    };
    toggleItemOnCart(item);
    /**
     * Persist card check based on cart items
     */
    persistChecked(parentCard);
  } else return;
});
function persistChecked(card) {
  const isInCart = localStore().some(p => p.title === card.dataset.title);
  console.log(isInCart);
  if (isInCart) {
    card.classList.add("checked");
  } else {
    card.classList.remove("checked");
  }
}
function toggleItemOnCart(item) {
  // const cartItems = CartState.set(item);
  const cart = localStore();
  const alreadyExists = cart.some(p => p.title === item.title);
  let updatedCart;
  if (!alreadyExists) {
    updatedCart = [...cart, item];
    const cartStr = JSON.stringify(updatedCart);
    localStorage.setItem("cart", cartStr);
  } else {
    updatedCart = localStore().filter(p => p.title !== item.title);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }
}
function resetModal(all = false, modal) {
  modalList.style.display = "none";
  // modal.querySelector("ul").style.display = "none";

  all &&
    modals.forEach(_modal => {
      _modal.classList.remove("modal--small");
      _modal.classList.remove("modal--large");
      _modal.classList.remove("modal--fullscreen");
    });
}
//Close modal
modalClose.forEach(btn => {
  btn.addEventListener("click", handleModalClose);
});

function handleModalClose(_event) {
  const _modal = _event.currentTarget;
  _modal.closest("dialog").close();

  resetModal(true, _modal);
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
