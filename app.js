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
  // Mostrar fecha
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Render de filas
  const tbody = document.querySelector('#asistencia tbody');
  tbody.innerHTML = '';
  personal.forEach(({ nombre }) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${nombre}</td>` + 
      ['si','noche','franco','ad','lic','otro']
        .map(tipo => `<td><input type="checkbox" data-nombre="${nombre}" data-tipo="${tipo}"></td>`)
        .join('');
    // lógica “solo uno por fila”
    const checks = tr.querySelectorAll('input');
    checks.forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) checks.forEach(o => o !== cb && (o.checked = false));
      });
    });
    tbody.appendChild(tr);
  });

  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function enviarWhatsApp() {
  const hoy = new Date();
  const fechaTexto = hoy.toLocaleDateString('es-CL', { day:'2-digit', month:'2-digit', year:'numeric' });
  let mensaje = `Buenos días mi coronel, Sección Análisis Criminal: ${fechaTexto}\n`;

  // Inicializa contadores por sección y rol
  const resumen = {};
  personal.forEach(({ seccion }) => {
    if (!resumen[seccion]) resumen[seccion] = { PNS: 0, PNI: 0 };
  });

  // Recorre cada fila y fíjate solo en el checkbox “si”
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const nombre = tr.cells[0].textContent;
    const siCheckbox = tr.querySelector('input[data-tipo="si"]');
    if (siCheckbox && siCheckbox.checked) {
      // Encuentra la persona en tu array para saber sección y rol
      const persona = personal.find(p => p.nombre === nombre);
      resumen[persona.seccion][persona.rol]++;
    }
  });

  // Monta el bloque por sección
  Object.entries(resumen).forEach(([seccion, { PNS, PNI }]) => {
    // Solo añade si hay al menos uno
    if (PNS || PNI) {
      let line = `* ${seccion}: `;
      if (PNS) line += `${String(PNS).padStart(2,'0')} PNS`;
      if (PNS && PNI) line += ' y ';
      if (PNI) line += `${String(PNI).padStart(2,'0')} PNI`;
      mensaje += line + '\n';
    }
  });

  // Totales
  const totPNS = Object.values(resumen).reduce((sum, r) => sum + r.PNS, 0);
  const totPNI = Object.values(resumen).reduce((sum, r) => sum + r.PNI, 0);
  mensaje += `Total: ${String(totPNS).padStart(2,'0')} PNS y ${String(totPNI).padStart(2,'0')} PNI`;

  // Envía a WhatsApp
  window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
}

document.addEventListener('DOMContentLoaded', init);
