document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('bookSearch');

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const bookCards = document.querySelectorAll('.book-card');

            bookCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                
                if (title.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});