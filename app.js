// app.js

// 1) Tu array de personal
const personal = [
  { nombre: 'Cap. Valenzuela',   seccion: 'Analistas',          rol: 'PNS' },
  { nombre: 'Tte. Cortes A',     seccion: 'Analistas',          rol: 'PNS' },
  { nombre: 'SOM Cabezas P',     seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'Subof. Iturra T',   seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S1 Hormazabal C',   seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S1 Vargas C',       seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S1 Muñoz M',        seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S1 Leal B',         seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S2 Salazar R',      seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S2 Jimenez V',      seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S2 Fernandez V',    seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S2 Muñoz P',        seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S2 Pardo A',        seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S2 San Juan V',     seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'C1 Olivares G',     seccion: 'Analistas',          rol: 'PNI' },
  { nombre: 'S2 Correa I',       seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'S2 Chavez S',       seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'S2 Otarola M',      seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'C1 Perez B',        seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'C2 Toro V',         seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'Subof. Cerda L',    seccion: 'Monitoreo',          rol: 'PNI' },
  { nombre: 'S2 Avalos S',       seccion: 'Monitoreo',          rol: 'PNI' },
  { nombre: 'S2 Vilo R',         seccion: 'Monitoreo',          rol: 'PNI' },
  { nombre: 'C1 Pacheco P',      seccion: 'Monitoreo',          rol: 'PNI' }
];

// 2) Montamos un map para búsquedas rápidas
const personalMap = {};
personal.forEach(p => personalMap[p.nombre] = p);

function init() {
  // * Fecha *
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // * Filas dinámicas *
  const tbody = document.querySelector('#asistencia tbody');
  tbody.innerHTML = '';
  personal.forEach(({ nombre }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${nombre}</td>` +
      ['si','noche','franco','ad','lic','otro']
        .map(tipo =>
          `<td><input type="checkbox" data-nombre="${nombre}" data-tipo="${tipo}"></td>`
        ).join('');

    // Solo una casilla activa por fila
    const checks = tr.querySelectorAll('input');
    checks.forEach(cb =>
      cb.addEventListener('change', () => {
        if (cb.checked)
          checks.forEach(o => { if (o!==cb) o.checked = false; });
      })
    );

    tbody.appendChild(tr);
  });

  // Botón enviar
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function enviarWhatsApp() {
  const hoy = new Date();
  const fechaTexto = hoy.toLocaleDateString('es-CL', {
    day:'2-digit', month:'2-digit', year:'numeric'
  });
  let mensaje = `Buenos días mi Coronel, Sección Análisis Criminal: ${fechaTexto}\n`;

  // Inicializa resumen por sección y rol
  const resumen = {};
  personal.forEach(({ seccion }) => {
    if (!resumen[seccion]) resumen[seccion] = { PNS: 0, PNI: 0 };
  });

  // Recolecta solo los "SI" marcados
  document
    .querySelectorAll('input[data-tipo="si"]:checked')
    .forEach(cb => {
      const nombre = cb.dataset.nombre;
      const p = personalMap[nombre];
      resumen[p.seccion][p.rol]++;
    });

  // Arma líneas por sección
  Object.entries(resumen).forEach(([seccion,{PNS,PNI}]) => {
    if (PNS||PNI) {
      let linea = `* ${seccion}: `;
      if (PNS) linea += `${String(PNS).padStart(2,'0')} PNS`;
      if (PNS && PNI) linea += ' y ';
      if (PNI) linea += `${String(PNI).padStart(2,'0')} PNI`;
      mensaje += linea + '\n';
    }
  });

  // Totales
  const totPNS = Object.values(resumen).reduce((s,r)=>s+r.PNS,0);
  const totPNI = Object.values(resumen).reduce((s,r)=>s+r.PNI,0);
  mensaje += `Total: ${String(totPNS).padStart(2,'0')} PNS y ${String(totPNI).padStart(2,'0')} PNI`;

  // Abre WhatsApp
  window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// Arranca
document.addEventListener('DOMContentLoaded', init);

// PWA install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('btn-install');
  btn.style.display = 'inline-block';
  btn.onclick = () => {
    btn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(()=> deferredPrompt=null);
  };
});
