/* ============================================
   POŁOWINKI GUMed 2026 — SCRIPT
   Countdown · scroll reveal · mobile nav · FAQ
   ============================================ */

(function () {
    'use strict';

    /* -------- COUNTDOWN -------- */
    // Target: 17 października 2026, 20:00 czasu lokalnego (PL)
    const target = new Date('2026-10-17T20:00:00+02:00').getTime();

    const els = {
        days:    document.getElementById('cd-days'),
        hours:   document.getElementById('cd-hours'),
        minutes: document.getElementById('cd-minutes'),
        seconds: document.getElementById('cd-seconds'),
    };

    function pad(n, len) {
        return String(Math.max(0, n)).padStart(len, '0');
    }

    function tick() {
        const now = Date.now();
        let diff = target - now;

        if (diff <= 0) {
            els.days.textContent = '000';
            els.hours.textContent = '00';
            els.minutes.textContent = '00';
            els.seconds.textContent = '00';
            return;
        }

        const day = 1000 * 60 * 60 * 24;
        const hr  = 1000 * 60 * 60;
        const min = 1000 * 60;
        const sec = 1000;

        const days    = Math.floor(diff / day);  diff -= days * day;
        const hours   = Math.floor(diff / hr);   diff -= hours * hr;
        const minutes = Math.floor(diff / min);  diff -= minutes * min;
        const seconds = Math.floor(diff / sec);

        els.days.textContent    = pad(days, 3);
        els.hours.textContent   = pad(hours, 2);
        els.minutes.textContent = pad(minutes, 2);
        els.seconds.textContent = pad(seconds, 2);
    }

    tick();
    setInterval(tick, 1000);

    /* -------- SCROLL REVEAL -------- */
    const revealEls = document.querySelectorAll('.reveal');

    // Initially trigger hero items so the page loads with a stagger animation
    requestAnimationFrame(() => {
        document.querySelectorAll('.hero .reveal').forEach(el => {
            el.classList.add('is-visible');
        });
    });

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

        // Auto-add reveal to elements outside hero
        document.querySelectorAll(
            '.section-head, .detail-card, .faq-item, .rule, .cta-card, .footer-grid'
        ).forEach((el, idx) => {
            el.classList.add('reveal');
            // small stagger on grid children
            el.style.transitionDelay = `${(idx % 6) * 0.06}s`;
            io.observe(el);
        });
    } else {
        // Fallback
        document.querySelectorAll(
            '.section-head, .detail-card, .faq-item, .rule, .cta-card, .footer-grid'
        ).forEach(el => el.classList.add('is-visible'));
    }

    /* -------- NAV: scroll state -------- */
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    function onScroll() {
        const y = window.scrollY;
        if (y > 30) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
        lastScroll = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* -------- NAV: mobile toggle -------- */
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.querySelector('.nav-links');

    function setMenu(open) {
        toggle.classList.toggle('open', open);
        links.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
    }

    toggle.addEventListener('click', () => {
        setMenu(!toggle.classList.contains('open'));
    });

    links.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') setMenu(false);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toggle.classList.contains('open')) setMenu(false);
    });

    /* -------- PLACEHOLDER REGISTRATION LINK -------- */
    document.querySelectorAll('[data-placeholder-link]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            // Subtle shake to communicate "not yet"
            el.animate(
                [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-6px)' },
                    { transform: 'translateX(6px)' },
                    { transform: 'translateX(-4px)' },
                    { transform: 'translateX(0)' }
                ],
                { duration: 380, easing: 'ease-out' }
            );

            // Toast
            showToast('Link do zapisów pojawi się wkrótce ✦');
        });
    });

    /* -------- TOAST -------- */
    let toastEl;
    function showToast(text) {
        if (!toastEl) {
            toastEl = document.createElement('div');
            toastEl.className = 'toast';
            Object.assign(toastEl.style, {
                position: 'fixed',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%) translateY(120%)',
                padding: '0.9rem 1.6rem',
                background: 'var(--bg-deep)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                border: '1px solid var(--copper)',
                zIndex: '1000',
                transition: 'transform .45s cubic-bezier(.7,0,.3,1)',
                boxShadow: '0 12px 40px -12px rgba(0,0,0,0.6)',
                maxWidth: 'calc(100vw - 2rem)',
                textAlign: 'center'
            });
            document.body.appendChild(toastEl);
        }
        toastEl.textContent = text;
        requestAnimationFrame(() => {
            toastEl.style.transform = 'translateX(-50%) translateY(0)';
        });
        clearTimeout(toastEl._t);
        toastEl._t = setTimeout(() => {
            toastEl.style.transform = 'translateX(-50%) translateY(120%)';
        }, 2800);
    }

    /* -------- FAQ: only one open at a time (optional, nice UX) -------- */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item && other.open) other.open = false;
                });
            }
        });
    });

})();
