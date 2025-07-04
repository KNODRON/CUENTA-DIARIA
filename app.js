// app.js

// 1) Definición de tu personal
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

// 2) Para búsquedas instantáneas por nombre
const personalMap = {};
personal.forEach(p => personalMap[p.nombre] = p);

function init() {
  // a) Fecha en header
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // b) Generar filas
  const tbody = document.querySelector('#asistencia tbody');
  tbody.innerHTML = '';
  personal.forEach(({ nombre }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${nombre}</td>` +
      ['si','noche','franco','ad','lic','otro']
        .map(tipo =>
          `<td><input type="checkbox" data-nombre="${nombre}" data-tipo="${tipo}"></td>`
        ).join('');

    // Solo 1 checkbox activo por fila
    const checks = tr.querySelectorAll('input');
    checks.forEach(cb =>
      cb.addEventListener('change', () => {
        if (cb.checked) checks.forEach(o => o!==cb && (o.checked=false));
      })
    );

    tbody.appendChild(tr);
  });

  // c) Botón WhatsApp
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function enviarWhatsApp() {
  // a) Encabezado de mensaje
  const hoy = new Date();
  const fechaTexto = hoy.toLocaleDateString('es-CL', {
    day:'2-digit', month:'2-digit', year:'numeric'
  });
  let mensaje = `Buenos días mi coronel, Sección Análisis Criminal: ${fechaTexto}\n`;

  // b) Inicializar contadores
  const resumen = {};
  personal.forEach(({ seccion }) => {
    if (!resumen[seccion]) resumen[seccion] = { PNS:0, PNI:0 };
  });

  // c) Contar SOLO los “SI” marcados
  document
    .querySelectorAll('input[data-tipo="si"]:checked')
    .forEach(cb => {
      const p = personalMap[cb.dataset.nombre];
      resumen[p.seccion][p.rol]++;
    });

  // d) Armar líneas por sección
  Object.entries(resumen).forEach(([seccion,{PNS,PNI}]) => {
    if (PNS||PNI) {
      let linea = `* ${seccion}: `;
      if (PNS) linea += `${String(PNS).padStart(2,'0')} PNS`;
      if (PNS && PNI) linea += ' y ';
      if (PNI) linea += `${String(PNI).padStart(2,'0')} PNI`;
      mensaje += linea + '\n';
    }
  });

  // e) Totales
  const totPNS = Object.values(resumen).reduce((s,r)=>s+r.PNS,0);
  const totPNI = Object.values(resumen).reduce((s,r)=>s+r.PNI,0);
  mensaje += `Total: ${String(totPNS).padStart(2,'0')} PNS y ${String(totPNI).padStart(2,'0')} PNI`;

  // f) Abrir WhatsApp
  window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// Arranque
document.addEventListener('DOMContentLoaded', init);

// PWA: beforeinstallprompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('btn-install');
  btn.style.display = 'inline-block';
  btn.onclick = () => {
    btn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(()=>deferredPrompt=null);
  };
});
