// Array con los nombres del personal
const personal = [
  'Juan Perico Los Palotes',
  'Petronila Sinforoza',
  'Gabriela Albino',
  'Agustín Jiménez',
  'Francisca Jiménez',
  'Juan Jiménez',
  // ... agrega los demás
];

function init() {
  // Mostrar fecha actual
  document.getElementById('fecha').textContent =
    new Date().toLocaleDateString();

  const tbody = document.querySelector('#asistencia tbody');

  // Crear filas dinámicamente
  personal.forEach(nombre => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-nombre">${nombre}</td>
      ${['✔️','❌','L','A','N','F','O']
        .map(label =>
          `<td><input type="checkbox" data-label="${label}"></td>`
        ).join('')}
    `;
    tbody.appendChild(tr);
  });

  // Asociar botones
  document.getElementById('generarReporte')
    .addEventListener('click', generarReporte);
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

// Generar texto de reporte
function generarReporte() {
  let texto = `Asistencia ${document.getElementById('fecha').textContent}\n\n`;

  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const nombre = tr.querySelector('.col-nombre').textContent;
    const marcas = Array.from(
      tr.querySelectorAll('input[type=checkbox]')
    )
      .filter(cb => cb.checked)
      .map(cb => cb.getAttribute('data-label'))
      .join(', ');

    texto += `• ${nombre}: ${marcas || 'Sin marcar'}\n`;
  });

  console.log(texto);
  return texto;
}

// Enviar mensaje via WhatsApp
function enviarWhatsApp() {
  const texto = generarReporte();
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

// Inicializar al cargar DOM
document.addEventListener('DOMContentLoaded', init);
