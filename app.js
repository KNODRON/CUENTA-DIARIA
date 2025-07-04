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
  // Mostrar fecha
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Generar filas
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
    // Solo un checkbox por fila
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb =>
      cb.addEventListener('change', () => {
        if (cb.checked) checks.forEach(o => o !== cb && (o.checked = false));
      })
    );
    tbody.appendChild(tr);
  });

  // Enlazar envío a WhatsApp
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function enviarWhatsApp() {
  const hoy = new Date();
  const fechaTexto = hoy.toLocaleDateString('es-CL', {
    day:'2-digit', month:'2-digit', year:'numeric'
  });

  let mensaje = `Buenos días mi coronel, Sección Análisis Criminal: ${fechaTexto}\n`;

  // Inicializar contadores por sección y rol
  const resumen = {};
  personal.forEach(({ seccion, rol }) => {
    if (!resumen[seccion]) resumen[seccion] = { PNS: 0, PNI: 0 };
  });

  // Recorremos cada fila: si hay *cualquier* checkbox marcado, contamos
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const nombre = tr.cells[0].textContent;
    const marcado = tr.querySelector('input[type="checkbox"]:checked');
    if (marcado) {
      // Buscamos la persona en nuestro array original
      const persona = personal.find(p => p.nombre === nombre);
      resumen[persona.seccion][persona.rol]++;
    }
  });

  // Montar líneas por sección
  for (const seccion in resumen) {
    const { PNS, PNI } = resumen[seccion];
    // Si ambos son cero, saltamos la sección
    if (PNS === 0 && PNI === 0) continue;

    mensaje += `* ${seccion}: `;

    // mostrar "XX PNS" si PNS>0
    if (PNS > 0) mensaje += `${String(PNS).padStart(2,'0')} PNS`;
    if (PNS > 0 && PNI > 0) mensaje += ' y ';
    // mostrar "YY PNI" si PNI>0
    if (PNI > 0) mensaje += `${String(PNI).padStart(2,'0')} PNI`;

    mensaje += '\n';
  }

  // Totales generales
  const totPNS = Object.values(resumen).reduce((sum, r) => sum + r.PNS, 0);
  const totPNI = Object.values(resumen).reduce((sum, r) => sum + r.PNI, 0);
  mensaje += `Total: ${String(totPNS).padStart(2,'0')} PNS y ${String(totPNI).padStart(2,'0')} PNI`;

  // Abrimos WhatsApp
  const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}
