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
    preface: "Let us help you realize your brand identity and messaging.",
    items: [
      {
        img:
          "https://images.unsplash.com/photo-1561070791-36c11767b26a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80",
        label: "Logo"
      },
      {
        img:
          "https://images.unsplash.com/photo-1561070791-36c11767b26a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80",
        label: "Business Card"
      },
      {
        img:
          "https://images.unsplash.com/photo-1561070791-36c11767b26a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80",
        label: "Posters, Banners"
      },
      {
        img:
          "https://images.unsplash.com/photo-1561070791-36c11767b26a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=700&q=80",
        label: "letterhead"
      }
    ]
  },
  {
    name: "Web development",
    preface: "World class web design is our middlename. scroll and order",
    items: [
      {
        img:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
        label: "Single page website"
      },
      {
        img:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
        label: "Three page website"
      },
      {
        img:
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
        label: "Business Process"
      }
    ]
  },
  {
    name: "Stationary",
    preface: "From business function to weedings, we got you covered. see...",
    items: [
      {
        img:
          "https://res.cloudinary.com/swssr/image/upload/v1567471226/swssr/merit/tlf7duzdismorkb9swaz.png",
        label: "Pack 1"
      },
      {
        img:
          "https://res.cloudinary.com/swssr/image/upload/v1567471226/swssr/merit/tlf7duzdismorkb9swaz.png",
        label: "Pack 2"
      },
      {
        img:
          "https://res.cloudinary.com/swssr/image/upload/v1567471226/swssr/merit/tlf7duzdismorkb9swaz.png",
        label: "Pack 3"
      },
      {
        img:
          "https://res.cloudinary.com/swssr/image/upload/v1567471226/swssr/merit/tlf7duzdismorkb9swaz.png",
        label: "Pack 4"
      },
      {
        img:
          "https://res.cloudinary.com/swssr/image/upload/v1567471226/swssr/merit/tlf7duzdismorkb9swaz.png",
        label: "Pack 5"
      }
    ]
  }
];
//Foreach buttom with "learn more" or "show details" text show dialog/modal
let data = null;
const listEl = document.querySelector(".modal .wide-list");

learnLinks.forEach((_trigger, index) => {
  _trigger.addEventListener("click", e => {
    const modHead = modalHeads[index].textContent;
    //
    const { hasData, isForm } = e.currentTarget.dataset;

    if (hasData || isForm) {
      data = ServicesCollection[index - 2];
      resetModal();
      listEl.style.display = "flex";
      populateList(listEl, data);
    } else {
      popup.classList.add("modal--small");
    }
    //
    modalHead.textContent = data ? data.name : modHead;
    modalBody.textContent = data ? data.preface : modalTexts[index].textContent;
    typeof popup.showModal === "function"
      ? popup.showModal()
      : alert("Dialog not supported");
  });
});

// modal list drag and scroll
let mouseDown = false;
let startX;
let scrollLeft;

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
//
function populateList(_listElement, _data) {
  _listElement.innerHTML = "";
  data &&
    data.items &&
    _data.items.forEach(x => {
      const listItem = document.createElement("li");
      listItem.className = "list__item card card--product";
      const itemImg = document.createElement("img");
      itemImg.className = "card__img";
      itemImg.src = x.img;
      listItem.appendChild(itemImg);
      const itemName = document.createElement("h3");
      itemName.classList.add("member__name");
      itemName.textContent = x.label;
      listItem.appendChild(itemName);
      const itemList = document.createElement("ul");
      const itemActions = document.createElement("div");
      itemActions.className = "card__actions";
      const itemBtn = document.createElement("button");
      itemBtn.className = "btn btn--primary card__btn";
      itemBtn.textContent = "Order";
      itemActions.appendChild(itemBtn);
      listItem.appendChild(itemActions);
      _listElement.appendChild(listItem);
    });
}
function resetModal() {
  listEl.style.display = "none";
  popup.classList.remove("modal--small");
  modalEnq.classList.remove("modal--large");
}
//Close modal
modalClose.forEach(btn => {
  btn.addEventListener("click", handleModalClose);
});

function handleModalClose(_event) {
  _event.currentTarget.closest("dialog").close();
  resetModal();
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

//Handle email form submit
const [heroForm, form] = document.querySelectorAll("form");
const emailInput = form.querySelector("#email");
const modalEmailInput = document.querySelector("#modalEmail");

const formData = new FormData();

const bindFormData = ({ email, body }) => {
  formData.append("email", email);
  formData.append("body", body);
  enqModal.showModal();
};

const submitForm = _formData => {
  console.log(_formData.getAll("email"));

  fetch("someapi.com/enquiry", {
    body: _formData,
    method: "POST"
  })
    .then(console.log)
    .catch(console.log);
};
//Enquiry modal popup
const enqModal = document.querySelector(".modal--enquiry");
const handleFormSubmit = e => {
  e.preventDefault();

  const email = emailInput.value.trim();
  //Email validation
  const isValidEmail = isEmail(email);

  popup.close();

  if (isValidEmail) {
    const _data = {
      email,
      body: ""
    };
    bindFormData(_data);
  } else {
    //Adds error class to form
    hasError(form);
  }
};
form.addEventListener("submit", handleFormSubmit);

const btnShowEnq = document.querySelector("#showEnq");
const enqForm = document.querySelector(".enquiry__form");
const btnSubmitEnq = document.querySelector("#enqSubmit");
const btnJustSubmit = document.querySelector("#btnJustSubmit");
const enquiryBody = enqForm.querySelector("#enquiryBody").value;
//Show enquiry form
function showEnquiryForm() {
  enqModal.classList.add("modal--large");
  enqForm.classList.add("show");
  enqForm.querySelector("#modalEmail").value = formData.get("email");
  enquiryBody = formData.get("body") || "";
}

btnShowEnq.addEventListener("click", showEnquiryForm);

//Submit enquiry to server
const submitEnquiry = _formData => submitForm(_formData);

//TODO:implement rate limiting
const handleSubmit = (_formData = formData) => {
  enqForm.classList.remove("show");
  btnJustSubmit.closest("dialog").close();
  submitEnquiry(_formData);
};

btnJustSubmit.addEventListener("click", () => {
  bindFormData({ body: enquiryBody });
  handleSubmit();
});
btnSubmitEnq.addEventListener("click", handleSubmit);
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
