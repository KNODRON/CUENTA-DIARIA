// app.js

// Tu lista original de personal, con seccion y rol
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
  fechaDiv.textContent = new Date().toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // 2) Generar tabla con separadores de sección
  const tbody = document.querySelector('#asistencia tbody');
  tbody.innerHTML = '';
  let currentSection = '';
  personal.forEach(p => {
    // Si cambió de sección, inserto un header de sección
    if (p.seccion !== currentSection) {
      currentSection = p.seccion;
      const trSec = document.createElement('tr');
      const tdSec = document.createElement('td');
      tdSec.textContent = currentSection.toUpperCase();
      tdSec.colSpan = 7;
      tdSec.style.textAlign = 'center';
      tdSec.style.fontWeight = 'bold';
      trSec.appendChild(tdSec);
      tbody.appendChild(trSec);
    }

    // Luego la fila de la persona
    const tr = document.createElement('tr');
    // Columna nombre
    const tdName = document.createElement('td');
    tdName.textContent = p.nombre;
    tr.appendChild(tdName);

    // Las 6 casillas (SI, NOCHE, FRANCO, AD, LIC, OTRO)
    ['si','noche','franco','ad','lic','otro'].forEach(tipo => {
      const td = document.createElement('td');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.nombre = p.nombre;
      cb.dataset.tipo   = tipo;
      td.appendChild(cb);
      tr.appendChild(td);
    });

    // Lógica: solo uno marcado por fila
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

  // 3) Botón WhatsApp
  document.getElementById('enviarWhatsApp')
          .addEventListener('click', enviarWhatsApp);
}

// Esta función arma el texto final y abre WhatsApp
function enviarWhatsApp() {
  const hoy = new Date();
  const fechaTexto = hoy.toLocaleDateString('es-CL', {
    day:'2-digit', month:'2-digit', year:'numeric'
  });

  let mensaje = `Buenos días mi coronel, Sección Análisis Criminal: ${fechaTexto}\n`;

  // Inicializo resumen por sección
  const resumen = {};
  personal.forEach(p => {
    if (!resumen[p.seccion]) {
      resumen[p.seccion] = { PNS: 0, PNI: 0 };
    }
  });

  // Recorro filas: si tienen ANY checkbox marcado → cuento según rol
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    // distingo TR de sección (solo tienen 1 TD) de TR de persona (7 TDs)
    if (tr.children.length !== 7) return;

    const marcado = tr.querySelector('input[type="checkbox"]:checked');
    if (marcado) {
      const nombre = tr.cells[0].textContent;
      const persona = personal.find(p => p.nombre === nombre);
      resumen[persona.seccion][persona.rol]++;
    }
  });

  // Armo líneas por sección (solo si >0)
  for (const seccion in resumen) {
    const { PNS, PNI } = resumen[seccion];
    if (PNS === 0 && PNI === 0) continue;

    mensaje += `* ${seccion}: `;
    if (PNS > 0) mensaje += `${String(PNS).padStart(2,'0')} PNS`;
    if (PNS > 0 && PNI > 0) mensaje += ' y ';
    if (PNI > 0) mensaje += `${String(PNI).padStart(2,'0')} PNI`;
    mensaje += '\n';
  }

  // Totales generales
  const totPNS = Object.values(resumen).reduce((s,r) => s + r.PNS, 0);
  const totPNI = Object.values(resumen).reduce((s,r) => s + r.PNI, 0);
  mensaje += `Total: ${String(totPNS).padStart(2,'0')} PNS y ${String(totPNI).padStart(2,'0')} PNI`;

  // Abrir WhatsApp
  window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// Arrancar
document.addEventListener('DOMContentLoaded', init);
