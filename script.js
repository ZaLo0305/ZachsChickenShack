let order = [];
let subtotal = 0;
const TAX_RATE = 0.0825;

/* =========================
   STORE HOURS
========================= */

const HOURS = {
  0: { open: 12, close: 19 }, // Sunday 12–7 PM
  1: null,                    // Monday closed
  2: null,                    // Tuesday closed
  3: { open: 14, close: 21 }, // Wednesday
  4: { open: 14, close: 21 }, // Thursday
  5: { open: 14, close: 21 }, // Friday
  6: { open: 14, close: 21 }  // Saturday
};

const today = new Date().getDay();
const pickupSelect = document.getElementById("pickup-time");
const orderButton = document.querySelector("#order-form button");

/* =========================
   ORDER FUNCTIONS
========================= */

function addToOrder(item, price) {
  order.push({ item, price });
  subtotal += price;
  updateOrderDisplay();
}

function removeFromOrder(index) {
  subtotal -= order[index].price;
  order.splice(index, 1);
  updateOrderDisplay();
}

function updateOrderDisplay() {
  const list = document.getElementById("order-list");
  list.innerHTML = "";

  order.forEach((o, i) => {
    const li = document.createElement("li");
    li.textContent = `${o.item} - $${o.price.toFixed(2)}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = () => removeFromOrder(i);

    li.appendChild(removeBtn);
    list.appendChild(li);
  });

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("tax").textContent = tax.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);

  document.getElementById("hidden-order").value =
    order.map(o => `${o.item} - $${o.price.toFixed(2)}`).join(", ");
}

/* =========================
   TODAY STATUS DISPLAY
========================= */

const statusText = document.getElementById("today-status");

if (statusText) {
  if (!HOURS[today]) {

    statusText.textContent = "Closed today — opens Wednesday at 2PM";
    statusText.classList.add("status-banner", "status-closed");

  } else {

    const { open, close } = HOURS[today];

    const openTime = new Date(0,0,0,open)
      .toLocaleTimeString([], { hour: 'numeric' });

    const closeTime = new Date(0,0,0,close)
      .toLocaleTimeString([], { hour: 'numeric' });

    statusText.textContent = `Open today: ${openTime} – ${closeTime}`;
    statusText.classList.add("status-banner", "status-open");
  }
}


/* =========================
   PICKUP TIME GENERATOR
========================= */

function generatePickupTimes() {
  if (!pickupSelect) return;

  pickupSelect.innerHTML = `<option value="">Select a pickup time</option>`;

  const hoursToday = HOURS[today];

  // CLOSED TODAY
  if (!hoursToday) {
    pickupSelect.innerHTML = `<option value="">Closed today</option>`;
    pickupSelect.disabled = true;

    if (orderButton) {
      orderButton.disabled = true;
      orderButton.textContent = "Closed Today";
    }

    return;
  }

  const { open, close } = hoursToday;

  // ASAP option
  const asap = document.createElement("option");
  asap.value = "ASAP";
  asap.textContent = "ASAP (next available)";
  pickupSelect.appendChild(asap);

  // Generate time slots every 15 mins
  for (let hour = open; hour < close; hour++) {
    for (let min = 0; min < 60; min += 15) {

      const timeLabel = new Date(0,0,0,hour,min)
        .toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

      const option = document.createElement("option");
      option.value = timeLabel;
      option.textContent = timeLabel;

      pickupSelect.appendChild(option);
    }
  }
}

generatePickupTimes();
