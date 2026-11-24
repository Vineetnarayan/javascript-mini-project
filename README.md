# FreshWash — Laundry Services Web App (JS Mini Project)

A responsive Laundry Services Web Application built with **HTML5**, **CSS3**, and **Vanilla JavaScript** with **EmailJS** order confirmation support.

## Features
- **Responsive Navigation Bar** with smooth section scrolling, mobile menu, and customizable display username.
- **Hero Section & Achievements Banner** highlighting key service metrics.
- **Interactive Service Cart**: Add or remove laundry services (`Dry Cleaning`, `Wash & Fold`, `Ironing`, `Stain Removal`, `Leather & Suede Cleaning`, `Wedding Dress Cleaning`) with live item count and total amount calculation.
- **Booking Form & EmailJS Integration**: Validates customer details and cart items, then sends order confirmation emails via EmailJS.
- **Quality Highlights & Newsletter Subscription**: Clean 4-column feature grid and interactive newsletter signup.

## Project Structure
```
laundry-services-web-app/
├── index.html
├── styles.css
├── script.js
├── assets/
│   └── hero-laundry.jpg
└── README.md
```

## EmailJS Setup
1. Create a free account on [EmailJS](https://www.emailjs.com/).
2. Create an Email Service and an Email Template using variables:
   - `{{customer_name}}`
   - `{{customer_email}}`
   - `{{customer_phone}}`
   - `{{order_details}}`
   - `{{total_amount}}`
3. Open `script.js` and replace `PUBLIC_KEY`, `SERVICE_ID`, and `TEMPLATE_ID` inside `EMAILJS_CONFIG`.
