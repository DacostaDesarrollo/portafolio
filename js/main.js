// Registrar ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Variables globales
let tl = gsap.timeline();
let matrixInterval;
let currentSection = 0;
let isScrolling = false;
let sections = [];

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeSections();
    initializeAnimations();
    createMatrixEffect();
    setupScrollAnimations();
    setupNavigation();
    setupTypingEffects();
    setupInteractiveElements();
    setupFullPageScroll();
    setupContactForm();
    showNavigationInstructions();
});

// Función para inicializar las secciones
function initializeSections() {
    sections = gsap.utils.toArray('section[id]');
    
    // Configurar cada sección para ocupar toda la pantalla
    sections.forEach((section, index) => {
        const isMobile = window.innerWidth <= 768;
        const isInicioSection = section.id === 'inicio';
        
        gsap.set(section, {
            minHeight: '100vh',
            position: 'relative',
            display: 'flex',
            alignItems: isMobile ? 'flex-start' : 'center', // En móviles, alinear arriba
            justifyContent: 'center',
            paddingTop: isMobile ? '120px' : '0', // Padding superior en móviles aumentado
            overflowY: (isMobile && isInicioSection) ? 'auto' : 'hidden' // Scroll solo en inicio móvil
        });
        
        // Agregar indicador de sección
        section.setAttribute('data-section', index);
    });
}

