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
    ? handleSubmit(heroEmail, "From heroo section")
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
   * Validate user email, bind email to state if vaild, signal error if invaild
   */
  isValidEmail ? bindEnquiry(sender, "initial test message") : hasError(form);
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
/**
 * This submit the enquiry to a email server
 * */
async function submitEnquiry(body) {
  const url = "https://filr-server.appspot.com/api/messages";
  const headers = { "Content-Type": "application/json" };
  const options = { body: JSON.stringify(body), method: "POST", headers };

  loader.style.display = "block";

  await fetch(url, options)
    .then(res => {
      showToast(res);
    })
    .catch(res => showToast(res, true));
}

//TODO:implement rate limiting on server
function handleSubmit(sender = getEmail(), text = getText()) {
  const body = {
    sender,
    text
  };

  submitEnquiry(body);
  enqForm.classList.remove("show");
  btnJustSubmit.closest("dialog").close();
}

btnJustSubmit.addEventListener("click", handleSubmit);

const enquiryEmail = document.querySelector("#modalEmail");

btnSubmitEnq.addEventListener("click", () => {
  bindEnquiry(enquiryEmail.value, enquiryBody.value);
  handleSubmit();
});
