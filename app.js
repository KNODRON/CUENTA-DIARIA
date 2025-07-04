// app.js (versión de prueba para depuración de conteo “SI”)

// 1) Define tu array de personal
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

// 2) Mapa rápido de lookup por nombre
const personalMap = personal.reduce((map, p) => {
  map[p.nombre] = p;
  return map;
}, {});

function init() {
  // 3) Mostrar fecha actual
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // 4) Generar la tabla
  const tbody = document.querySelector('#asistencia tbody');
  tbody.innerHTML = ''; // limpia

  personal.forEach(({ nombre }) => {
    const tr = document.createElement('tr');

    // Columna nombre
    tr.innerHTML = `<td>${nombre}</td>` +
      // Solo un checkbox "si" por fila
      ['si','noche','franco','ad','lic','otro']
        .map(tipo =>
          `<td><input type="checkbox" data-nombre="${nombre}" data-tipo="${tipo}"></td>`
        )
        .join('');

    // lógica: solo uno checked por fila
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

  // 5) Conectar botón de WhatsApp
  document.getElementById('enviarWhatsApp')
          .addEventListener('click', enviarWhatsApp);
}

function enviarWhatsApp() {
  // 6) Depuración: ¿qué "si" están marcados?
  const marcadosSi = Array.from(
    document.querySelectorAll('input[data-tipo="si"]:checked')
  ).map(cb => cb.dataset.nombre);
  console.log('--- Chequeo “SI” marcados ---');
  console.log(marcadosSi);

  // 7) Construir resumen solo contando los "si"
  const resumen = {};
  for (const { seccion, rol } of personal) {
    if (!resumen[seccion]) resumen[seccion] = { PNS: 0, PNI: 0 };
  }
  marcadosSi.forEach(nombre => {
    const p = personalMap[nombre];
    if (p) resumen[p.seccion][p.rol]++;
  });
  console.log('--- Resumen por sección (solo SI) ---');
  console.table(resumen);

  // 8) Construir mensaje
  const hoy = new Date();
  const fechaTexto = hoy.toLocaleDateString('es-CL', { day:'2-digit', month:'2-digit', year:'numeric' });
  let mensaje = `Buenos días mi Coronel, Sección Análisis Criminal: ${fechaTexto}\n\n`;

  let totPNS = 0, totPNI = 0;
  for (const seccion in resumen) {
    const { PNS, PNI } = resumen[seccion];
    totPNS += PNS; totPNI += PNI;
    mensaje += `* ${seccion}: `;
    if (PNS) mensaje += `${String(PNS).padStart(2,'0')} PNS`;
    if (PNS && PNI) mensaje += ' – ';
    if (PNI) mensaje += `${String(PNI).padStart(2,'0')} PNI`;
    mensaje += '\n';
  }
  mensaje += `\nTotal: ${String(totPNS).padStart(2,'0')} PNS y PNI ${totPNI}`;

  console.log('--- Mensaje final ---');
  console.log(mensaje);

  // 9) Abrir WhatsApp
  window.open(`https://wa.me/?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// 10) Arrancar
document.addEventListener('DOMContentLoaded', init);
