const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", mobileMenu);

function mobileMenu() {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

// Close navbar when link is clicked
const navLink = document.querySelectorAll(".nav-link");

navLink.forEach((n) => n.addEventListener("click", closeMenu));

function closeMenu() {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}

//Adding date

let myDate = document.querySelector("#datee");

const yes = new Date().getFullYear();
myDate.innerHTML = yes;

// Project detail dialog
// Each card carrying data-details has a matching <template data-details-for="…">
// in index.html; its contents are cloned into the dialog on open.

const projectModal = document.querySelector("#project-modal");
const projectModalBody = document.querySelector("#project-modal-body");
const detailCards = document.querySelectorAll(".card[data-details]");

if (projectModal && projectModalBody) {
  const closeButton = projectModal.querySelector(".project-modal-close");
  let lastFocused = null;

  function openProjectModal(card) {
    const key = card.dataset.details;
    const template = document.querySelector(
      'template[data-details-for="' + key + '"]'
    );
    if (!template) return;

    projectModalBody.replaceChildren(template.content.cloneNode(true));

    const title = projectModalBody.querySelector(".detail-title");
    projectModal.setAttribute(
      "aria-label",
      title ? title.textContent.trim() : "Project details"
    );

    // Drives the dialog's accent colour (see --detail-accent in utilities.css)
    if (card.dataset.brand) {
      projectModal.dataset.brand = card.dataset.brand;
    } else {
      delete projectModal.dataset.brand;
    }

    lastFocused = card;
    projectModal.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeProjectModal() {
    projectModal.hidden = true;
    projectModalBody.replaceChildren();
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
    lastFocused = null;
  }

  detailCards.forEach((card) => {
    card.addEventListener("click", () => openProjectModal(card));

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProjectModal(card);
      }
    });
  });

  projectModal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", closeProjectModal);
  });

  document.addEventListener("keydown", (e) => {
    if (projectModal.hidden) return;

    if (e.key === "Escape") {
      closeProjectModal();
      return;
    }

    // Keep focus inside the dialog while it is open
    if (e.key === "Tab") {
      const focusable = projectModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}
