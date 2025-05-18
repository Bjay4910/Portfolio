// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            // Update active navigation link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Sticky Header
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }
    
    // Update active navigation link based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop - 100) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// Fade-in Animation for Elements
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

fadeElements.forEach(element => {
    fadeInObserver.observe(element);
});

// Skills Category Filter
const skillsCategories = document.querySelectorAll('.skills-category');
const skillItems = document.querySelectorAll('.skill-item');

skillsCategories.forEach(category => {
    category.addEventListener('click', () => {
        // Update active category
        skillsCategories.forEach(cat => {
            cat.classList.remove('active');
        });
        category.classList.add('active');
        
        // Filter skill items
        const categoryValue = category.getAttribute('data-category');
        
        skillItems.forEach(item => {
            if (categoryValue === 'all' || item.getAttribute('data-type') === categoryValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Form Submission Handler
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // In a real implementation, you would handle form submission here
    alert('Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// 3D Hero Background with Three.js
function initThreeBackground() {
    const container = document.getElementById('hero-background');
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    
    // Add particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x4f46e5,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 2;
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    window.addEventListener('mousemove', onMouseMove, false);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        particlesMesh.rotation.x += 0.0005;
        particlesMesh.rotation.y += 0.0005;
        
        // Follow mouse with subtle movement
        particlesMesh.rotation.x += mouseY * 0.0005;
        particlesMesh.rotation.y += mouseX * 0.0005;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Background is handled by CSS, no need for ThreeJS
// if (typeof THREE !== 'undefined') {
//     initThreeBackground();
// }

// Count Up Animation for Stats
const observeCountUp = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const countUpElements = entry.target.querySelectorAll('.count-up');
                
                countUpElements.forEach(element => {
                    const value = parseFloat(element.textContent);
                    let startValue = 0;
                    const duration = 2000;
                    const step = timestamp => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        const currentValue = progress * value;
                        element.textContent = value % 1 === 0 ? Math.floor(currentValue) : currentValue.toFixed(1);
                        if (progress < 1) {
                            window.requestAnimationFrame(step);
                        }
                    };
                    let startTime = null;
                    window.requestAnimationFrame(step);
                });
                
                observeCountUp.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.5 }
);

document.querySelectorAll('.stats').forEach(stat => {
    observeCountUp.observe(stat);
});

// Enhanced Framer Motion Animations with interactive components
function initFramerMotion() {
    if (typeof motion === 'undefined') return;
    
    // Advanced parallax effect on scroll with depth
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('.hero-text, .hero-image, .about-img-container, .profile-img-backdrop, .floating-shape');
        
        parallaxElements.forEach(element => {
            let speed = 0.2;
            let rotateEffect = false;
            let scaleEffect = false;
            
            // Different effects for different elements
            if (element.classList.contains('hero-text')) {
                speed = 0.35;
            } else if (element.classList.contains('hero-image')) {
                speed = 0.2;
                rotateEffect = true;
            } else if (element.classList.contains('about-img-container')) {
                speed = 0.25;
                scaleEffect = true;
            } else if (element.classList.contains('profile-img-backdrop')) {
                speed = 0.4;
            } else if (element.classList.contains('floating-shape')) {
                speed = 0.15;
                rotateEffect = true;
            }
            
            // Apply transform
            let transform = `translateY(${scrollY * speed}px)`;
            
            if (rotateEffect) {
                const rotate = scrollY * 0.02;
                transform += ` rotate(${rotate}deg)`;
            }
            
            if (scaleEffect) {
                const scale = 1 + (scrollY * 0.0005);
                transform += ` scale(${Math.min(scale, 1.1)})`;
            }
            
            element.style.transform = transform;
        });
    });
    
    // Enhanced hover animations for buttons with 3D effect
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mouseenter', () => {
            motion.animate(button, {
                scale: 1.05,
                y: -5,
                boxShadow: '0 15px 25px rgba(0, 0, 0, 0.2)',
                transition: { 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 10 
                }
            });
        });
        
        button.addEventListener('mouseleave', () => {
            motion.animate(button, {
                scale: 1,
                y: 0,
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                transition: { 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 15 
                }
            });
        });
        
        // Add click animation
        button.addEventListener('mousedown', () => {
            motion.animate(button, {
                scale: 0.95,
                boxShadow: '0 5px 10px rgba(0, 0, 0, 0.15)',
                transition: { duration: 0.1 }
            });
        });
        
        button.addEventListener('mouseup', () => {
            motion.animate(button, {
                scale: 1.05,
                boxShadow: '0 15px 25px rgba(0, 0, 0, 0.2)',
                transition: { 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 10 
                }
            });
        });
    });
    
    // Add interactive card hover effects to all card elements
    const cardElements = document.querySelectorAll('.skill-item, .project-card, .education-card, .experience-card, .award-card, .contact-card, .form-card');
    
    cardElements.forEach(card => {
        card.addEventListener('mouseenter', () => {
            motion.animate(card, {
                y: -10,
                rotateX: 5,
                rotateY: 5,
                scale: 1.02,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                transition: { 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 15 
                }
            });
            
            // Animate card contents
            const title = card.querySelector('h3') || card.querySelector('h4');
            if (title) {
                motion.animate(title, {
                    y: -3,
                    color: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
                    transition: { duration: 0.3 }
                });
            }
        });
        
        card.addEventListener('mouseleave', () => {
            motion.animate(card, {
                y: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                transition: { 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 15 
                }
            });
            
            // Reset card contents
            const title = card.querySelector('h3') || card.querySelector('h4');
            if (title) {
                motion.animate(title, {
                    y: 0,
                    color: '',
                    transition: { duration: 0.3 }
                });
            }
        });
        
        // Add perspective effect on mousemove
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            motion.animate(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transition: { duration: 0.1 }
            });
        });
    });
    
    // Enhanced section entrance animations
    const sections = document.querySelectorAll('section');
    
    const observeSections = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate section title
                    const title = entry.target.querySelector('.section-title');
                    if (title) {
                        motion.animate(title, {
                            opacity: [0, 1],
                            x: [-30, 0],
                            transition: { duration: 0.8, ease: 'easeOut' }
                        });
                    }
                    
                    // Staggered animation for all items inside section
                    const items = entry.target.querySelectorAll('.fade-in');
                    items.forEach((item, index) => {
                        motion.animate(item, {
                            opacity: [0, 1],
                            y: [30, 0],
                            scale: [0.95, 1],
                            transition: { 
                                duration: 0.6, 
                                delay: 0.1 + (index * 0.1),
                                ease: 'easeOut' 
                            }
                        });
                    });
                    
                    observeSections.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );
    
    sections.forEach(section => {
        observeSections.observe(section);
    });
    
    // Add interactive effects to navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            motion.animate(link, {
                y: -3,
                scale: 1.05,
                color: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
                transition: { duration: 0.2 }
            });
        });
        
        link.addEventListener('mouseleave', () => {
            // Don't reset active link color
            if (!link.classList.contains('active')) {
                motion.animate(link, {
                    y: 0,
                    scale: 1,
                    color: '',
                    transition: { duration: 0.2 }
                });
            } else {
                motion.animate(link, {
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.2 }
                });
            }
        });
    });
    
    // Add scroll animations for contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const formFields = contactForm.querySelectorAll('.form-control');
        
        formFields.forEach((field, index) => {
            field.addEventListener('focus', () => {
                motion.animate(field, {
                    scale: 1.02,
                    y: -5,
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--primary'),
                    boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.2)',
                    transition: { duration: 0.3 }
                });
            });
            
            field.addEventListener('blur', () => {
                motion.animate(field, {
                    scale: 1,
                    y: 0,
                    borderColor: field.value ? getComputedStyle(document.documentElement).getPropertyValue('--primary') : '',
                    boxShadow: '0 0 0 0px rgba(79, 70, 229, 0)',
                    transition: { duration: 0.3 }
                });
            });
        });
    }
    
    // Add animations to social icons
    const socialIcons = document.querySelectorAll('.social-icon');
    
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            motion.animate(icon, {
                y: -8,
                scale: 1.2,
                rotate: 5,
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                transition: { 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 10 
                }
            });
        });
        
        icon.addEventListener('mouseleave', () => {
            motion.animate(icon, {
                y: 0,
                scale: 1,
                rotate: 0,
                boxShadow: 'none',
                transition: { 
                    type: 'spring', 
                    stiffness: 400, 
                    damping: 15 
                }
            });
        });
        
        // Add click animation
        icon.addEventListener('click', () => {
            motion.animate(icon, {
                scale: [1.2, 0.8, 1.1],
                rotate: [5, -5, 0],
                transition: { 
                    duration: 0.4,
                    times: [0, 0.2, 1] 
                }
            });
        });
    });
}

