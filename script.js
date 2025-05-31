
const products = [
  { name: "Coca-Cola 12x1L", unit: "Kiste" },
  { name: "Coca-Cola (Einzelflasche)", unit: "Flasche" },
  { name: "Bier 50L Fass", unit: "Fass" },
  { name: "Radler 30L Fass", unit: "Fass" },
  { name: "0,3L Becher (Kiste)", unit: "Kiste" },
  { name: "0,4L Becher (Kiste)", unit: "Kiste" },
  { name: "0,5L Becher (Kiste)", unit: "Kiste" },
  { name: "0,3L Becher (Einzeln)", unit: "Stück" },
  { name: "0,5L Becher (Einzeln)", unit: "Stück" },
  { name: "Leergut (Bier)", unit: "Kiste" },
  { name: "Leergut (AFG)", unit: "Kiste" }
];

let userData = {};

document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('barleiter').value;
  const bar = document.getElementById('barname').value;
  const pin = document.getElementById('pin').value;
  const zeit = document.getElementById('zeitpunkt').value;
  if (name && bar && pin.length === 4) {
    userData = { name, bar, pin, zeit };
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('inventorySection').style.display = 'block';
    renderProducts();
  }
});

function renderProducts() {
  const container = document.getElementById('productInputs');
  container.innerHTML = '';
  products.forEach(prod => {
    const row = document.createElement('div');
    row.innerHTML = `
      <h3>${prod.name} (${prod.unit})</h3>
      Anfang: <input type="number" id="${prod.name}-anfang" value="0" />
      Nachgeliefert: <input type="number" id="${prod.name}-nach" value="0" />
      Abgabe: <input type="number" id="${prod.name}-abgabe" value="0" />
      Endbestand: <input type="number" id="${prod.name}-ende" value="0" />
    `;
    container.appendChild(row);
  });
}

function saveData() {
  alert("Daten gespeichert.");
}

function exportCSV() {
  let csv = "Produkt,Einheit,Anfang,Nachlieferung,Abgabe,Endbestand,Verkauft\n";
  products.forEach(p => {
    const a = +document.getElementById(`${p.name}-anfang`).value;
    const n = +document.getElementById(`${p.name}-nach`).value;
    const g = +document.getElementById(`${p.name}-abgabe`).value;
    const e = +document.getElementById(`${p.name}-ende`).value;
    const verkauft = a + n - g - e;
    csv += `${p.name},${p.unit},${a},${n},${g},${e},${verkauft}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Inventur_${userData.bar}_${userData.zeit}.csv`;
  a.click();
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(`Inventurbericht – GPSBarLog`, 10, 10);
  doc.text(`Bar: ${userData.bar}`, 10, 20);
  doc.text(`Barleiter: ${userData.name}`, 10, 30);
  doc.text(`Zeitpunkt: ${userData.zeit}`, 10, 40);
  doc.autoTable({
    startY: 50,
    head: [["Produkt", "Einheit", "Anfang", "Nach", "Abgabe", "Ende", "Verkauf"]],
    body: products.map(p => {
      const a = +document.getElementById(`${p.name}-anfang`).value;
      const n = +document.getElementById(`${p.name}-nach`).value;
      const g = +document.getElementById(`${p.name}-abgabe`).value;
      const e = +document.getElementById(`${p.name}-ende`).value;
      const verkauft = a + n - g - e;
      return [p.name, p.unit, a, n, g, e, verkauft];
    })
  });
  doc.save(`Inventur_${userData.bar}_${userData.zeit}.pdf`);
}

function mailtoSend() {
  const mailBody = `Inventur – Bar: ${userData.bar}, Leiter: ${userData.name}, Zeitpunkt: ${userData.zeit}`;
  window.location.href = `mailto:?subject=Inventurbericht ${userData.bar}&body=${encodeURIComponent(mailBody)}`;
}
