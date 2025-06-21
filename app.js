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
  // Mostrar fecha
  document.getElementById('fecha').textContent = new Date().toLocaleDateString();

  const tbody = document.querySelector('#asistencia tbody');

  personal.forEach(nombre => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${nombre}</td>` +
      ['Si','No','Lic.','Ad.','Noche','Franco','Otro']
        .map(label => `<td><input type="checkbox" data-label="${label}"></td>`)
        .join('');
    tbody.appendChild(tr);

    // Selección exclusiva por fila y toggle
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          checks.forEach(other => { if (other !== cb) other.checked = false; });
        }
      });
    });
  });

  document.getElementById('generarReporte')
    .addEventListener('click', () => alert(generarReporte()));

  document.getElementById('enviarWhatsApp')
    .addEventListener('click', () => {
      const msg = encodeURIComponent(generarReporte());
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    });
}

function generarReporte() {
  let texto = `Asistencia ${document.getElementById('fecha').textContent}
`;
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const nombre = tr.cells[0].textContent;
    const seleccion = Array.from(tr.querySelectorAll('input:checked'))
      .map(cb => cb.dataset.label)
      .join(', ');
    texto += `• ${nombre}: ${seleccion || 'Sin marcar'}
`;
  });
  return texto;
}

document.addEventListener('DOMContentLoaded', init);
