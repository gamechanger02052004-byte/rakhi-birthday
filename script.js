document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page');
    const birthdateInput = document.getElementById('birthdate');
    const authBtn = document.getElementById('auth-btn');
    const errorMsg = document.getElementById('error-msg');
    
    // --- Audio Control System ---
    const audio = document.getElementById('birthday-song');
    const musicToggle = document.getElementById('music-toggle');

    function playMusic() {
        if (audio) {
            audio.play().then(() => {
                if (musicToggle) {
                    musicToggle.classList.add('playing');
                    musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
                }
            }).catch(err => {
                console.log("Audio play blocked or failed. Waiting for user click.", err);
            });
        }
    }

    function pauseMusic() {
        if (audio) {
            audio.pause();
            if (musicToggle) {
                musicToggle.classList.remove('playing');
                musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            }
        }
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (audio) {
                if (audio.paused) {
                    playMusic();
                } else {
                    pauseMusic();
                }
            }
        });
    }

    // Copy to clipboard helper
    window.copyToClipboard = (text, btnElement) => {
        navigator.clipboard.writeText(text).then(() => {
            const originalText = btnElement.textContent;
            btnElement.textContent = "COPIED! ✓";
            btnElement.style.backgroundColor = "#4caf50";
            setTimeout(() => {
                btnElement.textContent = originalText;
                btnElement.style.backgroundColor = "";
            }, 2000);
        }).catch(err => {
            alert("Failed to copy code. Please write it down: " + text);
        });
    };

    // Page Navigation Helper
    const navigateTo = (pageId) => {
        pages.forEach(page => {
            page.classList.remove('active');
            page.style.display = 'none';
        });
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'flex';
            // Trigger browser reflow to allow transition to play
            targetPage.offsetHeight;
            targetPage.classList.add('active');
        }
    };

    // --- PAGE 1: Authentication Logic ---
    authBtn.addEventListener('click', () => {
        const dateVal = birthdateInput.value.trim(); // Expected format: dd/mm/yyyy
        const parts = dateVal.split('/');
        
        if (parts.length >= 2) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);

            // Birthday: August 28th (28/08)
            if (day === 28 && month === 8) {
                // Start music play immediately on user action
                playMusic();

                // Success: Play beautiful portal warp transition
                const landingPage = document.getElementById('page-1');
                landingPage.classList.add('portal-transition');
                
                setTimeout(() => {
                    landingPage.style.display = 'none';
                    landingPage.classList.remove('portal-transition');
                    navigateTo('page-2');
                    triggerConfettiFull();
                }, 1400);
            } else {
                errorMsg.textContent = "Incorrect date! Hint: It's a special day in August 🌸";
            }
        } else {
            errorMsg.textContent = "Please use the dd/mm/yyyy format.";
        }
    });

    // Support submitting by pressing Enter key
    birthdateInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            authBtn.click();
        }
    });


    // --- PAGE 2: Celebration Hub ---
    const celebrateBtn = document.getElementById('celebrate-btn');
    const toGiftsBtn = document.getElementById('to-gifts-btn');
    const toWishesBtn = document.getElementById('to-wishes-btn');

    celebrateBtn.addEventListener('click', () => {
        triggerConfettiFull();
        // Custom micro-celebration burst
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
    });

    toGiftsBtn.addEventListener('click', () => navigateTo('page-3'));
    toWishesBtn.addEventListener('click', () => navigateTo('page-4'));


    // --- PAGE 3: Surprise Gifts Page ---
    const toPage2From3 = document.getElementById('to-page-2-from-3');
    const toPage4From3 = document.getElementById('to-page-4-from-3');
    const giftCards = document.querySelectorAll('.gift-card');

    // Modal elements
    const giftModal = document.getElementById('gift-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const modalIcon = document.getElementById('modal-icon');
    const closeModalBtn = giftModal.querySelector('.close-modal');
    const modalActionBtn = document.getElementById('modal-action-btn');

    toPage2From3.addEventListener('click', () => navigateTo('page-2'));
    toPage4From3.addEventListener('click', () => navigateTo('page-4'));

    // Handle Gift Cards click
    giftCards.forEach(card => {
        card.addEventListener('click', () => {
            const isFlipped = card.classList.contains('flipped');
            
            // Flip the card visually
            card.classList.add('flipped');

            // Gather attributes
            const title = card.getAttribute('data-title');
            const iconClass = card.getAttribute('data-icon');
            const content = card.getAttribute('data-content');

            // If it wasn't already flipped, play a sweet confetti effect on flip
            if (!isFlipped) {
                setTimeout(() => {
                    confetti({
                        particleCount: 30,
                        angle: 60,
                        spread: 50,
                        origin: { x: 0 }
                    });
                    confetti({
                        particleCount: 30,
                        angle: 120,
                        spread: 50,
                        origin: { x: 1 }
                    });
                }, 300);
            }

            // Open custom modal after a short delay for the flipping transition to finish
            setTimeout(() => {
                // Populate Modal Data
                modalTitle.textContent = title;
                modalText.innerHTML = content;
                
                // Clear old classes & apply new icon
                modalIcon.className = '';
                modalIcon.classList.add('fa-solid', iconClass);

                // Open Modal
                giftModal.classList.add('active');
            }, 600);
        });
    });

    // Close Modal functions
    const closeModal = () => {
        giftModal.classList.remove('active');
    };

    closeModalBtn.addEventListener('click', closeModal);
    modalActionBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === giftModal) {
            closeModal();
        }
    });


    // --- PAGE 4: Heartfelt Wishes Page ---
    const toPage2From4 = document.getElementById('to-page-2-from-4');
    const toPage3From4 = document.getElementById('to-page-3-from-4');
    const envelope = document.getElementById('envelope');

    toPage2From4.addEventListener('click', () => navigateTo('page-2'));
    toPage3From4.addEventListener('click', () => navigateTo('page-3'));

    // Envelope click opens/closes the flap and slides letter
    envelope.addEventListener('click', (e) => {
        // Prevent toggling if the user is highlights/clicking text inside the open letter
        if (envelope.classList.contains('open') && e.target.closest('.letter')) {
            return;
        }
        envelope.classList.toggle('open');
        
        // Trigger soft sparkles when opening the letter
        if (envelope.classList.contains('open')) {
            confetti({
                particleCount: 20,
                spread: 40,
                colors: ['#ffd700', '#f48fb1', '#ab47bc']
            });
        }
    });


    // --- Magical Confetti Machine ---
    function triggerConfettiFull() {
        const duration = 2.5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#ec407a', '#ffd700', '#ab47bc', '#f6eeff']
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#ec407a', '#ffd700', '#ab47bc', '#f6eeff']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
});