// Initialize enhanced Framer Motion if script is available
if (typeof motion !== 'undefined') {
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initFramerMotion);
    } else {
        initFramerMotion();
    }
}

// Typwriter Effect
function initTypewriter() {
    const typewriterElement = document.querySelector('.typewriter');
    if (!typewriterElement) return;
    
    const text = typewriterElement.textContent;
    typewriterElement.textContent = '';
    
    let index = 0;
    
    function typeNextCharacter() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeNextCharacter, 100);
        } else {
            typewriterElement.classList.add('typewriter-complete');
        }
    }
    
    setTimeout(typeNextCharacter, 1000);
}

// Initialize typewriter effect
initTypewriter();

// Tech Stack Component with proper logos and 3D rotation effect
function initTechStackComponent() {
    // Tech stack data with icons, colors, and CDN logos
    const techStack = [
        { name: 'Python', icon: 'fab fa-python', color: '#3776AB', logo: '../images/languages/python.png' },
        { name: 'JavaScript', icon: 'fab fa-js-square', color: '#F7DF1E', logo: '../images/languages/javascript.png' },
        { name: 'Java', icon: 'fab fa-java', color: '#007396', logo: '../images/languages/java.png' },
        { name: 'TypeScript', icon: 'fas fa-code', color: '#3178C6', logo: '../images/languages/typescript.png' },
        { name: 'C++', icon: 'fas fa-code', color: '#00599C', logo: '../images/languages/cpp.png' },
        { name: 'Dart', icon: 'fas fa-code', color: '#0175C2', logo: '../images/languages/dart.png' },
        { name: 'R', icon: 'fas fa-chart-line', color: '#276DC3', logo: '../images/languages/r.png' },
        { name: 'React', icon: 'fab fa-react', color: '#61DAFB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'HTML5', icon: 'fab fa-html5', color: '#E34F26', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'CSS3', icon: 'fab fa-css3-alt', color: '#1572B6', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { name: 'Git', icon: 'fab fa-git-alt', color: '#F05032', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'MongoDB', icon: 'fas fa-database', color: '#47A248', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
        { name: 'MySQL', icon: 'fas fa-database', color: '#4479A1', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
        { name: 'Flask', icon: 'fas fa-flask', color: '#000000', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
        { name: 'Docker', icon: 'fab fa-docker', color: '#2496ED', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' }
    ];

    const techStackContainer = document.getElementById('tech-stack-container');
    if (!techStackContainer) return;
    
    // Add 3D revolving background effect
    const techStackSection = document.getElementById('tech-stack');
    if (techStackSection) {
        // Create revolving 3D orbital particles
        const orbitalContainer = document.createElement('div');
        orbitalContainer.className = 'orbital-container';
        techStackSection.appendChild(orbitalContainer);
        
        // Add orbital particles
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'orbital-particle';
            
            // Randomize particle properties
            const size = Math.random() * 15 + 5;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 20 + 20;
            const opacity = Math.random() * 0.4 + 0.1;
            const zIndex = Math.floor(Math.random() * 10) - 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.opacity = opacity;
            particle.style.zIndex = zIndex;
            particle.style.backgroundColor = techStack[i % techStack.length].color;
            particle.style.boxShadow = `0 0 ${size}px rgba(${parseInt(techStack[i % techStack.length].color.slice(1, 3), 16)}, 
                                                       ${parseInt(techStack[i % techStack.length].color.slice(3, 5), 16)}, 
                                                       ${parseInt(techStack[i % techStack.length].color.slice(5, 7), 16)}, 0.5)`;
            
            orbitalContainer.appendChild(particle);
        }
    }

    // Create cards for each tech stack item with animations
    techStack.forEach((tech, index) => {
        const techCard = document.createElement('div');
        techCard.className = 'tech-card';
        techCard.style.borderColor = tech.color;
        
        // Add 3D rotation offset based on index
        const rotateX = Math.sin(index * 0.6) * 5;
        const rotateY = Math.cos(index * 0.6) * 5;
        const translateZ = Math.sin(index * 0.3) * 20;
        
        techCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`;
        techCard.style.animationDelay = `${index * 0.1}s`;

        const logoContainer = document.createElement('div');
        logoContainer.className = 'tech-logo-container';
        
        const logo = document.createElement('img');
        logo.src = tech.logo;
        logo.alt = tech.name;
        logo.className = 'tech-logo';
        logo.style.animation = `float-rotate ${3 + index % 2}s ease-in-out infinite alternate`;
        
        logoContainer.appendChild(logo);
        
        const techName = document.createElement('h4');
        techName.className = 'tech-name';
        techName.textContent = tech.name;
        techName.style.color = tech.color;
        
        techCard.appendChild(logoContainer);
        techCard.appendChild(techName);
        
        techStackContainer.appendChild(techCard);
        
        // Add hover animations if framer-motion is available
        if (typeof motion !== 'undefined') {
            techCard.addEventListener('mouseenter', () => {
                motion.animate(techCard, {
                    y: -10,
                    scale: 1.05,
                    rotateX: 10,
                    rotateY: 10,
                    z: 50,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                    transition: { 
                        type: 'spring', 
                        stiffness: 400, 
                        damping: 10 
                    }
                });
                
                motion.animate(logo, {
                    scale: 1.2,
                    rotate: 10,
                    transition: { 
                        type: 'spring', 
                        stiffness: 300, 
                        damping: 10 
                    }
                });
            });
            
            techCard.addEventListener('mouseleave', () => {
                motion.animate(techCard, {
                    y: 0,
                    scale: 1,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    z: translateZ,
                    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
                    transition: { 
                        type: 'spring', 
                        stiffness: 400, 
                        damping: 15 
                    }
                });
                
                motion.animate(logo, {
                    scale: 1,
                    rotate: 0,
                    transition: { 
                        type: 'spring', 
                        stiffness: 300, 
                        damping: 15 
                    }
                });
            });
            
            // Add mouse movement tracking for 3D effect
            techCard.addEventListener('mousemove', (e) => {
                const rect = techCard.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const moveX = (x - centerX) / 10;
                const moveY = (y - centerY) / 10;
                
                motion.animate(techCard, {
                    rotateX: -moveY,
                    rotateY: moveX,
                    transition: { duration: 0.1 }
                });
            });
        }
    });
}

// Initialize the tech stack component when the page loads
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initTechStackComponent);
} else {
    initTechStackComponent();
}

// Hire Me Blinker Interaction
function initHireMeBlinker() {
    const hireMeBlinker = document.querySelector('.hire-me-blinker');
    
    if (hireMeBlinker) {
        // Toggle between "ACTIVELY RECRUITING" and "HIRE ME" when clicked
        let isRecruiting = true;
        const hireMeText = hireMeBlinker.querySelector('.hire-me-text');
        
        hireMeBlinker.addEventListener('click', () => {
            if (isRecruiting) {
                motion.animate(hireMeText, {
                    opacity: [1, 0, 1],
                    scale: [1, 0.8, 1],
                    transition: { duration: 0.5 }
                }, {
                    onComplete: () => {
                        hireMeText.textContent = 'HIRE ME';
                    }
                });
            } else {
                motion.animate(hireMeText, {
                    opacity: [1, 0, 1],
                    scale: [1, 0.8, 1],
                    transition: { duration: 0.5 }
                }, {
                    onComplete: () => {
                        hireMeText.textContent = 'Hire me';
                    }
                });
            }
            
            // Create burst effect
            motion.animate(hireMeBlinker, {
                scale: [1, 1.2, 1],
                boxShadow: [
                    'var(--hireMeGlow)',
                    '0 0 30px rgba(79, 70, 229, 0.9), 0 0 60px rgba(79, 70, 229, 0.6), 0 0 90px rgba(79, 70, 229, 0.3)',
                    'var(--hireMeGlow)'
                ],
                transition: { duration: 0.8 }
            });
            
            isRecruiting = !isRecruiting;
            
            // Scroll to contact section when "HIRE ME" is displayed
            if (!isRecruiting) {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    setTimeout(() => {
                        window.scrollTo({
                            top: contactSection.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }, 600);
                }
            }
        });
        
        // Add 3D movement based on mouse position
        document.addEventListener('mousemove', (e) => {
            const mouseX = (e.clientX / window.innerWidth) - 0.5;
            const mouseY = (e.clientY / window.innerHeight) - 0.5;
            
            const rotateY = mouseX * 20;
            const rotateX = -mouseY * 20;
            
            motion.animate(hireMeBlinker, {
                rotateY: rotateY,
                rotateX: rotateX,
                transition: { duration: 0.1 }
            });
        });
    }
}

// Initialize the hire me blinker when the page loads
if (typeof motion !== 'undefined') {
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initHireMeBlinker);
    } else {
        initHireMeBlinker();
    }
}

