const cur = document.getElementById("cursor"),
  ring = document.getElementById("cursorRing");
document.addEventListener("mousemove", (e) => {
  cur.style.left = e.clientX + "px";
  cur.style.top = e.clientY + "px";
  setTimeout(() => {
    ring.style.left = e.clientX + "px";
    ring.style.top = e.clientY + "px";
  }, 80);
});
document
  .querySelectorAll("a,button,.car-card,.feat,.car-tab,.loc-item,.map-pin")
  .forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cur.style.transform = "translate(-50%,-50%) scale(2)";
      ring.style.transform = "translate(-50%,-50%) scale(1.5)";
      ring.style.borderColor = "rgba(200,57,43,.8)";
    });
    el.addEventListener("mouseleave", () => {
      cur.style.transform = "translate(-50%,-50%) scale(1)";
      ring.style.transform = "translate(-50%,-50%) scale(1)";
      ring.style.borderColor = "rgba(200,57,43,.5)";
    });
  });

/* ── DASHBOARD / SPEEDOMETER ── */
const carData = [
  {
    name: "Porsche 911 GT3",
    speed: 320,
    midSpeed: 160,
    accel: "3.2",
    hp: 503,
    torque: 470,
    accelPct: 90,
    hpPct: 82,
    torquePct: 76,
    needleDeg: 30,
    engine: "4.0L Flat-6",
    fuel: "Petrol",
    trans: "7-Speed PDK",
    seats: "2",
    drive: "RWD",
    range: "640 km",
  },
  {
    name: "Mercedes E-Class",
    speed: 250,
    midSpeed: 125,
    accel: "5.9",
    hp: 258,
    torque: 400,
    accelPct: 55,
    hpPct: 42,
    torquePct: 65,
    needleDeg: -15,
    engine: "2.0L Inline-4",
    fuel: "Petrol",
    trans: "9-Speed Auto",
    seats: "5",
    drive: "RWD",
    range: "700 km",
  },
  {
    name: "Tesla Model X",
    speed: 250,
    midSpeed: 125,
    accel: "3.9",
    hp: 670,
    torque: 750,
    accelPct: 80,
    hpPct: 100,
    torquePct: 100,
    needleDeg: -15,
    engine: "Dual Motor",
    fuel: "Electric",
    trans: "1-Speed Auto",
    seats: "7",
    drive: "AWD",
    range: "547 km",
  },
  {
    name: "Ferrari Roma",
    speed: 320,
    midSpeed: 160,
    accel: "3.4",
    hp: 620,
    torque: 760,
    accelPct: 88,
    hpPct: 98,
    torquePct: 100,
    needleDeg: 30,
    engine: "3.9L V8",
    fuel: "Petrol",
    trans: "8-Speed DCT",
    seats: "2",
    drive: "RWD",
    range: "590 km",
  },
];

function selectCar(idx, el) {
  document
    .querySelectorAll(".car-tab")
    .forEach((t) => t.classList.remove("active"));
  el.classList.add("active");
  const d = carData[idx];

  // update needle
  const needle = document.getElementById("needle");
  needle.style.animation = "none";
  needle.offsetHeight; // reflow
  needle.style.setProperty("--needle-end", d.needleDeg + "deg");
  needle.style.animation =
    "needleSweep 2.2s cubic-bezier(.22,1,.36,1) forwards";

  // update arc
  const arc = document.getElementById("activeArc");
  const totalArcLen = 870;
  const fillRatio = (d.needleDeg + 130) / 160; // -130 to 30 = 160deg range
  const offset =
    totalArcLen - totalArcLen * Math.max(0, Math.min(1, fillRatio));
  arc.style.strokeDashoffset = offset;

  // update labels
  document.getElementById("midLabel").textContent = d.midSpeed;
  document.getElementById("maxLabel").textContent = d.speed;
  document.getElementById("speedVal").textContent = d.speed;
  document.getElementById("accelVal").innerHTML = d.accel + "<span>s</span>";
  document.getElementById("hpVal").innerHTML = d.hp + "<span>hp</span>";
  document.getElementById("torqueVal").innerHTML = d.torque + "<span>Nm</span>";
  document.getElementById("accelBar").style.width = d.accelPct + "%";
  document.getElementById("hpBar").style.width = d.hpPct + "%";
  document.getElementById("torqueBar").style.width = d.torquePct + "%";
  document.getElementById("specEngine").innerHTML = d.engine;
  document.getElementById("specFuel").textContent = d.fuel;
  document.getElementById("specTrans").innerHTML = d.trans;
  document.getElementById("specSeats").innerHTML =
    d.seats + " <span>seats</span>";
  document.getElementById("specDrive").textContent = d.drive;
  document.getElementById("specRange").innerHTML =
    d.range.replace(" ", "<span>") + "</span>";
}

