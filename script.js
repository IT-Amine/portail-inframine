/* =======================================================================
   INFRAMINE — script.js
   ======================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // Current year in footer
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── Form handling ──────────────────────────────────────────────────
    const form        = document.getElementById('waitlist-form');
    const emailInput  = document.getElementById('email');
    const submitBtn   = document.getElementById('submit-btn');
    const errorMsg    = document.getElementById('form-error');
    const successBox  = document.getElementById('form-success');
    const successText = document.getElementById('success-text');

    if (!form) return;

    const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    const showError = (msg) => {
        if (errorMsg) {
            errorMsg.textContent = msg;
        }
    };

    const clearError = () => {
        if (errorMsg) errorMsg.textContent = '';
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearError();

        const email = emailInput ? emailInput.value.trim() : '';

        if (!email) {
            showError('Veuillez renseigner votre adresse e-mail.');
            emailInput && emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showError('Adresse e-mail invalide. Vérifiez le format.');
            emailInput && emailInput.focus();
            return;
        }

        // Loading state — descriptive, no spinner icon
        submitBtn.disabled = true;
        submitBtn.textContent = 'Inscription en cours…';

        // ── Submission ─────────────────────────────────────────────────
        //
        // Production: replace this with a fetch() to your Cloudflare Worker
        // or a Formspree endpoint (e.g. https://formspree.io/f/YOUR_FORM_ID).
        //
        // Example:
        //   fetch('https://formspree.io/f/YOUR_FORM_ID', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email }),
        //   }).then(res => res.ok ? handleSuccess(email) : handleFailure());
        //
        setTimeout(() => {
            persistEmail(email);
            handleSuccess(email);
        }, 750);
    });

    function handleSuccess(email) {
        // Hide the form, show the confirmation
        form.hidden = true;

        if (successBox && successText) {
            successText.textContent =
                `Inscription confirmée. Nous vous contacterons à ${email} lors de l'ouverture de l'accès bêta.`;
            successBox.hidden = false;
        }
    }

    function persistEmail(email) {
        // Local demo storage — remove or replace in production
        try {
            const list = JSON.parse(localStorage.getItem('inframine_waitlist') || '[]');
            if (!list.includes(email)) {
                list.push(email);
                localStorage.setItem('inframine_waitlist', JSON.stringify(list));
            }
        } catch {
            // localStorage unavailable (private browsing, etc.) — ignore
        }
    }

});
