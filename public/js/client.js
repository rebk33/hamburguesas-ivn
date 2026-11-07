let carrito = [];
const NUMERO_WHATSAPP = "522226070783"; // Tu número de WhatsApp

document.addEventListener('DOMContentLoaded', () => {
  cargarMenu();
});

function cargarMenu() {
  fetch('/api/productos')
    .then(res => res.json())
    .then(productos => {
      const gHamb = document.getElementById('grid-hamburguesas');
      const gAlitas = document.getElementById('grid-alitas');
      const gBebidas = document.getElementById('grid-bebidas');

      if (gHamb) gHamb.innerHTML = '';
      if (gAlitas) gAlitas.innerHTML = '';
      if (gBebidas) gBebidas.innerHTML = '';

      productos.forEach(prod => {
        const tarjeta = `
          <div class="card">
            <img src="${prod.imagen}" alt="${prod.nombre}" onerror="this.src='https://via.placeholder.com/260x180?text=Hamburguesa'">
            <div class="card-body">
              <h3>${prod.nombre}</h3>
              <p class="card-desc">${prod.descripcion}</p>
              <input type="text" id="nota-${prod.id}" class="item-note" placeholder="Nota (ej. sin cebolla, extra salsa)">
              <div class="price-row">
                <span class="price">$${prod.precio}</span>
                <button class="btn-add" onclick="agregarPlatillo(${prod.id}, '${prod.nombre}', ${prod.precio})">Agregar</button>
              </div>
            </div>
          </div>
        `;

        if (prod.categoria === 'hamburguesas' && gHamb) gHamb.innerHTML += tarjeta;
        else if (prod.categoria === 'alitas' && gAlitas) gAlitas.innerHTML += tarjeta;
        else if (prod.categoria === 'bebidas' && gBebidas) gBebidas.innerHTML += tarjeta;
      });
    });
}

function agregarPlatillo(id, nombre, precio) {
  const notaInput = document.getElementById(`nota-${id}`);
  const nota = notaInput ? notaInput.value : '';
  
  carrito.push({ nombre, precio, nota });
  document.getElementById('cart-count').innerText = carrito.length;
  
  // Notificación elegante en lugar del alert() nativo
  mostrarNotificacion(`✅ ¡Producto agregado con éxito: ${nombre}!`);
  
  if(notaInput) notaInput.value = '';
}

// Función para mostrar notificación flotante sin interrumpir la pantalla
function mostrarNotificacion(texto) {
  let noti = document.getElementById('toast-notificacion');
  if (!noti) {
    noti = document.createElement('div');
    noti.id = 'toast-notificacion';
    noti.style.cssText = `
      position: fixed; top: 20px; right: 20px; background: #ff2a85; color: white;
      padding: 12px 20px; border-radius: 8px; font-weight: bold; z-index: 9999;
      box-shadow: 0 4px 15px rgba(255, 42, 133, 0.4); transition: opacity 0.3s ease;
    `;
    document.body.appendChild(noti);
  }
  noti.innerText = texto;
  noti.style.opacity = '1';
  setTimeout(() => {
    noti.style.opacity = '0';
  }, 2500);
}

function abrirCarrito() {
  const itemsContainer = document.getElementById('cart-items');
  itemsContainer.innerHTML = '';
  let total = 0;

  if (carrito.length === 0) {
    itemsContainer.innerHTML = '<p style="color:var(--text-muted);">Tu carrito está vacío.</p>';
  } else {
    carrito.forEach((item, index) => {
      total += item.precio;
      itemsContainer.innerHTML += `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#0d0d12; padding:10px; margin-bottom:8px; border-radius:6px; border:1px solid var(--border-color);">
          <div>
            <strong>${item.nombre}</strong> - $${item.precio}
            ${item.nota ? `<br><small style="color:var(--accent-pink);">Nota: ${item.nota}</small>` : ''}
          </div>
          <button onclick="eliminarDelCarrito(${index})" style="background:#ff4d4d; color:white; border:none; padding:5px 8px; border-radius:4px; cursor:pointer;">X</button>
        </div>
      `;
    });
  }

  document.getElementById('cart-total').innerText = total;
  document.getElementById('cart-modal').style.display = 'flex';
}

function cerrarCarrito() {
  document.getElementById('cart-modal').style.display = 'none';
}

function toggleEntrega() {
  const tipo = document.querySelector('input[name="entrega"]:checked').value;
  document.getElementById('dir-container').style.display = (tipo === 'Domicilio') ? 'block' : 'none';
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  document.getElementById('cart-count').innerText = carrito.length;
  abrirCarrito();
}

function enviarWhatsApp() {
  if (carrito.length === 0) {
    alert("Agrega platillos primero.");
    return;
  }

  const servicio = document.querySelector('input[name="entrega"]:checked').value;
  const direccion = document.getElementById('cart-dir').value;
  const pago = document.getElementById('cart-pago').value;

  if (servicio === 'Domicilio' && !direccion.trim()) {
    alert("Por favor ingresa tu dirección de entrega.");
    return;
  }

  let total = 0;
  
  // Tu estructura exacta adaptada con %0A para los saltos de línea de WhatsApp
  let orderText = `🍔 *NUEVO PEDIDO - Hamburguesas y alitas IVN* 🍔%0A%0A`;
  orderText += `📦 *Tipo de Servicio:* ${servicio}%0A`;
  
  if(servicio === 'Domicilio') {
    orderText += `📍 *Ubicación:* ${direccion}%0A`;
  }
  
  orderText += `💳 *Forma de Pago:* ${pago}%0A%0A`;
  orderText += `🛒 *Productos Solicitados:*%0A`;

  carrito.forEach(item => {
    total += item.precio;
    orderText += `• ${item.name || item.nombre} ($${item.precio.toFixed(2)})`;
    if(item.nota) {
      orderText += `%0A  ↳ _Nota: ${item.nota}_`;
    }
    orderText += `%0A`;
  });

  orderText += `%0A💰 *TOTAL A PAGAR: $${total.toFixed(2)}*`;

  window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${orderText}`, '_blank');
}