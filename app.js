// app.js

const personal = [
  { nombre: 'Cap. Valenzuela',   seccion: 'Analistas',           rol: 'PNS' },
  { nombre: 'Tte. Cortes A',     seccion: 'Analistas',           rol: 'PNS' },
  { nombre: 'SOM Cabezas P',     seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'Subof. Iturra T',   seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S1 Hormazabal C',   seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S1 Vargas C',       seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S1 Muñoz M',        seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S1 Leal B',         seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Salazar R',      seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Jimenez V',      seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Fernandez V',    seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Muñoz P',        seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Pardo A',        seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 San Juan V',     seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'C1 Olivares G',     seccion: 'Analistas',           rol: 'PNI' },
  { nombre: 'S2 Correa I',       seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'S2 Chavez S',       seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'S2 Otarola M',      seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'C1 Perez B',        seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'C2 Toro V',         seccion: 'Tegnologia Forense',  rol: 'PNI' },
  { nombre: 'Subof. Cerda L',    seccion: 'Monitoreo',           rol: 'PNI' },
  { nombre: 'S2 Avalos S',       seccion: 'Monitoreo',           rol: 'PNI' },
  { nombre: 'S2 Vilo R',         seccion: 'Monitoreo',           rol: 'PNI' },
  { nombre: 'C1 Pacheco P',      seccion: 'Monitoreo',           rol: 'PNI' }
];

function init() {
  // 1) Poner fecha
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // 2) Generar filas de la tabla
  const tbody = document.querySelector('#asistencia tbody');
  tbody.innerHTML = ''; // limpio antes

  personal.forEach(({ nombre }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nombre}</td>
      ${['si','noche','franco','ad','lic','otro']
        .map(tipo =>
          `<td>
             <input 
               type="checkbox"
               data-nombre="${nombre}"
               data-tipo="${tipo}"
             >
           </td>`
        ).join('')}
    `;

    // 3) Lógica: solo un checkbox marcado por fila
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb =>
      cb.addEventListener('change', () => {
        if (cb.checked) {
          checks.forEach(o => {
            if (o !== cb) o.checked = false;
          });
        }
      })
    );

    tbody.appendChild(tr);
  });

  // 4) Enlazar botón de WhatsApp
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function enviarWhatsApp() {
  // Fecha corta dd-mm-yyyy
  const hoy = new Date();
  const fechaTxt = hoy.toLocaleDateString('es-CL', {
    day:'2-digit', month:'2-digit', year:'numeric'
  });

  // Encabezado del mensaje
  let mensaje = `Buenos días mi coronel, Sección Análisis Criminal: ${fechaTxt}\n`;

  // Preparo resumen por sección
  const resumen = {};
  personal.forEach(({ seccion }) => {
    if (!resumen[seccion]) resumen[seccion] = { PNS: 0, PNI: 0 };
  });

  // Sólo contamos los “si”
  document.querySelectorAll('input[type="checkbox"][data-tipo="si"]:checked')
    .forEach(cb => {
      const nombre = cb.dataset.nombre;
      const persona = personal.find(p => p.nombre === nombre);
      if (persona) {
        resumen[persona.seccion][persona.rol]++;
      }
    });

  // Armo líneas por sección
  for (const seccion in resumen) {
    const { PNS, PNI } = resumen[seccion];
    const partes = [];
    if (PNS > 0) partes.push(`${String(PNS).padStart(2,'0')} PNS`);
    if (PNI > 0) partes.push(`${String(PNI).padStart(2,'0')} PNI`);
    mensaje += `* ${seccion}: ${partes.join(' - ')}\n`;
  }

  // Totales generales
  const totPNS = Object.values(resumen).reduce((sum, r) => sum + r.PNS, 0);
  const totPNI = Object.values(resumen).reduce((sum, r) => sum + r.PNI, 0);
  mensaje += `Total: ${String(totPNS).padStart(2,'0')} PNS y PNI ${totPNS + totPNI}`;

  // Envío a WhatsApp
  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// Iniciar
document.addEventListener('DOMContentLoaded', init);

// PWA: instalar app
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('btn-install');
  if (btn) {
    btn.style.display = 'inline-block';
    btn.addEventListener('click', () => {
      btn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => deferredPrompt = null);
    });
  }
});
