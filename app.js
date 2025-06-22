const personal = [
  { nombre: 'Tte. Cortes A',     seccion: 'Analistas',           rol: 'PNS' },
  { nombre: 'SOM Cabezas P',      seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'Subof. Iturra T',    seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S1 Hormazabal C',    seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S1 Vargas C',        seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S1 Muñoz M',         seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S1 Leal B',          seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Salazar R',       seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Jimenez V',       seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Fernandez V',     seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Muñoz P',         seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Pardo A',         seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 San Juan V',      seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'C1 Olivares G',      seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Correa I',        seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'S2 Chavez S',        seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'S2 Otarola M',       seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'C1 Perez B',         seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'C2 Toro V',          seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'Subof. Cerda L',     seccion: 'Monitoreo',           rol: 'PNI' },
  { nombre: 'S2 Avalos S',        seccion: 'Monitoreo',           rol: 'PNI' },
  { nombre: 'S2 Vilo R',          seccion: 'Monitoreo',           rol: 'PNI' },
  { nombre: 'C1 Pacheco P',       seccion: 'Monitoreo',           rol: 'PNI' }
];

// Etiquetas de columnas (orden exacto)
const labels = ['Si', 'Noche', 'Franco', 'Ad.', 'Lic.', 'Otro'];

function init() {
  // Mostrar fecha
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day: 'numeric', month: 'numeric', year: 'numeric'
  });

  const tbody = document.querySelector('#asistencia tbody');
  let currentSection = null;

  // Generar filas y secciones
  personal.forEach(person => {
    if (person.seccion !== currentSection) {
      currentSection = person.seccion;
      const secRow = document.createElement('tr');
      const secCell = document.createElement('th');
      secCell.textContent = currentSection.toUpperCase();
      secCell.colSpan = 1 + labels.length;
      secRow.appendChild(secCell);
      tbody.appendChild(secRow);
    }

    const tr = document.createElement('tr');
    // Nombre
    const tdName = document.createElement('td');
    tdName.textContent = person.nombre;
    tr.appendChild(tdName);

    // Casillas
    labels.forEach(label => {
      const td = document.createElement('td');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.label = label;
      cb.dataset.seccion = person.seccion;
      cb.dataset.rol = person.rol;
      td.appendChild(cb);
      tr.appendChild(td);
    });

    // Sólo 1 casilla marcada por fila
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          checks.forEach(other => {
            if (other !== cb) other.checked = false;
          });
        }
      });
    });

    tbody.appendChild(tr);
  });

  // Botón WhatsApp
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function generarResumen() {
  // Inicializa conteo
  const resumen = {};
  personal.forEach(p => {
    if (!resumen[p.seccion]) resumen[p.seccion] = { PNS: 0, PNI: 0 };
  });

  // Cuenta sólo 'Si'
  document
    .querySelectorAll('input[data-label="Si"]:checked')
    .forEach(cb => {
      resumen[cb.dataset.seccion][cb.dataset.rol]++;
    });

  // Construir mensaje
  const fecha = document.getElementById('fecha').textContent;
  let texto = `Buenos días mi coronel, Sección Análisis Criminal: ${fecha}\n`;

  for (const sec of Object.keys(resumen)) {
    const { PNS, PNI } = resumen[sec];
    const partes = [];
    if (PNS) partes.push(String(PNS).padStart(2, '0') + ' PNS');
    if (PNI) partes.push(String(PNI).padStart(2, '0') + ' PNI');
    texto += `* ${sec}: ${partes.join(' - ') || '00 PNS'}\n`;
  }

  const totalPNS = Object.values(resumen).reduce((sum, v) => sum + v.PNS, 0);
  const totalPNI = Object.values(resumen).reduce((sum, v) => sum + v.PNI, 0);
  texto += `Total: ${String(totalPNS).padStart(2, '0')} PNS y PNI ${totalPNI}`;

  return texto;
}

function enviarWhatsApp() {
  const mensaje = encodeURIComponent(generarResumen());
  window.open(`https://wa.me/?text=${mensaje}`, '_blank');
}

document.addEventListener('DOMContentLoaded', init);

let deferredPrompt;

window.addEventListener('beforeinstallprompt', e => {
  // Evita el banner automático de Chrome
  e.preventDefault();
  deferredPrompt = e;
  // Muestra tu botón de instalación
  const btn = document.getElementById('btn-install');
  btn.style.display = 'inline-block';

  btn.addEventListener('click', () => {
    // Lanza el prompt nativo
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      // Puedes chequear choiceResult.outcome ('accepted' o 'dismissed')
      deferredPrompt = null;
      btn.style.display = 'none'; // ocultar botón si ya respondió
    });
  });
});
