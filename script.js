/* =======================================================================
   INFRAMINE — script.js
   Gestion des interactions : Inscription Waitlist RGPD, Modales Légales, FAQ
   ======================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Année dynamique dans le footer ──────────────────────────────
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── 2. Modales Légales Natives (<dialog>) ──────────────────────────
    const openModalButtons = document.querySelectorAll('.js-open-modal');
    const closeModalButtons = document.querySelectorAll('.js-close-modal');

    openModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal');
            const targetDialog = document.getElementById(modalId);
            if (targetDialog && typeof targetDialog.showModal === 'function') {
                targetDialog.showModal();
            }
        });
    });

    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const dialog = btn.closest('dialog');
            if (dialog && typeof dialog.close === 'function') {
                dialog.close();
            }
        });
    });

    // Fermeture d'un dialogue au clic sur l'arrière-plan (backdrop)
    document.querySelectorAll('dialog.legal-dialog').forEach(dialog => {
        dialog.addEventListener('click', (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY &&
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX &&
                e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                dialog.close();
            }
        });
    });

    // ── 3. Gestion du formulaire d'inscription (RGPD / CNIL) ────────────
    const form        = document.getElementById('waitlist-form');
    const emailInput  = document.getElementById('email');
    const consentBox  = document.getElementById('rgpd-consent');
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

        // Validation Email
        if (!email) {
            showError('Veuillez renseigner votre adresse e-mail professionnelle.');
            emailInput && emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showError('Format d\'adresse e-mail invalide.');
            emailInput && emailInput.focus();
            return;
        }

        // Vérification du consentement RGPD (Obligation légale Art. 6 & 7)
        if (consentBox && !consentBox.checked) {
            showError('Veuillez cocher la case de consentement pour valider votre demande (obligation RGPD).');
            consentBox.focus();
            return;
        }

        // État de chargement sobre
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enregistrement sécurisé…';

        // ── Transmission des données ───────────────────────────────────
        // En production : connecter à un Cloudflare Worker avec preuve de consentement
        //
        // payload = {
        //    email: email,
        //    consent_rgpd: true,
        //    consent_timestamp: new Date().toISOString(),
        //    user_agent: navigator.userAgent
        // }
        //
        setTimeout(() => {
            persistLead(email);
            handleSuccess(email);
        }, 650);
    });

    function handleSuccess(email) {
        form.hidden = true;

        if (successBox && successText) {
            successText.textContent =
                `Demande enregistrée. Nous vous contacterons à ${email} dès l'ouverture des accès bêta. Vos données sont protégées selon notre politique de confidentialité.`;
            successBox.hidden = false;
        }
    }

    function persistLead(email) {
        try {
            const list = JSON.parse(localStorage.getItem('inframine_waitlist') || '[]');
            const entry = {
                email: email,
                timestamp: new Date().toISOString(),
                rgpd_compliant: true
            };
            list.push(entry);
            localStorage.setItem('inframine_waitlist', JSON.stringify(list));
        } catch {
            // Environnement sans stockage local
        }
    }

});
