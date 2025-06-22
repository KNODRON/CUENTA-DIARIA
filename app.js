const personal = [
  { nombre: 'Tte. Cortes A', seccion: 'Analistas', rol: 'PNS' },
  { nombre: 'SOM Cabezas P', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Subof. Iturra T', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Hormazabal C', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Vargas C', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Muñoz M', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Leal B', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Salazar R', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Jimenez V', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Fernandez V', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Muñoz P', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Pardo A', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 San Juan V', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'C1 Olivares G', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Correa I', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'S2 Chavez S', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'S2 Otarola M', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'C1 Perez B', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'C2 Toro V', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'Subof. Cerda L', seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'S2 Avalos S', seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'S2 Vilo R', seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'C1 Pacheco P', seccion: 'Monitoreo', rol: 'PNI' }
];

const tbody = document.querySelector("#asistencia tbody");
const fechaDiv = document.getElementById("fecha");

// Mostrar la fecha actual
const fechaActual = new Date();
fechaDiv.textContent = fechaActual.toLocaleDateString("es-CL", {
  day: "numeric", month: "long", year: "numeric"
});

// Insertar las filas dinámicamente
personal.forEach(persona => {
  const fila = document.createElement("tr");

  const celdaNombre = document.createElement("td");
  celdaNombre.textContent = persona.nombre;
  fila.appendChild(celdaNombre);

  const columnas = ['si', 'noche', 'franco', 'ad', 'lic', 'otro'];

  columnas.forEach(col => {
    const celda = document.createElement("td");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.dataset.nombre = persona.nombre;
    checkbox.dataset.tipo = col;
    celda.appendChild(checkbox);
    fila.appendChild(celda);
  });

  tbody.appendChild(fila);
});

// Enviar por WhatsApp
document.getElementById("enviarWhatsApp").addEventListener("click", () => {
  const checkboxes = document.querySelectorAll("input[type='checkbox']");
  const resumen = {};

  checkboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const nombre = checkbox.dataset.nombre;
      const tipo = checkbox.dataset.tipo.toUpperCase();

      if (!resumen[nombre]) resumen[nombre] = [];
      resumen[nombre].push(tipo);
    }
  });

  if (Object.keys(resumen).length === 0) {
    alert("No hay asistencias marcadas.");
    return;
  }

  let mensaje = `📋 *Asistencia - ${fechaActual.toLocaleDateString("es-CL")}*\n\n`;

  for (const nombre in resumen) {
    mensaje += `• ${nombre}: ${resumen[nombre].join(", ")}\n`;
  }

  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, "_blank");
});

