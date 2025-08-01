document.addEventListener('DOMContentLoaded', function() {

    gsap.registerPlugin(ScrollTrigger);

    // --- PRELOADER ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.classList.remove('no-scroll');
                    // Initialize animations after preloader is gone
                    initAnimations();
                }
            });
        });
        document.body.classList.add('no-scroll');
    } else {
        // Initialize animations immediately if no preloader
        initAnimations();
    }
    
    // --- MASTER ANIMATION FUNCTION ---
    function initAnimations() {
        // 1. Animate Hero Section on load (if it exists)
        if (document.querySelector('.hero')) {
            const tl = gsap.timeline({delay: 0.2});
            tl.from('.hero-headline', { duration: 1.2, y: 50, opacity: 0, ease: 'power3.out' })
              .from('.hero-subheadline', { duration: 1, y: 30, opacity: 0, ease: 'power3.out' }, "-=0.8")
              .from('.hero-buttons', { duration: 1, y: 30, opacity: 0, ease: 'power3.out' }, "-=0.8");
        }

        // 2. Animate all other content as it scrolls into view
        const revealElements = document.querySelectorAll('.anim-reveal');
        revealElements.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 50 }, // from state
                { // to state
                    opacity: 1, 
                    y: 0, 
                    duration: 1, 
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%', // Start animation when element is 85% from the top
                        toggleActions: 'play none none none',
                    }
                }
            );
        });
    }
    
    // --- HEADER STICKY LOGIC ---
    const header = document.querySelector('.header');
    // This logic only applies the sticky/colored background to the homepage header on scroll
    if (header && !header.classList.contains('is-page')) {
        ScrollTrigger.create({
            trigger: "body",
            start: "top -50px", // Activates after scrolling 50px
            end: "bottom bottom",
            toggleClass: {
                targets: header,
                className: "is-page" // Uses the same style as inner page headers
            }
        });
    }

    // --- CONSTELLATION CANVAS ANIMATION ---
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let dots = [];
        const numDots = window.innerWidth > 768 ? 100 : 40;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        class Dot {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = -0.5 + Math.random();
                this.vy = -0.5 + Math.random();
                this.radius = Math.random() * 1.5;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.fill();
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
                if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            }
        }

        function init() {
            for (let i = 0; i < numDots; i++) {
                dots.push(new Dot());
            }
        }

        function connect() {
            for (let i = 0; i < numDots; i++) {
                for (let j = i; j < numDots; j++) {
                    let dist = Math.sqrt(Math.pow(dots[i].x - dots[j].x, 2) + Math.pow(dots[i].y - dots[j].y, 2));
                    if (dist < 150) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 150})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            dots.forEach(dot => {
                dot.update();
                dot.draw();
            });
            connect();
        }

        init();
        animate();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            dots = [];
            init();
        });
    }

    // --- MOBILE NAVIGATION (FULLY FUNCTIONAL) ---
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileNavToggle && mainNav) {
        mobileNavToggle.addEventListener('click', () => {
            mobileNavToggle.classList.toggle('open');
            mainNav.classList.toggle('open');
            document.body.classList.toggle('no-scroll');
        });
    }

    // --- FOOTER YEAR ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
