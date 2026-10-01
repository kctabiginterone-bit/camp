const A = "ccAppointments";
const get = () => JSON.parse(localStorage.getItem(A) || "[]");
const save = x => localStorage.setItem(A, JSON.stringify(x));
const sid = localStorage.getItem("sid") || "2026-00123";
const $ = x => document.querySelector(x);

function toast(x) {
    let t = $("#toast");
    if (t) {
        t.textContent = x;
        t.classList.add("show");
        setTimeout(() => t.classList.remove("show"), 2200);
    }
}

function date(x) {
    return new Date(x + "T00:00").toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let n = localStorage.getItem("name") || "Student";
    if ($("#name")) $("#name").textContent = n.split(" ")[0];
    if ($("#topName")) $("#topName").textContent = n.split(" ")[0];
    if ($("#logout")) $("#logout").onclick = () => {
        localStorage.removeItem("sid");
        location = "index.html";
    };
    if ($("#menu")) $("#menu").onclick = () => document.querySelector("aside").classList.toggle("open");
    if ($("#count")) dash();
    if ($("#list")) apps();
    if ($("#save")) profile();
});

function dash() {
    let a = get().filter(x => x.status == "Scheduled").sort((x, y) => (x.date + x.time).localeCompare(y.date + y.time));
    $("#count").textContent = get().length;
    if (a[0]) {
        $("#date").textContent = date(a[0].date);
        $("#service").textContent = a[0].service;
        $("#next").innerHTML = `<div class="appointment"><div><b>${a[0].service}</b><small>${date(a[0].date)} · ${a[0].time}</small><small>Campus Clinic</small></div><span class="pill">Scheduled</span></div>`;
    }
}

function apps() {
    let box = $("#formbox"),
        show = () => box.style.display = "block";
    $("#open").onclick = show;
    $("#close").onclick = () => box.style.display = "none";
    let d = $("#dt");
    d.min = new Date().toISOString().slice(0, 10);
    $("#book").onsubmit = e => {
        e.preventDefault();
        let a = get();
        a.push({
            id: Date.now(),
            service: $("#svc").value,
            date: d.value,
            time: $("#tm").value,
            note: $("#note").value,
            status: "Scheduled"
        });
        save(a);
        e.target.reset();
        box.style.display = "none";
        render();
        toast("Appointment booked successfully.");
    };
    render();
    if (location.hash == "#book") show();
}

function render() {
    let a = get();
    $("#total").textContent = a.length + " appointment" + (a.length == 1 ? "" : "s");
    $("#list").innerHTML = a.length ? a.reverse().map(x => `
        <div class="appointment">
            <div>
                <b>${x.service}</b>
                <small>${date(x.date)} · ${x.time}</small>
                <small>Campus Clinic${x.note ? " · " + x.note : ""}</small>
            </div>
            <div>
                <span class="pill">${x.status}</span>
                ${x.status == "Scheduled" ? `<button class="danger" onclick="cancel(${x.id})">Cancel</button>` : ""}
            </div>
        </div>
    `).join("") : '<div class="empty">No appointments yet.<br><a href="#book" onclick="document.getElementById("open").click()">Book an appointment</a></div>';
}

window.cancel = id => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
        save(get().map(x => x.id == id ? { ...x, status: "Cancelled" } : x));
        render();
        toast("Appointment cancelled.");
    }
};

function profile() {
    $("#pid").value = sid;
    $("#displayId").textContent = sid;
    let n = localStorage.getItem("name") || "Juan Dela Cruz";
    $("#full").value = n;
    $("#display").textContent = n;
    $("#save").onclick = () => {
        let n = $("#full").value || "Juan Dela Cruz";
        localStorage.setItem("name", n);
        $("#display").textContent = n;
        toast("Profile saved successfully.");
    };
}
