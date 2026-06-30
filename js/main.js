// js/main.js

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. MENÚ HAMBURGUESA INTERACTIVO (Nielsen #3: Libertad del usuario)
  // ==========================================================================
  const menuOpenBtn = document.getElementById("menu-open-btn");
  const menuCloseBtn = document.getElementById("menu-close-btn");
  const navMenu = document.getElementById("nav-menu");

  if (menuOpenBtn && navMenu) {
    menuOpenBtn.addEventListener("click", () => {
      navMenu.classList.add("open");
    });
  }

  if (menuCloseBtn && navMenu) {
    menuCloseBtn.addEventListener("click", () => {
      navMenu.classList.remove("open");
    });
  }

  // Cerrar al clickear cualquier link en móviles
  document.querySelectorAll(".nav-item").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("open");
    });
  });

  // ==========================================================================
  // 2. MODO OSCURO GLOBAL (Gestalt: Figura/Fondo y Estética)
  // ==========================================================================
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("theme") || "light";

  document.documentElement.setAttribute("data-theme", savedTheme);
  if (themeToggle) actualizarIconoTema(themeToggle, savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const targetTheme = current === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", targetTheme);
      localStorage.setItem("theme", targetTheme);
      actualizarIconoTema(themeToggle, targetTheme);
    });
  }

  function actualizarIconoTema(boton, tema) {
    const icono = boton.querySelector("i, svg");
    if (icono) {
      if (tema === "dark") {
        icono.className = "fas fa-sun";
        icono.style.color = "#fbbf24";
      } else {
        icono.className = "fas fa-moon";
        icono.style.color = "";
      }
    }
  }

  // ==========================================================================
  // 3. SISTEMA DE CARRITO DE ADMISIÓN (Nielsen #1, #3 y #6: Reconocimiento)
  // ==========================================================================
  actualizarBadgeCarrito();

  // Asignar listeners a botones de agregar en detalle.html si existen
  const btnInscribirseDetalle = document.getElementById("btn-inscribirse-detalle");
  if (btnInscribirseDetalle) {
    btnInscribirseDetalle.addEventListener("click", (e) => {
      e.preventDefault();
      const params = new URLSearchParams(window.location.search);
      const cursoId = params.get("curso");
      if (cursoId) {
        agregarAlCarrito(cursoId);
        // Redirigir a inscripción de forma inmediata
        window.location.href = `inscripcion.html?curso=${cursoId}`;
      }
    });
  }

  // ==========================================================================
  // 4. VALIDACIONES DE FORMULARIO DE ADMISIÓN Y PAGO (Nielsen #5 y #9)
  // ==========================================================================
  const registroForm = document.getElementById("registroForm");
  if (registroForm) {
    const inputs = registroForm.querySelectorAll("input[required]");
    inputs.forEach(input => {
      input.addEventListener("blur", () => validarCampo(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("invalid")) {
          validarCampo(input);
        }
      });
    });

    registroForm.addEventListener("submit", (e) => {
      let formValido = true;
      inputs.forEach(input => {
        if (!validarCampo(input)) {
          formValido = false;
        }
      });

      if (!formValido) {
        e.preventDefault();
        // Feedback visual inmediato
        const primerError = registroForm.querySelector(".invalid");
        if (primerError) primerError.focus();
      }
    });
  }

  const pagoForm = document.getElementById("pagoForm");
  if (pagoForm) {
    const cardNumber = document.getElementById("card-number");
    const cardExpiry = document.getElementById("card-expiry");
    const cardCvv = document.getElementById("card-cvv");
    const cardName = document.getElementById("card-name");

    // Formateadores interactivos en tiempo real
    if (cardNumber) {
      cardNumber.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 16);
        let formatted = value.match(/.{1,4}/g);
        e.target.value = formatted ? formatted.join(" ") : "";
      });
    }

    if (cardExpiry) {
      cardExpiry.addEventListener("input", (e) => {
        let value = e.target.value.replace(/\D/g, "");
        value = value.substring(0, 4);
        if (value.length > 2) {
          e.target.value = value.substring(0, 2) + "/" + value.substring(2);
        } else {
          e.target.value = value;
        }
      });
    }

    if (cardCvv) {
      cardCvv.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/\D/g, "").substring(0, 3);
      });
    }

    pagoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      let valido = true;
      
      // Validar tarjeta
      if (cardNumber && cardNumber.value.replace(/\s/g, "").length !== 16) {
        marcarInvalido(cardNumber, "La tarjeta debe tener 16 dígitos");
        valido = false;
      } else if (cardNumber) {
        marcarValido(cardNumber);
      }

      // Validar vencimiento
      if (cardExpiry && !/^\d{2}\/\d{2}$/.test(cardExpiry.value)) {
        marcarInvalido(cardExpiry, "Formato inválido (MM/AA)");
        valido = false;
      } else if (cardExpiry) {
        marcarValido(cardExpiry);
      }

      // Validar CVV
      if (cardCvv && cardCvv.value.length !== 3) {
        marcarInvalido(cardCvv, "El código de seguridad debe tener 3 dígitos");
        valido = false;
      } else if (cardCvv) {
        marcarValido(cardCvv);
      }

      // Validar Nombre
      if (cardName && cardName.value.trim() === "") {
        marcarInvalido(cardName, "Ingrese el nombre del titular");
        valido = false;
      } else if (cardName) {
        marcarValido(cardName);
      }

      if (valido) {
        const modal = document.getElementById("pagoExitosoModal");
        if (modal) {
          modal.classList.add("active");
        }
      }
    });
  }

  function validarCampo(input) {
    const id = input.id;
    const value = input.value.trim();

    if (value === "") {
      marcarInvalido(input, "Este campo es requerido");
      return false;
    }

    if (id === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        marcarInvalido(input, "Correo electrónico no válido");
        return false;
      }
    }

    if (id === "dni") {
      const dniRegex = /^\d{7,8}$/;
      if (!dniRegex.test(value)) {
        marcarInvalido(input, "El DNI debe tener entre 7 y 8 números");
        return false;
      }
    }

    marcarValido(input);
    return true;
  }

  function marcarInvalido(input, mensaje) {
    input.classList.add("invalid");
    const parent = input.parentElement;
    let errMessage = parent.querySelector(".error-message");
    if (!errMessage) {
      errMessage = document.createElement("span");
      errMessage.className = "error-message";
      parent.appendChild(errMessage);
    }
    errMessage.innerText = mensaje;
    errMessage.style.display = "block";
  }

  function marcarValido(input) {
    input.classList.remove("invalid");
    const parent = input.parentElement;
    const errMessage = parent.querySelector(".error-message");
    if (errMessage) {
      errMessage.style.display = "none";
    }
  }

  // ==========================================================================
  // NAVBAR PROFILE DYNAMIC LOGIN MENU (Nielsen #1, #3)
  // ==========================================================================
  configurarMenuPerfilDinamico();

  function configurarMenuPerfilDinamico() {
    const navItems = Array.from(document.querySelectorAll('.nav-menu .nav-item'));
    const profileItem = navItems.find(item => item.textContent.includes("Mi Perfil") || item.textContent.includes("Mi Panel") || item.textContent.includes("Ingresar"));
    
    // Buscar también en los enlaces del footer
    const footerLinks = Array.from(document.querySelectorAll('.footer-links li a'));
    const footerProfileLink = footerLinks.find(link => link.textContent.includes("Mi Perfil") || link.textContent.includes("Mi Panel") || link.textContent.includes("Iniciar Sesión"));

    // Detectar prefijo de ruta para páginas internas
    const pathPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    const relPrefix = window.location.pathname.includes('/pages/') ? '../' : '';

    const userName = localStorage.getItem("untref_user_name");
    
    if (!userName) {
      // No logueado: Reemplazar por link de ingreso en nav y footer
      if (profileItem) {
        profileItem.outerHTML = `<a href="${pathPrefix}iniciar-sesion.html" class="nav-item" id="nav-profile-item"><i class="fas fa-sign-in-alt"></i> Ingresar</a>`;
      }
      if (footerProfileLink) {
        footerProfileLink.innerText = "Iniciar Sesión";
        footerProfileLink.setAttribute("href", `${pathPrefix}iniciar-sesion.html`);
      }
    } else {
      // Logueado: Reemplazar por dropdown interactivo en nav, y Mi Perfil en footer
      if (profileItem) {
        profileItem.outerHTML = `
          <div class="profile-dropdown nav-item" id="nav-profile-item" style="padding: 0;">
            <a href="#" class="profile-dropdown-trigger" onclick="event.preventDefault()">
              <i class="fas fa-user-circle"></i> <span style="white-space:nowrap;">${userName}</span> <i class="fas fa-chevron-down" style="font-size:0.6rem;"></i>
            </a>
            <div class="profile-dropdown-menu">
              <a href="${pathPrefix}perfil.html"><i class="fas fa-id-card"></i> Mi Perfil</a>
              <a href="#" onclick="cerrarSesionGlobal(event, '${relPrefix}')"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</a>
            </div>
          </div>
        `;
      }
      if (footerProfileLink) {
        footerProfileLink.innerText = "Mi Perfil Académico";
        footerProfileLink.setAttribute("href", `${pathPrefix}perfil.html`);
      }
    }
  }
});

// Handler global para cierre de sesión desde la barra de navegación
function cerrarSesionGlobal(event, relPrefix) {
  if (event) event.preventDefault();
  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    localStorage.removeItem("untref_user_name");
    alert("Sesión cerrada.");
    window.location.href = relPrefix + "index.html";
  }
}


// Lógica de Carrito en localStorage
function obtenerCarrito() {
  return JSON.parse(localStorage.getItem("untref_cart")) || [];
}

function guardarCarrito(carrito) {
  localStorage.setItem("untref_cart", JSON.stringify(carrito));
  actualizarBadgeCarrito();
}

function agregarAlCarrito(cursoKey) {
  let carrito = obtenerCarrito();
  if (!carrito.includes(cursoKey)) {
    carrito.push(cursoKey);
    guardarCarrito(carrito);
  }
}

function eliminarDelCarrito(cursoKey) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter(key => key !== cursoKey);
  guardarCarrito(carrito);
}

function actualizarBadgeCarrito() {
  const badge = document.querySelector(".cart-badge");
  if (badge) {
    const carrito = obtenerCarrito();
    badge.innerText = carrito.length;
    badge.style.display = carrito.length > 0 ? "flex" : "none";
  }
}
