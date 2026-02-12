// Proflix Authentication Simulation

document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');

    if (signinForm) {
        signinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple simulation: Accept anything not empty
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (email && password) {
                console.log('Logging in as ' + email);
                // Redirect to browse page
                window.location.href = 'proflix_browse.html';
            } else {
                alert('Please enter a valid email and password.');
            }
        });
    }


    // Modal Logic
    const modal = document.getElementById('movie-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');

    if (modal) {
        // Open modal when clicking a poster
        const posters = document.querySelectorAll('.row-poster');
        posters.forEach(poster => {
            poster.addEventListener('click', () => {
                const src = poster.src;
                const alt = poster.alt;

                modalImg.src = src;
                modalTitle.textContent = alt || "Movie Title";
                modal.style.display = "block";
                document.body.style.overflow = "hidden"; // Disable scroll
            });
        });

        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        });

        // Close outside click
        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        });
    }
});
