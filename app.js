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
  // 1) Mostrar fecha
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // 2) Generar filas
  const tbody = document.querySelector('#asistencia tbody');
  tbody.innerHTML = '';
  personal.forEach(({ nombre }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${nombre}</td>
      ${['si','noche','franco','ad','lic','otro']
        .map(tipo =>
          `<td><input type="checkbox" data-nombre="${nombre}" data-tipo="${tipo}"></td>`
        ).join('')}
    `;
    // sólo 1 marcado a la vez
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb =>
      cb.addEventListener('change', () => {
        if (!cb.checked) return;
        checks.forEach(o => o !== cb && (o.checked = false));
      })
    );
    tbody.appendChild(tr);
  });

  // 3) Asignar envío a WhatsApp
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function enviarWhatsApp() {
  // Fecha en dd-mm-yyyy
  const hoy = new Date();
  const fechaTxt = hoy.toLocaleDateString('es-CL', {
    day:'2-digit', month:'2-digit', year:'numeric'
  });

  // Cabecera del mensaje
  let mensaje = `Buenos días mi coronel, Sección Análisis Criminal: ${fechaTxt}\n`;

  // Inicializar resumen por sección
  const resumen = {};
  personal.forEach(p => {
    if (!resumen[p.seccion]) resumen[p.seccion] = { PNS: 0, PNI: 0 };
  });

  // Recojo sólo los checkboxes 'si' marcados
  document
    .querySelectorAll('#asistencia input[type="checkbox"][data-tipo="si"]:checked')
    .forEach(cb => {
      const nombre = cb.dataset.nombre;
      const persona = personal.find(p => p.nombre === nombre);
      if (persona) {
        resumen[persona.seccion][persona.rol]++;
      }
    });

  // Construir líneas por sección
  for (const seccion in resumen) {
    const { PNS, PNI } = resumen[seccion];
    const partes = [];
    if (PNS > 0) partes.push(`${String(PNS).padStart(2,'0')} PNS`);
    if (PNI > 0) partes.push(`${String(PNI).padStart(2,'0')} PNI`);
    mensaje += `* ${seccion}: ${partes.join(' - ')}\n`;
  }

  // Totales generales
  const totPNS = Object.values(resumen).reduce((a,v) => a + v.PNS, 0);
  const totPNI = Object.values(resumen).reduce((a,v) => a + v.PNI, 0);
  mensaje += `Total: ${String(totPNS).padStart(2,'0')} PNS y PNI ${totPNS + totPNI}`;

  // Abrir WhatsApp
  window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', init);

// PWA: beforeinstallprompt (instalación manual)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('btn-install');
  if (btn) {
    btn.style.display = 'inline-block';
    btn.onclick = () => {
      btn.style.display = 'none';
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => deferredPrompt = null);
    };
  }
});
