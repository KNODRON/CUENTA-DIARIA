const personal = [
  { nombre: 'Cap. Valenzuela',   seccion: 'Analistas',           rol: 'PNS' },
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

function init() {
  // Fecha en formato largo español
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const tbody = document.querySelector('#asistencia tbody');
  tbody.innerHTML = '';

  personal.forEach(({ nombre }) => {
    const tr = document.createElement('tr');
    // Nombre
    tr.innerHTML = `<td>${nombre}</td>` +
      ['si','noche','franco','ad','lic','otro']
        .map(tipo => `<td><input type="checkbox" data-nombre="${nombre}" data-tipo="${tipo}"></td>`)
        .join('');

    // Lógica: solo 1 checkbox por fila
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          checks.forEach(o => o !== cb && (o.checked = false));
        }
      });
    });

    tbody.appendChild(tr);
  });

  // Botón WhatsApp
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function enviarWhatsApp() {
  const hoy = new Date();
  const fechaTexto = hoy.toLocaleDateString('es-CL', { day:'2-digit', month:'2-digit', year:'numeric' });
  let mensaje = `Buenos días mi coronel, Sección Análisis Criminal: ${fechaTexto}\n`;

  // Contadores por sección
  const resumen = {};
  personal.forEach(({ seccion, rol }) => {
    resumen[seccion] = resumen[seccion] || { PNS:0, PNI:0 };
  });

  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const nombre = tr.cells[0].textContent;
    const tipo = tr.querySelector('input:checked')?.dataset.tipo;
    if (tipo) {
      const persona = personal.find(p => p.nombre === nombre);
      resumen[persona.seccion][persona.rol]++;
    }
  });

  // Montar líneas
  for (const seccion in resumen) {
    const { PNS, PNI } = resumen[seccion];
    mensaje += `* ${seccion}: ` +
      (PNS>0 ? `${String(PNS).padStart(2,'0')} PNS` : '') +
      (PNS>0 && PNI>0 ? ' – ' : '') +
      (PNI>0 ? `${String(PNI).padStart(2,'0')} PNI` : '') +
      '\n';
  }

  // Totales
  const totPNS = Object.values(resumen).reduce((s,r)=> s+r.PNS,0);
  const totPNI = Object.values(resumen).reduce((s,r)=> s+r.PNI,0);
  mensaje += `Total: ${String(totPNS).padStart(2,'0')} PNS y PNI ${totPNS+totPNI}`;

  // Abrir WhatsApp
  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// Inicia al cargar
document.addEventListener('DOMContentLoaded', init);

// PWA: beforeinstallprompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('btn-install');
  btn.style.display = 'inline-block';

  btn.addEventListener('click', () => {
    btn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => deferredPrompt = null);
  });
});
