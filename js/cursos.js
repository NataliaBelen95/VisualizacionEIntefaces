const CAT_CURSOS = {
  datos: {
    titulo: "Especialización en Ciencia de Datos Aplicada",
    cat: "Posgrados",
    duracion: "18 meses",
    precio: "$45.000 /mes",
    desc: "Formación de alto nivel para el análisis masivo de datos, algoritmos predictivos y toma de decisiones estratégicas.",
    modalidad: "Virtual",
    badge: "popular",
    gratis: false,
    popular: true,
    temario: [
      "Módulo 1: Introducción a Python y Análisis Exploratorio de Datos (EDA)",
      "Módulo 2: Modelos Predictivos y Machine Learning Supervisado",
      "Módulo 3: Bases de Datos Relacionales y NoSQL a Gran Escala",
      "Módulo 4: Proyecto Integrador: Despliegue de Algoritmo en Producción",
    ],
  },
  salud: {
    titulo: "Gestión de Instituciones de Salud",
    cat: "Licenciaturas",
    duracion: "4 años",
    precio: "$52.000 /mes",
    desc: "Ciclo de formación profesional enfocado en la administración, costos y auditoría de clínicas y centros sanitarios.",
    modalidad: "Virtual",
    badge: "",
    gratis: false,
    popular: false,
    temario: [
      "Módulo 1: Sistemas de Salud y Políticas Sanitarias Públicas",
      "Módulo 2: Costos, Facturación Sanitaria y Presupuestos Operativos",
      "Módulo 3: Auditoría y Calidad en Servicios de Salud",
      "Módulo 4: Práctica Profesional Supervisada en Clínicas",
    ],
  },
  ux: {
    titulo: "Diplomatura en Diseño UX/UI",
    cat: "Tecnicaturas",
    duracion: "6 meses",
    precio: "Gratuito",
    desc: "Aprende metodologías ágiles, wireframes, investigación de usuarios y Figma para diseñar experiencias de interfaces modernas.",
    modalidad: "Virtual",
    badge: "gratis",
    gratis: true,
    popular: false,
    temario: [
      "Módulo 1: Introducción al Diseño Centrado en el Usuario (UCD)",
      "Módulo 2: Investigación (UX Research) y Arquitectura de la Información",
      "Módulo 3: Diseño de Wireframes de Alta Fidelidad en Figma",
      "Módulo 4: Testeo de Usabilidad y Prototipado Interactivo",
    ],
  },
};

// Esta función renderiza las tarjetas en la página principal con la estética y Gestalt correctas
function renderizarTarjetas(containerId, keys) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (keys.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; border: 2px dashed var(--border-color); border-radius: 12px; height: 250px; display:flex; flex-direction: column; align-items:center; justify-content:center; gap: 1rem; color: var(--texto-secundario);">
        <i class="fas fa-search" style="font-size: 2rem; color: var(--texto-muted);"></i>
        <p style="font-weight:600;">No se encontraron carreras u ofertas académicas.</p>
      </div>`;
    return;
  }

  container.innerHTML = keys
    .map((key) => {
      const curso = CAT_CURSOS[key];
      let badgeHTML = "";
      if (curso.badge === "popular") {
        badgeHTML = `<span class="course-badge badge-popular"><i class="fas fa-fire"></i> Popular</span>`;
      } else if (curso.badge === "gratis") {
        badgeHTML = `<span class="course-badge badge-gratis"><i class="fas fa-gift"></i> Gratis</span>`;
      }

      const esGratis = curso.gratis;
      const precioClase = esGratis ? 'style="color: var(--color-success); white-space: nowrap;"' : 'style="white-space: nowrap;"';
      
      let precioHTML = "";
      if (curso.precio.includes("/mes")) {
        const partesPrecio = curso.precio.split("/mes");
        precioHTML = `${partesPrecio[0].trim()}<span style="font-size: 0.75rem; font-weight: 500; color: var(--texto-secundario);">/mes</span>`;
      } else {
        precioHTML = curso.precio;
      }

      return `
        <article class="product-card" id="course-card-${key}">
          <div class="product-card-header">
            <span class="course-category" style="font-size:0.7rem; color:var(--texto-muted); font-weight:800; text-transform:uppercase;">${curso.cat}</span>
            ${badgeHTML}
          </div>
          <div class="product-card-body">
            <h3 class="product-card-title">${curso.titulo}</h3>
            <p class="product-card-desc">${curso.desc}</p>
            <div class="product-card-meta">
              <span><i class="far fa-clock"></i> ${curso.duracion}</span>
              <span><i class="fas fa-laptop-house"></i> ${curso.modalidad}</span>
            </div>
          </div>
          <div class="product-card-footer">
            <strong ${precioClase}>${precioHTML}</strong>
            <a href="pages/detalle.html?curso=${key}" class="btn btn-primary btn-sm" style="font-size:0.75rem; padding: 0.4rem 0.8rem; white-space: nowrap;">Ver Programa</a>
          </div>
        </article>
      `;
    })
    .join("");
}
