/* js/main.js */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if(mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
                if(menuIcon) menuIcon.textContent = 'close';
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                if(menuIcon) menuIcon.textContent = 'menu';
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenu.classList.remove('flex');
                    if(menuIcon) menuIcon.textContent = 'menu';
                    if(mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // 3. Fade-In Animations
    const fadeElements = document.querySelectorAll('.animate-on-scroll');
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -15% 0px', threshold: 0 });
    fadeElements.forEach(el => {
        el.classList.add('fade-in-section');
        fadeObserver.observe(el);
    });

    // 4. Sticky Header
    const globalNav = document.getElementById('global-nav');
    if (globalNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                globalNav.classList.add('shadow-lg', 'bg-opacity-95', 'backdrop-blur-md');
            } else {
                globalNav.classList.remove('shadow-lg', 'bg-opacity-95', 'backdrop-blur-md');
            }
        });
    }

    // 5. Hover sync (process steps)
    document.querySelectorAll('[data-sync]').forEach(el => {
        const syncId = el.getAttribute('data-sync');
        el.addEventListener('mouseenter', () => {
            document.querySelectorAll(`[data-sync="${syncId}"]`).forEach(t => t.classList.add('hovered-sync'));
        });
        el.addEventListener('mouseleave', () => {
            document.querySelectorAll(`[data-sync="${syncId}"]`).forEach(t => t.classList.remove('hovered-sync'));
        });
    });

    // ============================================================
    // 6. BACKGROUND MUSIC — autoplay + persist state across pages
    // ============================================================
    const PATH_PLAYING = 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z';
    const PATH_STOPPED = 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z';

    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle-btn');
    const musicIcon = document.getElementById('music-icon-svg');

    if (!bgMusic || !musicBtn) return;

    bgMusic.volume = 0.15;

    function setIcon(playing) {
        if (musicIcon) {
            const pathEl = musicIcon.querySelector('path');
            if (pathEl) {
                pathEl.setAttribute('d', playing ? PATH_PLAYING : PATH_STOPPED);
            } else {
                musicIcon.innerHTML = '<path d="' + (playing ? PATH_PLAYING : PATH_STOPPED) + '"/>';
            }
        }
        musicBtn.style.background = playing ? 'rgba(230,25,25,0.25)' : 'rgba(255,255,255,0.08)';
        musicBtn.title = playing ? 'Kliknij aby wyciszyć muzykę' : 'Kliknij aby włączyć muzykę';
    }

    const isMuted = localStorage.getItem('music-muted') === 'true';

    if (!isMuted) {
        bgMusic.play().then(() => {
            setIcon(true);
        }).catch(() => {
            setIcon(false);
            const startOnInteraction = () => {
                if (localStorage.getItem('music-muted') === 'true') return;
                bgMusic.play().then(() => {
                    setIcon(true);
                    document.removeEventListener('click', startOnInteraction);
                    document.removeEventListener('scroll', startOnInteraction);
                }).catch(() => {});
            };
            document.addEventListener('click', startOnInteraction);
            document.addEventListener('scroll', startOnInteraction, { passive: true });
        });
    } else {
        setIcon(false);
    }

    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                setIcon(true);
                localStorage.setItem('music-muted', 'false');
            });
        } else {
            bgMusic.pause();
            setIcon(false);
            localStorage.setItem('music-muted', 'true');
        }
    });

    // ============================================================
    // 7. HOVER SOUND EFFECT (Web Audio API)
    // ============================================================
    let audioCtx = null;
    let audioUnlocked = false;

    function getAudioCtx() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        return audioCtx;
    }

    function playHoverSound() {
        if (!audioUnlocked) return;
        try {
            const ctx = getAudioCtx();
            if (ctx.state === 'suspended') ctx.resume();

            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // silently ignore audio errors
        }
    }

    // Unlock audio context on first user interaction (required by browsers)
    function unlockAudio() {
        audioUnlocked = true;
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        document.removeEventListener('mousedown', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    }
    document.addEventListener('mousedown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    document.addEventListener('keydown', unlockAudio);

    // Event delegation — fires when mouse enters any interactive element
    const hoverSelectors = [
        '.product-card',
        '.project-card',
        '.group',
        'a',
        'button',
        '[data-sync]'
    ].join(',');

    let lastHoveredEl = null;
    document.addEventListener('mouseover', (e) => {
        const target = e.target.closest(hoverSelectors);
        if (target && target !== lastHoveredEl) {
            lastHoveredEl = target;
            playHoverSound();
        }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
        if (lastHoveredEl && !lastHoveredEl.contains(e.relatedTarget)) {
            lastHoveredEl = null;
        }
    }, { passive: true });

});
