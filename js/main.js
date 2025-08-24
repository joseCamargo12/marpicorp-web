document.addEventListener('DOMContentLoaded', function () {
    // --- SISTEMA DE TRADUCCIÓN MEJORADO ---
    let currentLanguage = 'es';

    const translations = {
        es: {},
        en: {}
    };

    // Recopilar todas las traducciones al cargar la página
    function collectTranslations() {
        const elements = document.querySelectorAll('[data-lang-es]');
        elements.forEach(element => {
            const esText = element.getAttribute('data-lang-es');
            const enText = element.getAttribute('data-lang-en');
            const esPlaceholder = element.getAttribute('data-lang-es-placeholder');
            const enPlaceholder = element.getAttribute('data-lang-en-placeholder');

            if (!translations.es[element]) translations.es[element] = {};
            if (!translations.en[element]) translations.en[element] = {};

            if (esText) {
                translations.es[element].text = esText;
                translations.en[element].text = enText;
            }

            if (esPlaceholder) {
                translations.es[element].placeholder = esPlaceholder;
                translations.en[element].placeholder = enPlaceholder;
            }
        });
    }

    // Función para cambiar idioma
    function changeLanguage(newLang) {
        if (newLang === currentLanguage) return;

        currentLanguage = newLang;
        document.documentElement.lang = newLang;

        // Actualizar todos los elementos con traducciones
        const elements = document.querySelectorAll('[data-lang-es]');
        elements.forEach(element => {
            const textKey = `lang-${newLang}`;
            const placeholderKey = `lang-${newLang}-placeholder`;

            // Actualizar texto
            const newText = element.getAttribute(`data-${textKey}`);
            if (newText) {
                element.textContent = newText;
            }

            // Actualizar placeholder
            const newPlaceholder = element.getAttribute(`data-${placeholderKey}`);
            if (newPlaceholder) {
                element.placeholder = newPlaceholder;
            }
        });

        // Actualizar botones de idioma
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === newLang);
        });

        // Actualizar mensajes de error del modal
        updateModalErrorMessages();
    }

    function updateModalErrorMessages() {
        const errorElement = document.getElementById('proposal-error');
        if (errorElement && errorElement.textContent) {
            if (currentLanguage === 'es') {
                errorElement.textContent = 'Código no válido. Verifique por favor.';
            } else {
                errorElement.textContent = 'Invalid code. Please check.';
            }
        }
    }

    // Inicializar sistema de traducciones
    collectTranslations();

    // Event listeners para cambio de idioma
    document.addEventListener('click', function (e) {
        if (e.target.matches('.lang-btn')) {
            const newLang = e.target.dataset.lang;
            changeLanguage(newLang);
        }
    });

    // --- ANIMATIONS ON SCROLL ---
    const animatedElements = document.querySelectorAll('.animated');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));

    // --- MOBILE MENU LOGIC ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuCloseButton = document.getElementById('mobile-menu-close-button');
    const mobileMenu = document.getElementById('mobile-menu');

    const openMobileMenu = () => mobileMenu.classList.add('active');
    const closeMobileMenu = () => mobileMenu.classList.remove('active');

    mobileMenuButton.addEventListener('click', openMobileMenu);
    mobileMenuCloseButton.addEventListener('click', closeMobileMenu);
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Cerrar menú al hacer click en enlaces
    mobileMenu.addEventListener('click', function (e) {
        if (e.target.matches('a')) {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuButton.querySelector('i');
            icon.className = 'bi bi-list';
        }
    });

    // Cerrar menú al hacer click fuera
    document.addEventListener('click', function (e) {
        if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
            mobileMenu.classList.remove('active');
            const icon = mobileMenuButton.querySelector('i');
            icon.className = 'bi bi-list';
        }
    });

    // --- INTERACTIVE SOLUTIONS TABS ---
    const solutionSelectors = document.querySelectorAll('.solution-selector');
    solutionSelectors.forEach(selector => {
        selector.addEventListener('click', function () {
            const targetId = this.dataset.solution + '-content';

            // Remover active de todos los selectores y contenidos
            solutionSelectors.forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.solution-content').forEach(c => c.classList.remove('active'));

            // Activar el seleccionado
            this.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // --- PROPOSAL MODAL LOGIC ---
    const proposalModal = document.getElementById('proposal-modal');
    const closeModalButton = document.getElementById('close-proposal-modal');
    const submitCodeButton = document.getElementById('submit-proposal-code');
    const codeInput = document.getElementById('proposal-code');
    const errorP = document.getElementById('proposal-error');

    // Códigos de propuestas válidos
    const proposalLinks = {
        "ANA-2025": "/propuestas/ana-sierra.html",
        "CLIENTE-B": "/propuestas/cliente-b.html"
    };

    function openModal() {
        proposalModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus en el input después de que se abra la modal
        setTimeout(() => codeInput.focus(), 300);
    }

    function closeModal() {
        proposalModal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            errorP.textContent = '';
            codeInput.value = '';
        }, 300);
    }

    // Event listeners para abrir modal
    document.addEventListener('click', function (e) {
        if (e.target.closest('.open-proposal-modal')) {
            e.preventDefault();
            openModal();
        }
    });

    // Cerrar modal
    closeModalButton.addEventListener('click', closeModal);
    proposalModal.addEventListener('click', function (e) {
        if (e.target === proposalModal) closeModal();
    });

    // Cerrar modal con ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && proposalModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Validar código
    function validateCode() {
        const code = codeInput.value.trim().toUpperCase();
        if (proposalLinks[code]) {
            window.location.href = proposalLinks[code];
        } else {
            const errorMsg = currentLanguage === 'es'
                ? 'Código no válido. Verifique por favor.'
                : 'Invalid code. Please check.';
            errorP.textContent = errorMsg;
            codeInput.focus();
        }
    }

    submitCodeButton.addEventListener('click', validateCode);
    codeInput.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') validateCode();
    });

    // --- CONTACT FORM LOGIC ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const webhookUrl = 'https://n8n.srv883203.hstgr.cloud/webhook/6738f883-a0ba-45b4-819d-ad875da7e940';

    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Estado de carga
            submitButton.disabled = true;
            submitButton.textContent = currentLanguage === 'es' ? 'Enviando...' : 'Sending...';

            // Preparar datos
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Enviar datos
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                mode: 'cors'
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    formStatus.className = 'form-status-message success';
                    formStatus.textContent = currentLanguage === 'es'
                        ? '¡Gracias! Tu mensaje ha sido enviado correctamente.'
                        : 'Thank you! Your message has been sent successfully.';
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Error:', error);
                    formStatus.className = 'form-status-message error';
                    formStatus.textContent = currentLanguage === 'es'
                        ? 'Hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.'
                        : 'There was an error sending your message. Please try again.';
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;

                    // Ocultar mensaje después de 5 segundos
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                        formStatus.className = 'form-status-message';
                    }, 5000);
                });
        });
    }

    // --- SMOOTH SCROLLING PARA ENLACES INTERNOS ---
    document.addEventListener('click', function (e) {
        const link = e.target.closest('a[href^="#"]');
        if (link) {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});