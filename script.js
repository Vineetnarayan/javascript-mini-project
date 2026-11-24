// =========================================================
// EmailJS Configuration
// Replace these with your own EmailJS credentials from:
// https://dashboard.emailjs.com/
// =========================================================
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "YOUR_EMAILJS_PUBLIC_KEY",
  SERVICE_ID: "YOUR_EMAILJS_SERVICE_ID",
  TEMPLATE_ID: "YOUR_EMAILJS_TEMPLATE_ID",
};

// Initialize EmailJS if keys are configured
if (
  typeof emailjs !== "undefined" &&
  EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY"
) {
  emailjs.init({ publicKey: EMAILJS_CONFIG.PUBLIC_KEY });
}

// =========================================================
// Laundry Services Data
// =========================================================
const SERVICES = [
  { id: 1, name: "Dry Cleaning", price: 200, emoji: "👔" },
  { id: 2, name: "Wash & Fold", price: 100, emoji: "🧺" },
  { id: 3, name: "Ironing", price: 30, emoji: "♨️" },
  { id: 4, name: "Stain Removal", price: 500, emoji: "✨" },
  { id: 5, name: "Leather & Suede Cleaning", price: 999, emoji: "🧥" },
  { id: 6, name: "Wedding Dress Cleaning", price: 2800, emoji: "👗" },
];

// Application State
let cart = [];

// DOM Elements
const servicesListEl = document.getElementById("servicesList");
const cartTableBodyEl = document.getElementById("cartTableBody");
const emptyCartStateEl = document.getElementById("emptyCartState");
const totalAmountEl = document.getElementById("totalAmount");
const cartCountBadgeEl = document.getElementById("cartCountBadge");
const bookingFormEl = document.getElementById("bookingForm");
const bookingFeedbackEl = document.getElementById("bookingFeedback");
const bookNowBtnEl = document.getElementById("bookNowBtn");
const newsletterFormEl = document.getElementById("newsletterForm");
const newsletterFeedbackEl = document.getElementById("newsletterFeedback");
const mobileMenuBtnEl = document.getElementById("mobileMenuBtn");
const navLinksEl = document.getElementById("navLinks");
const usernameBtnEl = document.getElementById("usernameBtn");
const usernameLabelEl = document.getElementById("usernameLabel");
const userModalEl = document.getElementById("userModal");
const usernameInputEl = document.getElementById("usernameInput");
const closeModalBtnEl = document.getElementById("closeModalBtn");
const saveUsernameBtnEl = document.getElementById("saveUsernameBtn");

// =========================================================
// Render Services List
// =========================================================
function renderServices() {
  servicesListEl.innerHTML = "";
  SERVICES.forEach((service) => {
    const inCart = cart.some((item) => item.id === service.id);
    const li = document.createElement("li");
    li.className = "service-item";
    li.innerHTML = `
      <div class="service-info">
        <span class="service-emoji" aria-hidden="true">${service.emoji}</span>
        <span class="service-name">${service.name}</span>
        <span class="service-dot">•</span>
        <span class="service-price">₹${service.price.toFixed(2)}</span>
      </div>
      <button
        type="button"
        class="btn-service ${inCart ? "btn-remove" : "btn-add"}"
        data-id="${service.id}"
      >
        ${inCart ? "Remove Item ⊖" : "Add Item ⊕"}
      </button>
    `;
    servicesListEl.appendChild(li);
  });
}

