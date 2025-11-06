(function () {
  "use strict";

  /*------Fuciones para simplificar codigo-----*/
  const select = (el, all = false) => {
    /*Simplifica el documentquerySelector*/
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  const on = (type, el, listener, all = false) => {
    /*Agregar evento segun el tipo y se combina con el select()*/
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  const onscroll = (el, listener) => {
    /*Mejor legibilidad */
    el.addEventListener("scroll", listener);
  };

  /*-----Estado activo de los enlaces en la barra de navegacion-----*/
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

  /*-----Scroll suave a una seccion-----*/
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

  /*-----Agrega la clase header-scrolled a header-----*/
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

  /*-----Menu Mobile----- */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /*-----Scroll suave al hacer click en los links y mantiene el icono hamburguesa-----*/
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

  /*-----Scroll suave al cargar si hay hash en la URL-----*/
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });
  /*-----Swiper Slider (Galería)-----*/
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

  /*-----Animaciones al hacer scroll (Parametros de Configuracion)-----*/
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });
})();

/*-----Cargar Detalles del Orador-----*/
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
/*-----Mostrar Detalles del Orador-----*/

if (window.location.pathname.includes("speaker-details.html")) {
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
        if (
          data.name.includes("Ailén Ramírez") &&
          data.name.includes("Lorena Montenegro")
        ) {
          socialSection.style.display = "none"; // Ocultar redes sociales
        } else {
          socialSection.style.display = "block"; // Mostrar redes sociales
        }
      }

      // Cargar redes sociales si existen
      if (data.socials) {
        const emailLink = document.getElementById("email-link");
        const facebookLink = document.getElementById("facebook-link");

        if (emailLink && data.socials.email)
          emailLink.href = data.socials.email;
        if (facebookLink && data.socials.facebook)
          facebookLink.href = data.socials.facebook;
      }
    }
  });
}
