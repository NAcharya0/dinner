// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {

    // --- Helper Selectors ---
    const getEl = (sel) => document.querySelector(sel);
    const getAll = (sel) => document.querySelectorAll(sel);

    // Mobile Menu Toggle
    const hamburger = getEl('.hamburger');
    const navList = getEl('.nav-list');

    if (hamburger && navList) {
        hamburger.addEventListener('click', () => {
            navList.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        // Close mobile menu when clicking a link
        getAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navList.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
    }

    // Theme Toggle
    const themeToggle = getEl('.theme-toggle');
    const body = document.body;

    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        body.classList.add('light-mode');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-mode');
            const isLight = body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            // Icon switching is now handled by CSS
        });
    }

    // Smooth scrolling for anchor links
    getAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = getEl(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal animations on scroll
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    getAll('.section, [data-scroll]').forEach(section => {
        section.classList.add('hidden');
        observer.observe(section);
    });

    // HTML5 Audio Player
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    if (musicBtn && bgMusic) {
        bgMusic.volume = 0.5;

        musicBtn.addEventListener('click', () => {
            const iconWrapper = musicBtn.querySelector('.music-icon-wrapper');

            if (isPlaying) {
                bgMusic.pause();
                isPlaying = false;
                musicBtn.classList.remove('playing');
                if (iconWrapper) {
                    iconWrapper.innerHTML = `
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 18V5l12-2v13"></path>
                            <circle cx="6" cy="18" r="3"></circle>
                            <circle cx="18" cy="16" r="3"></circle>
                        </svg>
                    `;
                }
            } else {
                bgMusic.play().then(() => {
                    isPlaying = true;
                    musicBtn.classList.add('playing');
                    if (iconWrapper) {
                        iconWrapper.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                        `;
                    }
                }).catch(error => {
                    console.error("Audio play failed:", error);
                    // No alert to avoid annoying user if autoplay blocked
                });
            }
        });
    }

    // Weather Widget (Optional)
    const weatherTemp = document.getElementById('weather-temp');
    if (weatherTemp) {
        fetchWeather();
    }

    async function fetchWeather() {
        const weatherIcon = document.getElementById('weather-icon');
        const weatherWind = document.getElementById('weather-wind');
        const weatherPrecip = document.getElementById('weather-precip');

        try {
            const lat = 40.8398;
            const lon = -74.2765;
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.current_weather) {
                const temp = Math.round(data.current_weather.temperature);
                weatherTemp.textContent = `${temp}°F`;

                if (weatherWind) weatherWind.textContent = `💨 ${Math.round(data.current_weather.windspeed)} mph`;

                const currentHour = new Date().getHours();
                const precip = data.hourly.precipitation[currentHour] || 0;
                if (weatherPrecip) weatherPrecip.textContent = `💧 ${precip}"`;

                const code = data.current_weather.weathercode;
                let icon = '☀️';
                if (code >= 1 && code <= 3) icon = '⛅';
                if (code >= 45 && code <= 48) icon = '🌫️';
                if (code >= 51 && code <= 67) icon = '🌧️';
                if (code >= 71 && code <= 77) icon = '❄️';
                if (code >= 80 && code <= 82) icon = '🌦️';
                if (code >= 95) icon = '⛈️';
                if (weatherIcon) weatherIcon.textContent = icon;
            }
        } catch (error) {
            console.warn("Weather fetch failed; offline?");
            weatherTemp.textContent = "--";
        }
    }

    // Chatbot Logic
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    if (chatToggle && chatWindow && closeChat) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.add('active');
            if (chatInput) chatInput.focus();
        });

        closeChat.addEventListener('click', () => {
            chatWindow.classList.remove('active');
        });
    }

    function addMessage(text, isUser = false) {
        if (!chatMessages) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getBotResponse(input) {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) return "Hello! How can I help you today?";
        if (lowerInput.includes('education') || lowerInput.includes('college')) return "Nishant is pursuing a Bachelor's in Accounting and CIS at Caldwell University (GPA 4.0).";
        if (lowerInput.includes('experience') || lowerInput.includes('work')) return "Nishant has experience as a Library Student Worker, Student Ambassador, and Event Manager.";
        if (lowerInput.includes('contact')) return "You can contact Nishant at nacharya@caldwell.edu.";
        return "I can tell you about Nishant's education, experience, or contact info!";
    }

    function handleChat() {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, true);
            chatInput.value = '';
            setTimeout(() => {
                const response = getBotResponse(text);
                addMessage(response, false);
            }, 500);
        }
    }

    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', handleChat);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleChat();
        });
    }

    // 3D Tilt for Hero (Re-added from previous context)
    const heroCard = document.querySelector('.profile-card-tilt');
    if (heroCard && window.innerWidth > 900) {
        document.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            heroCard.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
        });
    }

    // --- Magnetic Buttons Effect ---
    // Targets any element with class .btn (which includes primary, outline, magnetic)
    const magneticButtons = getAll('.btn, .music-btn, .theme-toggle');

    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse X position within element
            const y = e.clientY - rect.top;  // Mouse Y position within element

            // Calculate distance from center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) * 0.4; // Scale factor triggers how far it moves
            const deltaY = (y - centerY) * 0.4;

            // Apply transform
            btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        btn.addEventListener('mouseleave', function () {
            // Reset position on leave
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // --- Contact Form Handling ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            // Simulate sending
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';

            setTimeout(() => {
                // Success State
                btn.textContent = 'Message Sent! 🚀';
                btn.style.backgroundColor = '#22c55e'; // Green
                btn.style.opacity = '1';
                contactForm.reset();

                // Reset after 3 seconds
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                }, 3000);
            }, 1500);
        });
    }

}); // End DOMContentLoaded
const projectCards = document.querySelectorAll('.project-card[data-category]');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 1. Activate Button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 2. Get Filter & Theme Color
            const filterValue = btn.getAttribute('data-filter');
            let themeHue = '200'; // Default Blue

            if (filterValue === 'sound-design') themeHue = '150'; // Green
            if (filterValue === 'music') themeHue = '280'; // Purple
            if (filterValue === 'mix') themeHue = '10';  // Red/Orange

            // 3. Apply Theme Change (Dynamic UI)
            document.documentElement.style.setProperty('--accent-blue', `hsl(${themeHue}, 90%, 60%)`);

            // 4. Filter Grid Items
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

});
