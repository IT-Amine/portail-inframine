/* =======================================================================
   INFRAMINE — script.js
   Gestion des interactions : animation CLI, inscription bêta RGPD,
   modales légales natives, FAQ accordéon, navigation lisse.
   ======================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Année dynamique ────────────────────────────────────────────────
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    // ── 2. Modales légales natives (<dialog>) ─────────────────────────────
    document.querySelectorAll('.js-open-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const dialog = document.getElementById(btn.dataset.modal);
            if (dialog && typeof dialog.showModal === 'function') {
                dialog.showModal();
            }
        });
    });

    document.querySelectorAll('.js-close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            const dialog = btn.closest('dialog');
            if (dialog) dialog.close();
        });
    });

    // Fermeture sur clic arrière-plan
    document.querySelectorAll('dialog.legal-dialog').forEach(dialog => {
        dialog.addEventListener('click', e => {
            const r = dialog.getBoundingClientRect();
            if (
                e.clientY < r.top || e.clientY > r.bottom ||
                e.clientX < r.left || e.clientX > r.right
            ) dialog.close();
        });
    });


    // ── 3. Navigation lisse (ancres internes) ─────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });


    // ── 4. Formulaire d'inscription bêta (RGPD / CNIL) ───────────────────
    const form        = document.getElementById('waitlist-form');
    const emailInput  = document.getElementById('email');
    const orgInput    = document.getElementById('org');
    const consentBox  = document.getElementById('rgpd-consent');
    const submitBtn   = document.getElementById('submit-btn');
    const errorMsg    = document.getElementById('form-error');
    const successBox  = document.getElementById('form-success');
    const successText = document.getElementById('success-text');

    if (form) {
        const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

        const showError = msg => { if (errorMsg) errorMsg.textContent = msg; };
        const clearError = ()  => { if (errorMsg) errorMsg.textContent = ''; };

        form.addEventListener('submit', e => {
            e.preventDefault();
            clearError();

            const email = emailInput ? emailInput.value.trim() : '';
            const org   = orgInput   ? orgInput.value.trim()   : '';

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
            if (consentBox && !consentBox.checked) {
                showError('Veuillez cocher la case de consentement (obligation légale RGPD Art. 6 & 7).');
                consentBox.focus();
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enregistrement sécurisé…';

            // Production : remplacer par un Cloudflare Worker ou Web3Forms avec
            // payload { email, org, consent_rgpd: true, consent_timestamp, user_agent }
            setTimeout(() => {
                persistLead({ email, org });
                handleSuccess(email);
            }, 700);
        });

        function handleSuccess(email) {
            form.hidden = true;
            if (successBox && successText) {
                successText.textContent =
                    `Candidature reçue. Nous vous contacterons à ${email} dès l'ouverture des accès bêta. Vos données sont protégées conformément à notre politique de confidentialité.`;
                successBox.hidden = false;
            }
        }

        function persistLead({ email, org }) {
            try {
                const list = JSON.parse(localStorage.getItem('inframine_waitlist') || '[]');
                list.push({
                    email,
                    org: org || null,
                    timestamp: new Date().toISOString(),
                    rgpd_compliant: true
                });
                localStorage.setItem('inframine_waitlist', JSON.stringify(list));
            } catch {
                // Environnement sans accès au stockage local — sans conséquence
            }
        }
    }


    // ── 5. Animation terminal CLI (déclenchée au scroll) ─────────────────
    const termWindow = document.getElementById('terminal-window');
    const termOutput = document.getElementById('terminal-output');

    if (!termWindow || !termOutput) return;

    // Contenu de la démo (tokens colorisés avec spans)
    const LINES = [
        '<span class="t-comment"># Connexion d\'un nouveau cluster</span>',
        '<span class="t-prompt">$ </span><span class="t-cmd">inframine cluster connect</span> <span class="t-flag">--name</span> <span class="t-str">cluster-edge-01</span> \\',
        '    <span class="t-flag">--kubeconfig</span> <span class="t-str">~/.kube/edge-01.yaml</span> \\',
        '    <span class="t-flag">--region</span> <span class="t-str">eu-west-1</span>',
        '<span class="t-ok">✓</span> Authentification…',
        '<span class="t-ok">✓</span> Cluster accessible  <span class="t-dim">(latence : 23ms)</span>',
        '<span class="t-ok">✓</span> Agent déployé       <span class="t-dim">(version : v0.9.1)</span>',
        '<span class="t-ok">✓</span> Synchronisation de l\'état… terminé  <span class="t-val">412 ressources</span>',
        '  <span class="t-dim">→</span> cluster-edge-01 géré par Inframine',
        '  <span class="t-dim">→</span> Topologie mise à jour, 3 nouveaux nœuds visibles',
        '',
        '<span class="t-comment"># Application d\'une politique réseau</span>',
        '<span class="t-prompt">$ </span><span class="t-cmd">inframine policy apply</span> <span class="t-str">./policies/network-isolation-v2.yaml</span> \\',
        '    <span class="t-flag">--clusters</span> <span class="t-str">all</span> <span class="t-flag">--dry-run</span>',
        '<span class="t-ok">✓</span> Validation du schéma de politique…',
        '<span class="t-ok">✓</span> Dry-run : <span class="t-val">0 violation</span> sur 3 clusters',
        '<span class="t-warn">?</span> Appliquer ? <span class="t-dim">[y/N]</span> <span class="t-val">y</span>',
        '<span class="t-ok">✓</span> cluster-prod-fr    <span class="t-dim">→</span> network-isolation-v2 appliquée <span class="t-dim">(47 ns)</span>',
        '<span class="t-ok">✓</span> cluster-staging    <span class="t-dim">→</span> network-isolation-v2 appliquée <span class="t-dim">(12 ns)</span>',
        '<span class="t-ok">✓</span> cluster-edge-01    <span class="t-dim">→</span> network-isolation-v2 appliquée  <span class="t-dim">(5 ns)</span>',
        '  Politique archivée : <span class="t-dim">network-isolation-v1</span>',
    ];

    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let animated = false;

    function showAllAtOnce() {
        termOutput.innerHTML = LINES.join('\n') + '\n<span class="cursor"> </span>';
    }

    function runAnimation() {
        if (animated) return;
        animated = true;

        if (REDUCED) {
            showAllAtOnce();
            return;
        }

        termOutput.innerHTML = '';
        let lineIndex = 0;

        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.textContent = ' ';

        const lineDelay = 90; // ms entre chaque ligne

        function printNextLine() {
            if (lineIndex >= LINES.length) {
                termOutput.appendChild(cursor);
                return;
            }

            const lineEl = document.createElement('span');
            lineEl.innerHTML = LINES[lineIndex] + '\n';

            // Effet d'apparition légèrement décalé selon le type de ligne
            const isCommand = LINES[lineIndex].includes('t-prompt');
            const delay = isCommand ? lineDelay * 2 : lineDelay;

            termOutput.appendChild(lineEl);
            termWindow.scrollTop = termWindow.scrollHeight;

            lineIndex++;
            setTimeout(printNextLine, delay);
        }

        // Petite pause avant le démarrage (effet naturel)
        setTimeout(printNextLine, 400);
    }

    // IntersectionObserver : déclenche l'animation quand la fenêtre terminal
    // entre dans le viewport (threshold 25 %)
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runAnimation();
                    observer.unobserve(termWindow);
                }
            });
        }, { threshold: 0.25 });

        observer.observe(termWindow);
    } else {
        // Navigateur sans IntersectionObserver (rare) : afficher immédiatement
        showAllAtOnce();
    }

});
