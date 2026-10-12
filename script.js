document.addEventListener('DOMContentLoaded', () => {
    // Mise à jour de l'année dans le footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Gestion du formulaire d'inscription / capture d'email
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email-input');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackBox = document.getElementById('form-feedback');

    // Validation basique d'email
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Affichage des notifications
    const showFeedback = (message, type = 'success') => {
        feedbackBox.textContent = message;
        feedbackBox.className = `form-feedback ${type}`;
        feedbackBox.style.display = 'block';
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();

            if (!email) {
                showFeedback('Veuillez renseigner votre adresse e-mail.', 'error');
                emailInput.focus();
                return;
            }

            if (!isValidEmail(email)) {
                showFeedback('Veuillez entrer une adresse e-mail valide.', 'error');
                emailInput.focus();
                return;
            }

            // État de chargement
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
                </svg>
                <span>Enregistrement...</span>
            `;

            // Simulation d'envoi (peut être remplacé par un fetch vers un Cloudflare Worker ou Formspree)
            setTimeout(() => {
                // Sauvegarde locale de démonstration
                try {
                    const existing = JSON.parse(localStorage.getItem('inframine_waitlist') || '[]');
                    if (!existing.includes(email)) {
                        existing.push(email);
                        localStorage.setItem('inframine_waitlist', JSON.stringify(existing));
                    }
                } catch (err) {
                    console.warn('LocalStorage non disponible:', err);
                }

                // Succès
                showFeedback('🎉 Merci ! Vous avez été ajouté(e) avec succès à la liste d\'attente Inframine.', 'success');
                emailInput.value = '';
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <span>Inscrit !</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;

                // Réinitialise le bouton après 4 secondes
                setTimeout(() => {
                    submitBtn.innerHTML = originalBtnContent;
                }, 4000);
            }, 800);
        });
    }

    // Effet subtil de suivi du curseur pour les lumières d'arrière-plan
    const glow1 = document.querySelector('.glow-1');
    if (glow1 && window.matchMedia('(pointer: fine)').matches) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth) * 30;
            const y = (e.clientY / window.innerHeight) * 30;
            glow1.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
});
