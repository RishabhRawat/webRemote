const baseInput = document.getElementById("base");
const status = document.getElementById("status");

// Restore saved base URL
baseInput.value = localStorage.getItem("baseUrl") || "";

// Auto-save
baseInput.addEventListener("input", () => {
    localStorage.setItem("baseUrl", baseInput.value.trim());
});

async function call(path) {
    const base = baseInput.value.trim().replace(/\/$/, "");

    if (!base) {
        status.textContent = "🔴 No Base URL";
        return;
    }

    try {
        const response = await fetch(base + path);

        if (!response.ok) {
            throw new Error(response.status);
        }

        status.textContent = "🟢 Connected";
    } catch (err) {
        console.error(err);
        status.textContent = "🔴 Failed";
    }
}

// Long press support
document.querySelectorAll("[data-p]").forEach(button => {
    let interval;

    const press = () => call(button.dataset.p);

    button.addEventListener("pointerdown", () => {
        press();
        interval = setInterval(press, 120);
    });

    ["pointerup", "pointerleave", "pointercancel"].forEach(event =>
        button.addEventListener(event, () => clearInterval(interval))
    );
});

// Text
document.getElementById("sendText").addEventListener("click", () => {
    const value = encodeURIComponent(document.getElementById("text").value);
    call(`/text?value=${value}`);
});

// Press Enter in text box to send
document.getElementById("text").addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("sendText").click();
    }
});

// Tap
document.getElementById("tap").addEventListener("click", () => {
    const x = document.getElementById("x").value;
    const y = document.getElementById("y").value;
    call(`/click?x=${x}&y=${y}`);
});

// Swipe
document.getElementById("swipe").addEventListener("click", () => {
    const x1 = document.getElementById("x1").value;
    const y1 = document.getElementById("y1").value;
    const x2 = document.getElementById("x2").value;
    const y2 = document.getElementById("y2").value;
    const duration = document.getElementById("dur").value || 300;

    call(`/swipe?x1=${x1}&y1=${y1}&x2=${x2}&y2=${y2}&duration=${duration}`);
});

// Keycode
document.getElementById("sendKey").addEventListener("click", () => {
    const code = document.getElementById("key").value;
    call(`/keycode?code=${code}`);
});

// Register service worker
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
}