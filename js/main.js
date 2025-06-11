(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let element = select(el);
    if (!element) return;

    let header = select("#header");
    let offset = header.offsetHeight;

    if (!header.classList.contains("header-scrolled")) {
      offset -= 20;
    }

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });
  /**
   * Gallery Slider
   */
  new Swiper(".gallery-slider", {
    speed: 400,
    loop: true,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      575: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      992: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
    },
  });

  /**
   * Buy tickets select the ticket type on click
   */
  on("show.bs.modal", "#buy-ticket-modal", function (event) {
    select("#buy-ticket-modal #ticket-type").value =
      event.relatedTarget.getAttribute("data-ticket-type");
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });
})();

function loadSpeaker(id, event) {
  event.preventDefault(); // ❗ Evita que se cambie de página antes de tiempo

  fetch("./data/speakers.json")
    .then((res) => res.json())
    .then((data) => {
      const speaker = data[id];
      if (speaker) {
        localStorage.setItem("selectedSpeaker", JSON.stringify(speaker)); // Guardar datos en localStorage
        window.location.href = "speaker-details.html"; // Redirigir a la página de detalles
      } else {
        alert("Orador no encontrado");
      }
    })
    .catch((error) => {
      console.error("Error al cargar los datos:", error);
    });
}
document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("selectedSpeaker"));

  if (data) {
    const nameEl = document.getElementById("detail-name");
    const bioEl = document.getElementById("detail-inf");
    const imgEl = document.getElementById("detail-image");

    if (nameEl) nameEl.textContent = data.name;
    if (bioEl) bioEl.textContent = data.bio;
    if (imgEl) imgEl.src = data.photo;

    // Ocultar la sección de redes sociales si el orador es "Ailén Ramírez y Lorena Montenegro"
    const socialSection = document.querySelector(".social");
    if (socialSection) {
      // Comprobamos si el orador es "Ailén Ramírez y Lorena Montenegro"
      if (data.name.includes("Ailén Ramírez") && data.name.includes("Lorena Montenegro")) {
        socialSection.style.display = "none"; // Ocultar redes sociales
      } else {
        socialSection.style.display = "block"; // Mostrar redes sociales
      }
    }

    // Cargar redes sociales si existen
    if (data.socials) {
      const emailLink = document.getElementById("email-link");
      const facebookLink = document.getElementById("facebook-link");

      if (emailLink && data.socials.email) emailLink.href = data.socials.email;
      if (facebookLink && data.socials.facebook) facebookLink.href = data.socials.facebook;
    }
  }
});

/**
 * Mobile nav toggle
 */
document
  .querySelector(".mobile-nav-toggle")
  .addEventListener("click", function (e) {
    document.querySelector("#navbar").classList.toggle("mobile-nav");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

/**
 * Mobile nav dropdowns activate
 */
document.querySelectorAll(".navbar .dropdown > a").forEach(function (dropdown) {
  dropdown.addEventListener("click", function (e) {
    if (document.querySelector("#navbar").classList.contains("mobile-nav")) {
      e.preventDefault();
      this.nextElementSibling.classList.toggle("dropdown-active");
    }
  });
});

