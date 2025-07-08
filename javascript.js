document.addEventListener('DOMContentLoaded', () => {
    // ======================
    // ANIMACIONES DE ENTRADA
    // ======================
    const animateSections = () => {
        const sections = document.querySelectorAll('.section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    };

    // ======================
    // EFECTO DE MOVIMIENTO CON MOUSE
    // ======================
    const setupMouseMoveEffect = () => {
        const shapes = document.querySelectorAll('.shape');
        if (!shapes.length) return;

        document.addEventListener('mousemove', e => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            
            shapes.forEach((shape, i) => {
                const speed = (i + 1) * 0.3;
                shape.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${x * speed * 0.2}deg)`;
            });
        });
    };

    // ======================
    // ANIMACIÓN DE ESTADÍSTICAS
    // ======================
    const animateStats = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (!statNumbers.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const target = stat.textContent.includes('+') 
                        ? parseInt(stat.textContent) 
                        : stat.textContent.includes('%') 
                            ? parseInt(stat.textContent)
                            : parseFloat(stat.textContent);
                    const isPercentage = stat.textContent.includes('%');
                    const duration = 2000; // 2 segundos
                    const startTime = performance.now();

                    const animate = (currentTime) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        
                        if (typeof target === 'number') {
                            const currentValue = Math.floor(progress * target);
                            stat.textContent = isPercentage 
                                ? `${currentValue}%` 
                                : target > 100 && currentValue === target 
                                    ? `${target}+`
                                    : currentValue;
                        } else {
                            // Para valores no numéricos (como "100%+")
                            stat.textContent = target;
                        }

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };

                    requestAnimationFrame(animate);
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(stat => observer.observe(stat));
    };

    // ======================
    // INTERACTIVIDAD DE TARJETAS
    // ======================
    const setupCardInteractions = () => {
        // Proyectos
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Si el clic fue en un enlace interno, no hacer nada
                if (e.target.tagName === 'A' || e.target.closest('a')) return;
                
                const link = card.querySelector('a');
                if (link) {
                    window.open(link.href, '_blank');
                }
            });
        });

        // Artículos
        const articleCards = document.querySelectorAll('.article-card');
        articleCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const link = card.querySelector('a');
                if (link && !e.target.closest('a')) {
                    window.location.href = link.href;
                }
            });
        });
    };

    // ======================
    // TESTIMONIOS - CARRUSEL
    // ======================
    const setupTestimonialsCarousel = () => {
        const testimonialsContainer = document.querySelector('.testimonials');
        if (!testimonialsContainer) return;

        let isDown = false;
        let startX;
        let scrollLeft;

        testimonialsContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - testimonialsContainer.offsetLeft;
            scrollLeft = testimonialsContainer.scrollLeft;
            testimonialsContainer.style.cursor = 'grabbing';
            testimonialsContainer.style.scrollBehavior = 'auto';
        });

        testimonialsContainer.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialsContainer.style.cursor = 'grab';
        });

        testimonialsContainer.addEventListener('mouseup', () => {
            isDown = false;
            testimonialsContainer.style.cursor = 'grab';
            testimonialsContainer.style.scrollBehavior = 'smooth';
        });

        testimonialsContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialsContainer.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsContainer.scrollLeft = scrollLeft - walk;
        });

        // Touch events para móviles
        testimonialsContainer.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - testimonialsContainer.offsetLeft;
            scrollLeft = testimonialsContainer.scrollLeft;
        });

        testimonialsContainer.addEventListener('touchend', () => {
            isDown = false;
        });

        testimonialsContainer.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            const x = e.touches[0].pageX - testimonialsContainer.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialsContainer.scrollLeft = scrollLeft - walk;
        });
    };

    // ======================
    // MODAL DE LOGIN
    // ======================
    const setupLoginModal = () => {
        const loginBtn = document.getElementById('loginBtn');
        const loginModal = document.getElementById('loginModal');
        const closeModal = document.getElementById('closeModal');
        const submitLogin = document.getElementById('submitLogin');
        const loginError = document.getElementById('loginError');

        // Solo configurar si los elementos existen
        if (!loginModal || !closeModal) return;

        // Abrir modal
        if (loginBtn) {
            loginBtn.onclick = () => {
                loginModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            };
        }

        // Cerrar modal
        closeModal.onclick = () => {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        // Cerrar al hacer clic fuera
        window.onclick = (e) => { 
            if (e.target === loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        };

        // Envío del formulario
        if (submitLogin) {
            submitLogin.onclick = (e) => {
                e.preventDefault();
                const user = document.getElementById('user')?.value.trim();
                const pass = document.getElementById('pass')?.value.trim();
                
                // Validación básica - reemplazar con tu lógica real
                if (user === 'admin' && pass === '1234') {
                    window.location.href = 'dashboard.html';
                } else {
                    loginError.style.display = 'block';
                    setTimeout(() => {
                        loginError.style.display = 'none';
                    }, 3000);
                }
            };
        }
    };

    // ======================
    // OBSERVADOR DE CAMBIOS EN EL DOM
    // ======================
    const setupMutationObserver = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    // Re-inicializar componentes si se agregan nuevos nodos
                    animateSections();
                    setupCardInteractions();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    // ======================
    // INICIALIZAR TODAS LAS FUNCIONES
    // ======================
    const init = () => {
        animateSections();
        setupMouseMoveEffect();
        animateStats();
        setupCardInteractions();
        setupTestimonialsCarousel();
        setupLoginModal();
        setupMutationObserver();

        // Mostrar el cuerpo solo después de que todo esté cargado
        document.body.style.opacity = '1';
    };

    // Iniciar
    init();
});

// ======================
// POLYFILLS PARA COMPATIBILIDAD
// ======================
// IntersectionObserver polyfill para navegadores antiguos
if (!('IntersectionObserver' in window) ||
    !('IntersectionObserverEntry' in window) ||
    !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
}