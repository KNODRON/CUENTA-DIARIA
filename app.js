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
  document.getElementById('fecha').textContent = new Date().toLocaleDateString();
  const tbody = document.querySelector('#asistencia tbody');

  personal.forEach(nombre => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${nombre}</td>` +
      ['✔️','❌','L','A','N','F','O']
        .map(l => `<td><input type="checkbox" data-label="${l}"></td>`)
        .join('');
    tbody.appendChild(tr);

    // Asegura selección exclusiva por fila y permite desmarcar
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb => {
      // Usamos 'change' para detectar cambios de estado en cualquier dispositivo
      cb.addEventListener('change', () => {
        if (cb.checked) {
          // Desmarca los demás si este quedó marcado
          checks.forEach(other => {
            if (other !== cb) other.checked = false;
          });
        }
        // Si se desmarca (cb.checked es false), no hacemos nada más
      });
    });
        }
        // Si está unchecked, se quita sin marcar otros
      });
    });
  });

  document.getElementById('generarReporte')
    .addEventListener('click', () => alert(generarReporte()));
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', () => window.open(
      `https://wa.me/?text=${encodeURIComponent(generarReporte())}`
    ));
}

function generarReporte() {
  let texto = `Asistencia ${document.getElementById('fecha').textContent}
`;
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const nombre = tr.cells[0].textContent;
    const marcas = Array.from(tr.querySelectorAll('input:checked'))
      .map(cb => cb.getAttribute('data-label')).join(', ');
    texto += `${nombre}: ${marcas || 'Sin marcar'}
`;
  });
  return texto;
}

document.addEventListener('DOMContentLoaded', init);
