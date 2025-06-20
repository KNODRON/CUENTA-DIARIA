// Datos de ejemplo: sustituye por tu array real
const personal = [
  'Pedro Aliaga Muñoz',
  'Jorge Padilla Pérez',
  // agrega aquí todos los nombres...
];

function init() {
  // Fecha automática
  document.getElementById('fecha').textContent =
    new Date().toLocaleDateString();

  const tbody = document.querySelector('#asistencia tbody');
  // Genera una fila por cada persona
  personal.forEach(nombre => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="col-nombre">${nombre}</td>
      ${['✔️','❌','L','A','N','F','O'].map(label =>
        `<td><input type="checkbox" data-label="${label}"></td>`
      ).join('')}
    `;
    tbody.appendChild(tr);
  });

  // Botones → funciones
  document.getElementById('generarReporte')
    .addEventListener('click', generarReporte);
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function generarReporte() {
  let texto = `Asistencia ${document.getElementById('fecha').textContent}\n\n`;
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const nombre = tr.querySelector('.col-nombre').textContent;
    const marcas = Array.from(tr.querySelectorAll('input[type=checkbox]'))
      .filter(cb => cb.checked)
      .map(cb => cb.getAttribute('data-label'))
      .join(', ');
    texto += `• ${nombre}: ${marcas || 'Sin marcar'}\n`;
  });
  console.log(texto);  // lo dejamos en consola para depurar
  return texto;
}

function enviarWhatsApp() {
  const texto = generarReporte();
  const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
}

document.addEventListener('DOMContentLoaded', init);
