/**
 * REGION: Handle enquiry email submission
 *
 *
 *
 * */

const [heroForm, form] = document.querySelectorAll("form");
const emailInput = form.querySelector("#email");

//My email form state
const getEmail = () => localStorage.getItem("sender");
const setEmail = _sender => localStorage.setItem("sender", _sender);

const getText = () => localStorage.getItem("text");
const setText = _text => localStorage.setItem("text", _text);

const DEFAULT_ENQUIRY_MSG =
  "Hello, please email me back, I need information on your offerrings.";

const bindEnquiry = (_sender, _text) => {
  setEmail(_sender);
  setText(_text);
  /**
   * Extras: should probably move this elsewhere
   * If enquiry modal is closed open it.
   */
  !enqModal.open && enqModal.showModal();
};

/**
 * Hero form submit from here
 *
 */
heroForm.addEventListener("submit", e => {
  e.preventDefault();
  const heroEmail = heroForm.querySelector("#hero__email").value;
  isEmail(heroEmail)
    ? prepareSubmit(heroEmail, DEFAULT_ENQUIRY_MSG)
    : hasError(heroForm);
});
/**
 * Enquiry modal from here
 */
const enqModal = document.querySelector(".modal--enquiry");

const handleInitialSubmit = e => {
  //Prevent reload
  e.preventDefault();
  //Email validation
  const sender = emailInput.value.trim();
  const isValidEmail = isEmail(sender);
  modalEnq.classList.add("modal--small");
  /**
   * Build default enquiry message
   */
  const enquiryMessageText =
    DEFAULT_ENQUIRY_MSG +
    " - I'm interested mostly in the following; " +
    (localStore() &&
      localStore()
        .map(p => `${p.title}`)
        .join(", "));
  /**
   * Validate user email, bind email to state if vaild, signal error if invaild
   */
  isValidEmail ? bindEnquiry(sender, enquiryMessageText) : hasError(form);
  /**
   * Close modal afterward
   */
  popup.close();
};
form.addEventListener("submit", handleInitialSubmit);

const btnShowEnq = document.querySelector("#showEnq");
const enqForm = document.querySelector(".enquiry__form");
const btnSubmitEnq = document.querySelector("#enqSubmit");
const btnJustSubmit = document.querySelector("#btnJustSubmit");

let enquiryBody = enqForm.querySelector("#enquiryBody");
//Show enquiry form
function showEnquiryForm() {
  enqModal.classList.add("modal--large");
  enqForm.classList.add("show");
  enqForm.querySelector("#modalEmail").value = getEmail();
  enquiryBody.value = getText();
}

btnShowEnq.addEventListener("click", showEnquiryForm);

const loader = document.querySelector(".loader");

function showToast(msg, error = false) {
  loader.style.display = "none";

  popup.classList.add("modal--small", "toasty");
  const _msg = !error
    ? "Your enquiry has been sent, we'll get back to you soon!"
    : `Something is not right! <br/>
      <strong>${msg}</strong>`;

  modalHead.textContent = !error ? "Good News!" : "Sorry";
  subText.textContent = "";
  modalBody.innerHTML = _msg;
  typeof popup.showModal === "function"
    ? !popup.open && popup.showModal()
    : alert("Dialog not supported");
}

//TODO:implement rate limiting on server
function prepareSubmit(sender = getEmail(), text = getText()) {
  const body = {
    sender,
    text
  };

  submitEnquiry(body);
  enqForm.classList.remove("show");
  btnJustSubmit.closest("dialog").close();
  console.log("Just submit");
}

//If user clicks just submit on "Before you go dialog"
const enquiryEmail = document.getElementById("email");

btnJustSubmit.addEventListener("click", () => {
  prepareSubmit(enquiryEmail.value, DEFAULT_ENQUIRY_MSG);
});

btnSubmitEnq.addEventListener("click", () => {
  //First bind and combine updated enquiry form date with
  // option services cart items
  bindEnquiry(enquiryEmail.value, enquiryBody.value);
  prepareSubmit();
});

/**
 * This submit the enquiry to a email server
 * */
async function submitEnquiry(body) {
  const url = "https://filr-server.appspot.com/api/messages";
  const headers = { "Content-Type": "application/json" };
  const options = { body: JSON.stringify(body), method: "POST", headers };
  debugger;
  loader.style.display = "block";

  await fetch(url, options)
    .then(res => {
      showToast(res);
    })
    .catch(res => showToast(res, true));
}

//Cart counter
const cartCounter = document.querySelector(".cart-counter");
function updateCartCounter() {
  const count = localStore().length;
  const surffix = count > 1 ? "ies" : "y";
  cartCounter.textContent = `${count} enquir${surffix}`;
}
cartCounter.addEventListener("click", e => {
  //TODO: toggle form
  hasError(form);
  hasError(heroForm);
});