// Init arc animation on load
window.addEventListener("load", () => {
  setTimeout(() => {
    const arc = document.getElementById("activeArc");
    arc.style.strokeDashoffset = "340"; // ~60% fill for Porsche
  }, 400);
  // Draw tick marks
  const g = document.getElementById("ticks");
  for (let i = 0; i <= 16; i++) {
    const angle = -130 + i * (160 / 16);
    const rad = ((angle - 90) * Math.PI) / 180;
    const r1 = i % 4 === 0 ? 132 : 138;
    const r2 = 150;
    const x1 = 190 + r1 * Math.cos(rad),
      y1 = 190 + r1 * Math.sin(rad);
    const x2 = 190 + r2 * Math.cos(rad),
      y2 = 190 + r2 * Math.sin(rad);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute(
      "stroke",
      i % 4 === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)",
    );
    line.setAttribute("stroke-width", i % 4 === 0 ? "2" : "1");
    line.setAttribute("stroke-linecap", "round");
    g.appendChild(line);
  }
});

/* ── MAP ── */
const cities = [
  {
    name: "New York",
    country: "United States 🇺🇸",
    cars: 24,
    points: 6,
    from: 49,
    x: 17.5,
    y: 32,
  },
  {
    name: "London",
    country: "United Kingdom 🇬🇧",
    cars: 31,
    points: 8,
    from: 55,
    x: 43.5,
    y: 20,
  },
  {
    name: "Paris",
    country: "France 🇫🇷",
    cars: 28,
    points: 7,
    from: 60,
    x: 44.5,
    y: 25,
  },
  {
    name: "Dubai",
    country: "UAE 🇦🇪",
    cars: 42,
    points: 5,
    from: 80,
    x: 59,
    y: 40,
  },
  {
    name: "Tokyo",
    country: "Japan 🇯🇵",
    cars: 18,
    points: 4,
    from: 90,
    x: 82.5,
    y: 26,
  },
  {
    name: "Sydney",
    country: "Australia 🇦🇺",
    cars: 16,
    points: 3,
    from: 70,
    x: 80,
    y: 72,
  },
  {
    name: "Los Angeles",
    country: "United States 🇺🇸",
    cars: 36,
    points: 9,
    from: 49,
    x: 10,
    y: 38,
  },
  {
    name: "Singapore",
    country: "Singapore 🇸🇬",
    cars: 22,
    points: 4,
    from: 75,
    x: 74,
    y: 57,
  },
];

let activeCity = 0;

function buildMap() {
  const list = document.getElementById("locList");
  const pins = document.getElementById("pinsContainer");
  cities.forEach((c, i) => {
    // sidebar item
    const item = document.createElement("div");
    item.className = "loc-item" + (i === 0 ? " active" : "");
    item.innerHTML = `<div class="loc-dot"></div><div><div class="loc-name">${c.name}</div><div class="loc-count">${c.cars} cars available</div></div><span class="loc-arrow">→</span>`;
    item.onclick = () => activateCity(i);
    list.appendChild(item);

    // pin
    const pin = document.createElement("div");
    pin.className = "map-pin" + (i === 0 ? " active" : "");
    pin.style.left = c.x + "%";
    pin.style.top = c.y + "%";
    pin.innerHTML = `<div class="pin-dot${i === 0 ? " active" : ""}"></div><div class="pin-label">${c.name}</div>`;
    pin.onclick = () => activateCity(i);
    pins.appendChild(pin);
  });
  updateInfoCard(0);
}

function activateCity(i) {
  activeCity = i;
  // sidebar
  document
    .querySelectorAll(".loc-item")
    .forEach((el, idx) => el.classList.toggle("active", idx === i));
  // pins
  document.querySelectorAll(".map-pin").forEach((el, idx) => {
    el.classList.toggle("active", idx === i);
    el.querySelector(".pin-dot").classList.toggle("active", idx === i);
  });
  updateInfoCard(i);
}

function updateInfoCard(i) {
  const c = cities[i];
  document.getElementById("micCity").textContent = c.name;
  document.getElementById("micCountry").textContent = c.country;
  document.getElementById("micCars").innerHTML = c.cars + " <span>units</span>";
  document.getElementById("micPoints").innerHTML =
    c.points + " <span>spots</span>";
  document.getElementById("micFrom").innerHTML =
    "$" + c.from + "<span>/day</span>";
}

function getLatestCarCount() {
  fetch("http://localhost:8080/bookings")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching car count:", error);
    });
}

getLatestCarCount();

buildMap();

function setCurrentDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById("pickupDate").value = now.toISOString().slice(0, 16);
  now.setDate(now.getDate() + 1);
  document.getElementById("returnDate").value = now.toISOString().slice(0, 16);
}

setCurrentDateTime();