// Configurar scroll completo por páginas
function setupFullPageScroll() {
    // Desactivar el scroll normal del navegador
    document.body.style.overflow = 'hidden';
    
    // Crear contenedor para las secciones
    const container = document.createElement('div');
    container.id = 'sections-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        will-change: transform;
    `;
    
    // Mover todas las secciones al contenedor
    const sectionsWrapper = document.createElement('div');
    sectionsWrapper.style.cssText = `
        height: ${sections.length * 100}vh;
        width: 100%;
    `;
    
    sections.forEach(section => {
        sectionsWrapper.appendChild(section);
    });
    
    container.appendChild(sectionsWrapper);
    document.body.appendChild(container);
    
    // Configurar eventos de scroll
    setupScrollEvents();
    
    // Crear indicadores de navegación
    createSectionIndicators();
}

// Configurar eventos de scroll
function setupScrollEvents() {
    let scrollTimeout;
    
    // Eventos de rueda del mouse
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const direction = e.deltaY > 0 ? 1 : -1;
            navigateToSection(currentSection + direction);
        }, 50);
    }, { passive: false });
    
    // Eventos de teclado
    document.addEventListener('keydown', (e) => {
        if (isScrolling) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'PageDown':
                e.preventDefault();
                navigateToSection(currentSection + 1);
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                navigateToSection(currentSection - 1);
                break;
            case 'Home':
                e.preventDefault();
                navigateToSection(0);
                break;
            case 'End':
                e.preventDefault();
                navigateToSection(sections.length - 1);
                break;
        }
    });
    
    // Eventos táctiles para móviles
    let startY = 0;
    let startTime = 0;
    
    document.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
        startTime = Date.now();
    });
    
    document.addEventListener('touchmove', (e) => {
        // Solo prevenir scroll si no estamos en un elemento scrolleable
        const target = e.target.closest('.overflow-y-auto');
        if (!target) {
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
        if (isScrolling) return;
        
        const endY = e.changedTouches[0].clientY;
        const diff = startY - endY;
        const timeDiff = Date.now() - startTime;
        
        // Requiere un swipe más rápido y con más distancia en móviles
        if (Math.abs(diff) > 80 && timeDiff < 500) {
            const direction = diff > 0 ? 1 : -1;
            navigateToSection(currentSection + direction);
        }
    });
}

// Navegar a una sección específica
function navigateToSection(index) {
    if (index < 0 || index >= sections.length || isScrolling) return;
    
    isScrolling = true;
    const previousSection = currentSection;
    currentSection = index;
    
    // Actualizar indicadores
    updateSectionIndicators();
    updateActiveNav(sections[currentSection].id);
    
    // Animación de transición
    const container = document.getElementById('sections-container');
    const targetY = -index * window.innerHeight;
    
    // Animación de salida de la sección anterior
    if (sections[previousSection]) {
        animateSectionOut(sections[previousSection]);
    }
    
    gsap.to(container, {
        y: targetY,
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
            // Restaurar opacidad completa de la sección actual
            gsap.set(sections[currentSection], { opacity: 1 });
            
            isScrolling = false;
            // Trigger animaciones específicas de la sección
            triggerSectionAnimations(currentSection);
        }
    });
    
}

// Crear indicadores de navegación
function createSectionIndicators() {
    const indicators = document.createElement('div');
    indicators.id = 'section-indicators';
    indicators.style.cssText = `
        position: fixed;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    
    sections.forEach((section, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'section-indicator';
        indicator.setAttribute('data-index', index);
        indicator.title = section.id.charAt(0).toUpperCase() + section.id.slice(1);
        indicator.style.cssText = `
            width: 12px;
            height: 12px;
            border: 2px solid #00ff41;
            border-radius: 50%;
            background: transparent;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        // Evento click para navegar
        indicator.addEventListener('click', () => {
            navigateToSection(index);
        });
        
        indicators.appendChild(indicator);
    });
    
    document.body.appendChild(indicators);
    
    // Actualizar el indicador inicial
    updateSectionIndicators();
}

// Actualizar indicadores de sección
function updateSectionIndicators() {
    const indicators = document.querySelectorAll('.section-indicator');
    indicators.forEach((indicator, index) => {
        if (index === currentSection) {
            indicator.style.background = '#00ff41';
            indicator.style.transform = 'scale(1.2)';
        } else {
            indicator.style.background = 'transparent';
            indicator.style.transform = 'scale(1)';
        }
    });
}

// Animaciones de entrada de sección
function animateSectionIn(section) {
    // No hacer animaciones genéricas que interfieran con las específicas
    // Solo preparar elementos que no tienen animaciones específicas
    const genericElements = section.querySelectorAll('.fade-in-left:not(.specific-animated), .fade-in-right:not(.specific-animated)');
    
    if (genericElements.length > 0) {
        gsap.fromTo(genericElements, 
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                delay: 0.3
            }
        );
    }
}

// Animaciones de salida de sección
function animateSectionOut(section) {
    // Animación muy sutil de salida, solo reducir opacidad ligeramente
    gsap.to(section, {
        opacity: 0.7,
        duration: 0.2,
        ease: "power1.in"
    });
}

// Trigger animaciones específicas por sección
function triggerSectionAnimations(sectionIndex) {
    const section = sections[sectionIndex];
    
    // Solo ejecutar animaciones específicas sin resetear nada
    setTimeout(() => {
        switch(section.id) {
            case 'inicio':
                if (sectionIndex === 0) animateHeroSection();
                break;
            case 'about':
                animateAboutSection();
                break;
            case 'projects':
                animateProjectsSection();
                break;
            case 'contact':
                animateContactSection();
                break;
        }
    }, 100);
}

// Función principal de inicialización
function initializeAnimations() {
    // Animación inicial del logo y navegación
    gsap.fromTo("#logo", 
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    );

    gsap.fromTo("#nav-links", 
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power2.out" }
    );

    // Esperar a que el sistema de páginas esté listo antes de animar el hero
    setTimeout(() => {
        if (currentSection === 0) {
            animateHeroSection();
        }
    }, 500);
}

// Animaciones del hero section
function animateHeroSection() {
    const heroTl = gsap.timeline();

    // Animación del nombre principal con efecto de aparición
    heroTl.fromTo("#hero-name", 
        { opacity: 0, scale: 0.8, rotationY: 90 },
        { opacity: 1, scale: 1, rotationY: 0, duration: 1.5, ease: "power3.out" }
    );

    // Animaciones secuenciales de los comandos de terminal
    heroTl.fromTo("#whoami", 
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 
        "-=0.5"
    );

    heroTl.fromTo("#role", 
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 
        "-=0.3"
    );

    heroTl.fromTo("#cat-about", 
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 
        "-=0.3"
    );

    heroTl.fromTo("#about-content", 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, ease: "power2.out" }, 
        "-=0.3"
    );

    heroTl.fromTo("#ls-skills", 
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }, 
        "-=0.5"
    );

    heroTl.fromTo("#skills-content", 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, ease: "power2.out" }, 
        "-=0.3"
    );

    // Animación de la imagen de perfil con efecto 3D
    heroTl.fromTo("#profile-container", 
        { opacity: 0, scale: 0.5, rotationY: 180 },
        { opacity: 1, scale: 1, rotationY: 0, duration: 1.5, ease: "back.out(1.7)" }, 
        "-=1"
    );

    // Animación de los enlaces sociales
    heroTl.fromTo("#social-links", 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 
        "-=0.5"
    );
}

// Animaciones específicas para About Section
function animateAboutSection() {
    const aboutTl = gsap.timeline();
    
    // Solo animar si el elemento está oculto
    const sectionTitle = document.querySelector("#about .section-title");
    if (sectionTitle && gsap.getProperty(sectionTitle, "opacity") == 0) {
        aboutTl.to("#about .section-title", 
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
    }
    
    const leftElements = document.querySelectorAll("#about .fade-in-left");
    leftElements.forEach(el => el.classList.add('specific-animated'));
    
    const rightElements = document.querySelectorAll("#about .fade-in-right");
    rightElements.forEach(el => el.classList.add('specific-animated'));
    
    aboutTl.to("#about .fade-in-left", 
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 
        "-=0.4"
    );
    
    aboutTl.to("#about .fade-in-right", 
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 
        "-=0.5"
    );
}

// Animaciones específicas para Projects Section
function animateProjectsSection() {
    const projectsTl = gsap.timeline();
    
    // Solo animar si el elemento está oculto
    const sectionTitle = document.querySelector("#projects .section-title");
    if (sectionTitle && gsap.getProperty(sectionTitle, "opacity") == 0) {
        projectsTl.to("#projects .section-title", 
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
    }
    
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => card.classList.add('specific-animated'));
    
    // Solo animar tarjetas que están ocultas
    const hiddenCards = Array.from(projectCards).filter(card => 
        gsap.getProperty(card, "opacity") == 0
    );
    
    if (hiddenCards.length > 0) {
        projectsTl.to(hiddenCards, 
            { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                duration: 0.6,
                ease: "power2.out",
                stagger: 0.15
            }, 
            "-=0.4"
        );
    }
}

// Animaciones específicas para Contact Section
function animateContactSection() {
    const contactTl = gsap.timeline();
    
    // Solo animar si el elemento está oculto
    const sectionTitle = document.querySelector("#contact .section-title");
    if (sectionTitle && gsap.getProperty(sectionTitle, "opacity") == 0) {
        contactTl.to("#contact .section-title", 
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
        );
    }
    
    const leftElements = document.querySelectorAll("#contact .fade-in-left");
    leftElements.forEach(el => el.classList.add('specific-animated'));
    
    const rightElements = document.querySelectorAll("#contact .fade-in-right");
    rightElements.forEach(el => el.classList.add('specific-animated'));
    
    contactTl.to("#contact .fade-in-left", 
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 
        "-=0.4"
    );
    
    contactTl.to("#contact .fade-in-right", 
        { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 
        "-=0.5"
    );
}

// Animaciones basadas en scroll (simplificadas para el sistema de páginas)
function setupScrollAnimations() {
    // Solo configurar elementos específicos como invisibles, no todos
    gsap.set('#about .section-title, #projects .section-title, #contact .section-title', { 
        opacity: 0 
    });
    
    gsap.set('.fade-in-left, .fade-in-right', { 
        opacity: 0 
    });
    
    gsap.set('.project-card', { 
        opacity: 0,
        y: 30
    });
    
}

// Navegación suave y activa
function setupNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    // Navegación suave personalizada con sistema de páginas
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetIndex = sections.findIndex(section => section.id === targetId);
            
            if (targetIndex !== -1) {
                navigateToSection(targetIndex);
            }
        });
    });

    // Inicializar navegación activa
    updateActiveNav(sections[0].id);
}

// Actualizar el enlace de navegación activo
function updateActiveNav(activeId) {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === activeId) {
            link.classList.remove('text-gray-400');
            link.classList.add('text-terminal-green');
        } else {
            link.classList.remove('text-terminal-green');
            link.classList.add('text-gray-400');
        }
    });
}

// Efectos de escritura (typing)
function setupTypingEffects() {
    // Efecto de escritura para comandos de terminal
    const terminalCommands = document.querySelectorAll('[id$="-command"]');
    
    terminalCommands.forEach(command => {
        const text = command.textContent;
        command.textContent = '';
        
        ScrollTrigger.create({
            trigger: command,
            start: "top 80%",
            onEnter: () => typeWriter(command, text, 50)
        });
    });
}

// Función para efecto de escritura
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Elementos interactivos
function setupInteractiveElements() {
    // Efecto hover para las tarjetas de proyecto
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                scale: 1.05,
                rotationY: 5,
                z: 50,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                scale: 1,
                rotationY: 0,
                z: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Efecto de brillo en enlaces
    const glowLinks = document.querySelectorAll('a, button');
    
    glowLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            gsap.to(this, {
                textShadow: "0 0 10px #00ff41, 0 0 20px #00ff41",
                duration: 0.3
            });
        });
        
        link.addEventListener('mouseleave', function() {
            gsap.to(this, {
                textShadow: "none",
                duration: 0.3
            });
        });
    });

    // Animación de formulario
    const formInputs = document.querySelectorAll('input, textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            gsap.to(this, {
                scale: 1.02,
                borderColor: "#00ff41",
                boxShadow: "0 0 15px rgba(0, 255, 65, 0.3)",
                duration: 0.3
            });
        });
        
        input.addEventListener('blur', function() {
            gsap.to(this, {
                scale: 1,
                borderColor: "#374151",
                boxShadow: "none",
                duration: 0.3
            });
        });
    });
}

// Efecto Matrix de fondo
function createMatrixEffect() {
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'matrix-bg';
    document.body.appendChild(matrixContainer);

    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    
    function createMatrixChar() {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = characters[Math.floor(Math.random() * characters.length)];
        char.style.left = Math.random() * window.innerWidth + 'px';
        char.style.animationDuration = (Math.random() * 3 + 2) + 's';
        char.style.fontSize = (Math.random() * 10 + 10) + 'px';
        char.style.opacity = Math.random() * 0.7 + 0.3;
        
        matrixContainer.appendChild(char);
        
        // Remover el carácter después de la animación
        setTimeout(() => {
            if (char.parentNode) {
                char.parentNode.removeChild(char);
            }
        }, 5000);
    }

    // Crear caracteres matrix periódicamente
    matrixInterval = setInterval(createMatrixChar, 100);
}

// Configurar formulario de contacto
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading-message');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar mensaje de carga
        formStatus.classList.remove('hidden');
        successMessage.classList.add('hidden');
        errorMessage.classList.add('hidden');
        loadingMessage.classList.remove('hidden');
        
        // Deshabilitar botón
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        try {
            // Obtener datos del formulario
            const formData = new FormData(form);
            
            // Enviar a Netlify
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });
            
            if (response.ok) {
                // Éxito
                loadingMessage.classList.add('hidden');
                successMessage.classList.remove('hidden');
                form.reset();
                
                // Animación de éxito
                gsap.fromTo(successMessage, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                );
                
                // Ocultar mensaje después de 5 segundos
                setTimeout(() => {
                    gsap.to(formStatus, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            formStatus.classList.add('hidden');
                            gsap.set(formStatus, { opacity: 1 });
                        }
                    });
                }, 5000);
                
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
            
        } catch (error) {
            // Error
            console.error('Error:', error);
            loadingMessage.classList.add('hidden');
            errorMessage.classList.remove('hidden');
            
            // Animación de error
            gsap.fromTo(errorMessage, 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
            );
            
            // Ocultar mensaje después de 5 segundos
            setTimeout(() => {
                gsap.to(formStatus, {
                    opacity: 0,
                    duration: 0.3,
                    onComplete: () => {
                        formStatus.classList.add('hidden');
                        gsap.set(formStatus, { opacity: 1 });
                    }
                });
            }, 5000);
        }
        
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar Mensaje';
    });
}

// Limpiar animaciones al cerrar
window.addEventListener('beforeunload', function() {
    if (matrixInterval) {
        clearInterval(matrixInterval);
    }
    // Restaurar overflow del body
    document.body.style.overflow = '';
    ScrollTrigger.killAll();
});

// Responsive: actualizar sistema de páginas en resize
window.addEventListener('resize', function() {
    // Actualizar posición del contenedor al redimensionar
    const container = document.getElementById('sections-container');
    if (container) {
        const targetY = -currentSection * window.innerHeight;
        gsap.set(container, { y: targetY });
    }
    
    // Actualizar altura y alineación de secciones
    sections.forEach(section => {
        const isMobile = window.innerWidth <= 768;
        const isInicioSection = section.id === 'inicio';
        
        gsap.set(section, { 
            minHeight: '100vh',
            alignItems: isMobile ? 'flex-start' : 'center',
            paddingTop: isMobile ? '120px' : '0',
            overflowY: (isMobile && isInicioSection) ? 'auto' : 'hidden' // Scroll solo en inicio móvil
        });
    });
    
    // Actualizar posición de indicadores en móviles
    const indicators = document.getElementById('section-indicators');
    if (indicators) {
        if (window.innerWidth <= 768) {
            indicators.style.right = '10px';
            indicators.style.transform = 'translateY(-50%) scale(0.8)';
        } else {
            indicators.style.right = '20px';
            indicators.style.transform = 'translateY(-50%) scale(1)';
        }
    }
    
    ScrollTrigger.refresh();
});

// Mostrar instrucciones de navegación
function showNavigationInstructions() {
    const instructions = document.createElement('div');
    instructions.id = 'navigation-instructions';
    
    // Diferentes instrucciones para móvil y desktop
    const isMobile = window.innerWidth <= 768;
    const instructionText = isMobile 
        ? '👆 Desliza • 📍 Puntos laterales'
        : '🖱️ Scroll • ⌨️ ↑↓ • 📍 Puntos laterales';
    
    instructions.style.cssText = `
        position: fixed;
        bottom: ${isMobile ? '10px' : '20px'};
        left: 50%;
        transform: translateX(-50%);
        background: rgba(13, 17, 23, 0.9);
        border: 1px solid #00ff41;
        border-radius: 8px;
        padding: ${isMobile ? '8px 16px' : '10px 20px'};
        color: #00ff41;
        font-size: ${isMobile ? '11px' : '12px'};
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    instructions.innerHTML = `
        <div class="text-center">
            <div>${instructionText}</div>
            <div class="text-xs mt-1 text-gray-400">Navega entre secciones</div>
        </div>
    `;
    
    document.body.appendChild(instructions);
    
    // Mostrar instrucciones con animación
    setTimeout(() => {
        instructions.style.opacity = '1';
    }, 2000);
    
    // Ocultar después de más tiempo en móviles
    const hideTimeout = isMobile ? 10000 : 7000;
    setTimeout(() => {
        instructions.style.opacity = '0';
        setTimeout(() => {
            if (instructions.parentNode) {
                document.body.removeChild(instructions);
            }
        }, 300);
    }, hideTimeout);
}

// Inicializar cursor parpadeante
function initializeCursor() {
    const cursorElements = document.querySelectorAll('.terminal-cursor');
    
    cursorElements.forEach(element => {
        setInterval(() => {
            element.style.opacity = element.style.opacity === '0' ? '1' : '0';
        }, 530);
    });
}

// Efecto de glitch aleatorio en el nombre
function randomGlitch() {
    const heroName = document.getElementById('hero-name');
    if (heroName) {
        heroName.classList.add('glitch');
        heroName.setAttribute('data-text', heroName.textContent);
        
        setTimeout(() => {
            heroName.classList.remove('glitch');
        }, 500);
    }
}

// Aplicar glitch aleatorio cada 10-15 segundos
setInterval(randomGlitch, Math.random() * 5000 + 10000);

// Menú móvil
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidemenu = document.getElementById('mobile-sidemenu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    let isMenuOpen = false;

    // Función para abrir el menú
    function openMenu() {
        isMenuOpen = true;
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        
        // Mostrar overlay
        mobileOverlay.classList.remove('hidden');
        mobileOverlay.classList.add('show');
        
        // Mostrar sidemenu
        mobileSidemenu.classList.add('open');
        
        // Cambiar iconos
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
        
        // Animar enlaces del menú
        gsap.fromTo(mobileMenuLinks, 
            { opacity: 0, x: 50 },
            { 
                opacity: 1, 
                x: 0, 
                duration: 0.3,
                stagger: 0.1,
                delay: 0.2,
                ease: "power2.out"
            }
        );
    }
    
    // Función para cerrar el menú
    function closeMenu() {
        isMenuOpen = false;
        document.body.style.overflow = ''; // Restaurar scroll
        
        // Ocultar sidemenu
        mobileSidemenu.classList.remove('open');
        
        // Ocultar overlay
        setTimeout(() => {
            mobileOverlay.classList.remove('show');
            mobileOverlay.classList.add('hidden');
        }, 300);
        
        // Cambiar iconos
        closeIcon.classList.add('hidden');
        menuIcon.classList.remove('hidden');
    }

    if (mobileMenuBtn) {
        // Toggle menú al hacer clic en el botón
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (isMenuOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Cerrar menú al hacer clic en el overlay
        mobileOverlay.addEventListener('click', closeMenu);
        
        // Cerrar menú al hacer clic en un enlace
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetIndex = sections.findIndex(section => section.id === targetId);
                
                // Cerrar menú primero
                closeMenu();
                
                // Navegar después de un pequeño delay
                setTimeout(() => {
                    if (targetIndex !== -1) {
                        navigateToSection(targetIndex);
                    }
                }, 300);
            });
        });
        
        // Cerrar menú con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMenuOpen) {
                closeMenu();
            }
        });
        
        // Prevenir que el clic en el sidemenu lo cierre
        mobileSidemenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
});