// =========================================================
// Render Cart & Total
// =========================================================
function renderCart() {
  cartTableBodyEl.innerHTML = "";

  if (cart.length === 0) {
    emptyCartStateEl.style.display = "block";
  } else {
    emptyCartStateEl.style.display = "none";
    cart.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${item.name}</td>
        <td class="text-right">₹${item.price.toFixed(2)}</td>
      `;
      cartTableBodyEl.appendChild(tr);
    });
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalAmountEl.textContent = `₹${total.toFixed(2)}`;
  cartCountBadgeEl.textContent = `${cart.length} ${cart.length === 1 ? "item" : "items"}`;
}

// Toggle item in cart
function toggleCartItem(serviceId) {
  const existingIndex = cart.findIndex((item) => item.id === serviceId);
  if (existingIndex !== -1) {
    cart.splice(existingIndex, 1);
  } else {
    const service = SERVICES.find((s) => s.id === serviceId);
    if (service) {
      cart.push(service);
    }
  }
  bookingFeedbackEl.textContent = "";
  bookingFeedbackEl.className = "form-feedback";
  renderServices();
  renderCart();
}

// Event delegation for service buttons
servicesListEl.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-id]");
  if (!btn) return;
  const serviceId = Number(btn.getAttribute("data-id"));
  toggleCartItem(serviceId);
});

// =========================================================
// Booking Form + EmailJS Integration
// =========================================================
bookingFormEl.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const emailId = document.getElementById("emailId").value.trim();
  const phoneNumber = document.getElementById("phoneNumber").value.trim();

  if (cart.length === 0) {
    bookingFeedbackEl.className = "form-feedback error";
    bookingFeedbackEl.textContent =
      "ⓘ Please add at least one laundry service to your cart before booking.";
    return;
  }

  if (!fullName || !emailId || !phoneNumber) {
    bookingFeedbackEl.className = "form-feedback error";
    bookingFeedbackEl.textContent =
      "ⓘ Please fill in your Full Name, Email ID, and Phone Number.";
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailId)) {
    bookingFeedbackEl.className = "form-feedback error";
    bookingFeedbackEl.textContent = "ⓘ Please enter a valid Email ID.";
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const orderSummary = cart
    .map((item, i) => `${i + 1}. ${item.name} (₹${item.price.toFixed(2)})`)
    .join("\n");

  const templateParams = {
    customer_name: fullName,
    customer_email: emailId,
    customer_phone: phoneNumber,
    order_details: orderSummary,
    total_amount: `₹${totalAmount.toFixed(2)}`,
  };

  bookNowBtnEl.disabled = true;
  bookNowBtnEl.textContent = "Booking...";

  const hasLiveEmailJS =
    typeof emailjs !== "undefined" &&
    EMAILJS_CONFIG.PUBLIC_KEY !== "YOUR_EMAILJS_PUBLIC_KEY" &&
    EMAILJS_CONFIG.SERVICE_ID !== "YOUR_EMAILJS_SERVICE_ID" &&
    EMAILJS_CONFIG.TEMPLATE_ID !== "YOUR_EMAILJS_TEMPLATE_ID";

  try {
    if (hasLiveEmailJS) {
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
      );
    }
    bookingFeedbackEl.className = "form-feedback success";
    bookingFeedbackEl.textContent = `✓ Thank you For Booking the Service, ${fullName}! Order total: ₹${totalAmount.toFixed(2)}. We will get back to you soon!`;
    cart = [];
    bookingFormEl.reset();
    renderServices();
    renderCart();
  } catch (error) {
    bookingFeedbackEl.className = "form-feedback error";
    bookingFeedbackEl.textContent =
      "ⓘ Could not send confirmation email right now. Please check your EmailJS configuration.";
  } finally {
    bookNowBtnEl.disabled = false;
    bookNowBtnEl.textContent = "Book Now";
  }
});

// =========================================================
// Newsletter Form
// =========================================================
newsletterFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("newsletterName").value.trim();
  const email = document.getElementById("newsletterEmail").value.trim();
  if (!name || !email) {
    newsletterFeedbackEl.textContent = "Please enter both your name and email.";
    return;
  }
  newsletterFeedbackEl.textContent = `Thanks for subscribing, ${name}!`;
  newsletterFormEl.reset();
});

// =========================================================
// Mobile Menu & Username Modal
// =========================================================
mobileMenuBtnEl.addEventListener("click", () => {
  const isOpen = navLinksEl.classList.toggle("open");
  mobileMenuBtnEl.setAttribute("aria-expanded", String(isOpen));
});

navLinksEl.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navLinksEl.classList.remove("open");
    mobileMenuBtnEl.setAttribute("aria-expanded", "false");
  }
});

function loadSavedUsername() {
  try {
    const saved = localStorage.getItem("freshwash_username");
    if (saved) usernameLabelEl.textContent = saved;
  } catch (e) {
    // Ignore storage restriction
  }
}

usernameBtnEl.addEventListener("click", () => {
  usernameInputEl.value =
    usernameLabelEl.textContent === "Username" ? "" : usernameLabelEl.textContent;
  userModalEl.hidden = false;
  usernameInputEl.focus();
});

closeModalBtnEl.addEventListener("click", () => {
  userModalEl.hidden = true;
});

saveUsernameBtnEl.addEventListener("click", () => {
  const newName = usernameInputEl.value.trim();
  if (newName) {
    usernameLabelEl.textContent = newName;
    try {
      localStorage.setItem("freshwash_username", newName);
    } catch (e) {
      // Ignore storage restriction
    }
  }
  userModalEl.hidden = true;
});

userModalEl.addEventListener("click", (event) => {
  if (event.target === userModalEl) {
    userModalEl.hidden = true;
  }
});

// Initialize App
loadSavedUsername();
renderServices();
renderCart();
