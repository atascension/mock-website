/* ============================================================
   script.js — Alex Morgan Portfolio
   ============================================================
   This file contains three features:
     1. Mobile navigation menu toggle
     2. Project modal open / close
     3. Contact form validation and confirmation
   ============================================================ */


/* ============================================================
   1. MOBILE NAVIGATION MENU TOGGLE
   ============================================================
   Shows and hides the navigation links on small screens
   when the hamburger (☰) button is clicked.
   Also closes the menu when any nav link is tapped,
   since this is a single-page site with anchor links.
   ============================================================ */

var hamburger = document.getElementById('nav-hamburger');
var navLinks  = document.getElementById('nav-links');

/**
 * toggleMobileMenu
 * Adds or removes the .is-open class on the nav links list
 * and the hamburger button. The .is-open class is what CSS
 * uses to show the dropdown and animate the hamburger icon.
 * Also updates aria-expanded so screen readers know the state.
 */
function toggleMobileMenu() {
  var isOpen = navLinks.classList.toggle('is-open');
  hamburger.classList.toggle('is-open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

hamburger.addEventListener('click', toggleMobileMenu);

/* Close the mobile menu when any nav link is clicked.
   This ensures the menu collapses after smooth-scrolling to a section. */
navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});


/* ============================================================
   2. PROJECT MODAL
   ============================================================
   Opens a full-screen overlay when a project card is clicked.
   Reads the project title, description, and image path from
   data-* attributes on the card element, then populates the
   modal with that content.

   Closes when:
     - The × button is clicked
     - The user clicks outside the modal box (on the overlay)
     - The user presses the Escape key
   ============================================================ */

var modalOverlay = document.getElementById('modal-overlay');
var modalClose   = document.getElementById('modal-close');
var modalImg     = document.getElementById('modal-img');
var modalTitle   = document.getElementById('modal-title');
var modalDesc    = document.getElementById('modal-desc');

/**
 * openModal
 * Reads data from the clicked project card and fills in
 * the modal's image, title, and description fields.
 * Then shows the modal by adding the .is-open class.
 *
 * @param {HTMLElement} card - The project card that was clicked
 */
function openModal(card) {
  var title       = card.getAttribute('data-title')       || '';
  var description = card.getAttribute('data-description') || '';
  var imgSrc      = card.getAttribute('data-img')         || '';
  var imgAlt      = card.getAttribute('data-img-alt')     || title;

  modalTitle.textContent = title;
  modalDesc.textContent  = description;
  modalImg.src           = imgSrc;
  modalImg.alt           = imgAlt;

  /* Show the modal */
  modalOverlay.classList.add('is-open');
  modalOverlay.setAttribute('aria-hidden', 'false');

  /* Prevent the page behind from scrolling while the modal is open */
  document.body.style.overflow = 'hidden';

  /* Move keyboard focus to the close button for accessibility */
  modalClose.focus();
}

/**
 * closeModal
 * Hides the modal overlay and restores normal page scrolling.
 */
function closeModal() {
  modalOverlay.classList.remove('is-open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* Attach click (and keyboard) handlers to each project card */
document.querySelectorAll('.project-card').forEach(function (card) {

  /* Open modal on mouse click */
  card.addEventListener('click', function () {
    openModal(card);
  });

  /* Open modal on Enter or Space key (for keyboard-only users) */
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card);
    }
  });

});

/* Close modal via the × button */
modalClose.addEventListener('click', closeModal);

/* Close modal when clicking the dark overlay area (outside the box) */
modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

/* Close modal when the Escape key is pressed */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && modalOverlay.classList.contains('is-open')) {
    closeModal();
  }
});


/* ============================================================
   3. CONTACT FORM VALIDATION + CONFIRMATION
   ============================================================
   Runs when the contact form is submitted.

   Steps:
     1. Prevent the default page reload.
     2. Check each field for valid input.
     3. If anything is wrong, show an error message under
        the relevant field and stop submission.
     4. If everything is valid, show a success confirmation
        message and reset the form.
   ============================================================ */

var contactForm  = document.getElementById('contact-form');
var nameInput    = document.getElementById('name');
var emailInput   = document.getElementById('email');
var messageInput = document.getElementById('message');
var nameError    = document.getElementById('name-error');
var emailError   = document.getElementById('email-error');
var messageError = document.getElementById('message-error');
var formSuccess  = document.getElementById('form-success');

/**
 * isValidEmail
 * Returns true if the string looks like a valid email address.
 * Uses a simple regex that checks for the pattern: x@x.x
 *
 * @param  {string}  email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * handleFormSubmit
 * Validates the three form fields and either:
 *   - Shows inline error messages for any invalid fields, or
 *   - Clears the form and shows a success confirmation.
 *
 * @param {Event} event - The form submit event
 */
function handleFormSubmit(event) {
  /* Stop the browser from submitting and reloading the page */
  event.preventDefault();

  /* Clear any previous error and success messages */
  nameError.textContent    = '';
  emailError.textContent   = '';
  messageError.textContent = '';
  formSuccess.textContent  = '';

  /* Read and trim each field value */
  var nameValue    = nameInput.value.trim();
  var emailValue   = emailInput.value.trim();
  var messageValue = messageInput.value.trim();

  /* Track whether we found any errors */
  var hasError = false;

  /* Validate: name must not be empty */
  if (!nameValue) {
    nameError.textContent = 'Please enter your name.';
    hasError = true;
  }

  /* Validate: email must not be empty and must look like an email */
  if (!emailValue) {
    emailError.textContent = 'Please enter your email address.';
    hasError = true;
  } else if (!isValidEmail(emailValue)) {
    emailError.textContent = 'Please enter a valid email address.';
    hasError = true;
  }

  /* Validate: message must not be empty */
  if (!messageValue) {
    messageError.textContent = 'Please tell me what you need help with.';
    hasError = true;
  }

  /* If there were any errors, stop here — don't show success */
  if (hasError) {
    return;
  }

  /* All fields are valid — show the confirmation message */
  formSuccess.textContent =
    'Thanks, ' + nameValue + '! Your message has been sent. ' +
    'I\'ll be in touch within 24 hours.';

  /* Reset all form fields back to empty */
  contactForm.reset();
}

contactForm.addEventListener('submit', handleFormSubmit);


/* ============================================================
   PROJECT IMAGE ERROR HANDLING
   ============================================================
   If a project image fails to load (because the file doesn't
   exist yet in /images/), hide the broken image icon so the
   placeholder background shows cleanly underneath.
   ============================================================ */
document.querySelectorAll('.project-img').forEach(function (img) {
  img.addEventListener('error', function () {
    img.style.display = 'none';
  });
});