// Preloader opcional
function showPreloader() {
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.className = 'fixed inset-0 z-[9999] flex items-center justify-center bg-terminal-bg';
    preloader.innerHTML = `
        <div class="text-center">
            <div class="text-terminal-green text-2xl mb-4">
                <span class="text-terminal-green">$ </span>
                <span class="text-yellow-400">loading portfolio</span>
                <span class="loading-dots"></span>
            </div>
            <div class="w-64 h-2 bg-terminal-gray rounded-full overflow-hidden">
                <div class="h-full bg-terminal-green rounded-full animate-pulse" style="width: 0%" id="loading-bar"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(preloader);
    
    // Animar barra de carga
    gsap.to('#loading-bar', {
        width: '100%',
        duration: 2,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.to('#preloader', {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    document.body.removeChild(preloader);
                }
            });
        }
    });
}

// Mostrar preloader si es necesario
 showPreloader();

// ========================
// SISTEMA DE AUDIO
// ========================

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.isEnabled = true;
        this.volume = 0.3;
        this.init();
    }

    // Inicializar el contexto de audio
    async init() {
        try {
            // Crear contexto de audio
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Crear sonidos sintéticos
            this.createSyntheticSounds();
            
            // Configurar eventos
            this.setupAudioEvents();
        } catch (error) {
            this.fallbackToHTML5Audio();
        }
    }

    // Crear sonidos sintéticos con Web Audio API
    createSyntheticSounds() {
        // Sonido de click - Beep corto
        this.sounds.click = this.createBeepSound(800, 0.1, 'square');
        
        // Sonido de hover - Beep suave
        this.sounds.hover = this.createBeepSound(600, 0.05, 'sine');
        
        // Sonido de typing - Multiple beeps
        this.sounds.typing = this.createTypingSound();
        
        // Sonido de error - Beep grave
        this.sounds.error = this.createBeepSound(200, 0.3, 'sawtooth');
        
        // Sonido de success - Beep ascendente
        this.sounds.success = this.createSuccessSound();
    }

    // Crear sonido beep básico
    createBeepSound(frequency, duration, waveType = 'sine') {
        return () => {
            if (!this.audioContext || !this.isEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = waveType;

            // Envelope para suavizar el sonido
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    // Crear sonido de typing (múltiples beeps)
    createTypingSound() {
        return () => {
            if (!this.audioContext || !this.isEnabled) return;

            const frequencies = [400, 450, 380, 420];
            const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.setValueAtTime(randomFreq, this.audioContext.currentTime);
            oscillator.type = 'square';

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.5, this.audioContext.currentTime + 0.005);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.08);
        };
    }

    // Crear sonido de éxito (ascendente)
    createSuccessSound() {
        return () => {
            if (!this.audioContext || !this.isEnabled) return;

            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            // Frecuencia ascendente
            oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.3);
        };
    }

    // Fallback a HTML5 Audio si Web Audio API no está disponible
    fallbackToHTML5Audio() {
        
        // Crear elementos de audio dinámicamente
        this.sounds.click = () => this.playHTML5Sound(this.createHTML5Beep());
        this.sounds.hover = () => this.playHTML5Sound(this.createHTML5Beep(0.1));
        this.sounds.typing = () => this.playHTML5Sound(this.createHTML5Beep(0.05));
        this.sounds.error = () => this.playHTML5Sound(this.createHTML5Beep(0.2));
        this.sounds.success = () => this.playHTML5Sound(this.createHTML5Beep(0.15));
    }

    // Crear beep con HTML5 Audio
    createHTML5Beep(volume = 0.3) {
        const audio = new Audio();
        audio.volume = volume;
        // Usar data URL con sonido sintético básico
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmMcBjiQVFxgpq2S1Qk0j9fyw2kgCD5+zfNZJ0QtY7nm2YE6CZBm0fTAeiYFlmiy6eOOOAbMaLD2xHUaBz13w/DNbSUF';
        return audio;
    }

    // Reproducir sonido HTML5
    playHTML5Sound(audio) {
        if (!this.isEnabled) return;
        audio.currentTime = 0;
        audio.play().catch(e => console.warn('Error playing sound:', e));
    }

    // Configurar eventos de audio en elementos
    setupAudioEvents() {
        // Elementos que reproducen sonido al hacer click
        const clickableElements = [
            'a', 'button', '.project-card', '#logo', 
            'input', 'textarea', '.terminal-command'
        ];

        // Cargar el archivo de sonido
        const clickSound = new Audio('computer-mouse-click.mp3');

        clickableElements.forEach(selector => {
            document.addEventListener('click', (e) => {
                if (e.target.matches(selector) || e.target.closest(selector)) {
                    clickSound.currentTime = 0; // Reiniciar el sonido
                    clickSound.play();
                }
            });
        });

        // Elementos que reproducen sonido al hacer hover
        const hoverElements = ['a', 'button', '.project-card'];
        hoverElements.forEach(selector => {
            document.addEventListener('mouseenter', (e) => {
               if (e.target.nodeType === 1 && e.target.matches(selector)) {
                    this.play('hover');
                }
            }, true);
        });

        // Sonido de typing en inputs
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[type="text"], input[type="email"], textarea')) {
                this.play('typing');
            }
        });

        // Sonido al enviar formulario
        document.addEventListener('submit', (e) => {
            e.preventDefault();
            this.play('success');
            setTimeout(() => {
                alert('¡Mensaje enviado correctamente! 🚀');
            }, 300);
        });

        // Activar contexto de audio en primera interacción del usuario
        document.addEventListener('click', () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        }, { once: true });
    }

    // Reproducir sonido
    play(soundName) {
        if (this.sounds[soundName] && this.isEnabled) {
            try {
                this.sounds[soundName]();
            } catch (error) {
                console.warn('Error playing sound:', error);
            }
        }
    }

    // Toggle audio on/off
    toggle() {
        this.isEnabled = !this.isEnabled;
        return this.isEnabled;
    }

    // Cambiar volumen
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    // Reproducir sonido personalizado
    playCustom(frequency, duration, waveType = 'sine') {
        if (!this.audioContext || !this.isEnabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = waveType;

        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
}

// Inicializar el sistema de audio
const audioManager = new AudioManager();

// Hacer disponible globalmente para debugging
window.audioManager = audioManager;

// Control de audio con teclado (opcional)
document.addEventListener('keydown', (e) => {
    // Presionar 'M' para mutear/desmutear
    if (e.key.toLowerCase() === 'm' && e.ctrlKey) {
        e.preventDefault();
        const isEnabled = audioManager.toggle();
        
        // Mostrar notificación visual
        showNotification(isEnabled ? '🔊 Audio activado' : '🔇 Audio desactivado');
    }
});

// Función para mostrar notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-terminal-gray border border-terminal-green text-terminal-green px-4 py-2 rounded-lg z-50 opacity-0';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    gsap.to(notification, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
    });
    
    setTimeout(() => {
        gsap.to(notification, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 2000);
}

// Configurar botón de control de audio en la interfaz
document.addEventListener('DOMContentLoaded', function() {
    // Detectar si es móvil o desktop
    const isMobile = window.innerWidth <= 768;
    const mobileContainer = document.getElementById('mobile-icons-container');
    const desktopContainer = document.getElementById('desktop-icons-container');
    const navLinks = document.getElementById('nav-links');
    
    // Crear el botón de audio
    const audioButton = document.createElement('button');
    audioButton.id = 'audio-toggle';
    audioButton.className = 'text-terminal-green hover:text-white transition-colors duration-300';
    audioButton.innerHTML = '🔊';
    audioButton.title = 'Toggle Audio (Ctrl+M)';
    
    audioButton.addEventListener('click', () => {
        const isEnabled = audioManager.toggle();
        audioButton.innerHTML = isEnabled ? '🔊' : '🔇';
        showNotification(isEnabled ? 'Audio activado' : 'Audio desactivado');
    });
    
    // Insertar en el contenedor apropiado
    if (isMobile && mobileContainer) {
        // En móvil: insertar antes del botón hamburguesa
        const hamburgerBtn = document.getElementById('mobile-menu-btn');
        mobileContainer.insertBefore(audioButton, hamburgerBtn);
    } else if (!isMobile && desktopContainer) {
        // En desktop: insertar en el contenedor desktop
        desktopContainer.appendChild(audioButton);
    } else if (navLinks) {
        // Fallback: insertar después del nav-links
        navLinks.parentNode.appendChild(audioButton);
    }
    
    // Ajustar en resize
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        const currentParent = audioButton.parentNode;
        
        if (newIsMobile && currentParent !== mobileContainer) {
            // Mover a móvil
            if (mobileContainer) {
                const hamburgerBtn = document.getElementById('mobile-menu-btn');
                mobileContainer.insertBefore(audioButton, hamburgerBtn);
            }
        } else if (!newIsMobile && currentParent !== desktopContainer) {
            // Mover a desktop
            if (desktopContainer) {
                desktopContainer.appendChild(audioButton);
            }
        }
    });
});
