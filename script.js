document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.toLowerCase();
    const pageData = {
        'maths.html': {
            title: 'Mathematics Books for JEE & Olympiad | AVS Books',
            description: 'Explore mathematics books for JEE and Olympiad preparation, including algebra, calculus, geometry, trigonometry, number theory, and NCERT resources.',
            heading: 'Mathematics books for JEE and Olympiad preparation',
            intro: 'Browse mathematics study resources across algebra, calculus, geometry, trigonometry, and number theory, with books for school, JEE, and Olympiad preparation.',
            subject: 'Mathematics'
        },
        'physics.html': {
            title: 'Physics Books for JEE & Olympiad | AVS Books',
            description: 'Browse physics books for Classes 11 and 12, JEE, and Olympiad preparation, including NCERT textbooks and well-known problem-solving resources.',
            heading: 'Physics books for school, JEE, and Olympiad study',
            intro: 'Find physics study resources for Classes 11 and 12, JEE preparation, and Olympiad practice, including NCERT textbooks and problem-solving books.',
            subject: 'Physics'
        },
        'chemistry.html': {
            title: 'Chemistry Books for Classes 11 & 12 | AVS Books',
            description: 'Explore chemistry books for Classes 11 and 12, including NCERT textbooks and physical and organic chemistry study resources for exam preparation.',
            heading: 'Chemistry books for Classes 11 and 12',
            intro: 'Browse chemistry resources for Classes 11 and 12, including NCERT textbooks and study books covering physical and organic chemistry.',
            subject: 'Chemistry'
        }
    };
    const fileName = path.split('/').pop() || 'index.html';
    const data = pageData[fileName];

    const setMeta = (selector, attributes, content) => {
        let element = document.head.querySelector(selector);
        if (!element) {
            element = document.createElement('meta');
            Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    const pageUrl = new URL(window.location.href);
    pageUrl.hash = '';
    pageUrl.search = '';
    if (fileName === 'index.html') {
        pageUrl.pathname = pageUrl.pathname.replace(/index\.html$/i, '');
    }
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = pageUrl.href;

    if (data) {
        document.title = data.title;
        setMeta('meta[name="description"]', { name: 'description' }, data.description);
        setMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
        setMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, 'AVS Books Repository');
        setMeta('meta[property="og:title"]', { property: 'og:title' }, data.title);
        setMeta('meta[property="og:description"]', { property: 'og:description' }, data.description);
        setMeta('meta[property="og:url"]', { property: 'og:url' }, pageUrl.href);
        setMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary');
        setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, data.title);
        setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, data.description);

        const container = document.querySelector('.container');
        const searchContainer = document.querySelector('.search-container');
        if (container && searchContainer && !container.querySelector('.seo-intro')) {
            const intro = document.createElement('section');
            intro.className = 'seo-intro';
            intro.setAttribute('aria-labelledby', 'collection-intro-heading');
            const heading = document.createElement('h2');
            heading.id = 'collection-intro-heading';
            heading.textContent = data.heading;
            const paragraph = document.createElement('p');
            paragraph.textContent = data.intro;
            intro.append(heading, paragraph);
            container.insertBefore(intro, searchContainer);
        }

        const searchInput = document.getElementById('bookSearch');
        const bookGrid = document.querySelector('.book-grid');
        const cards = bookGrid ? [...bookGrid.querySelectorAll('.book-card')].filter(card => card.querySelector('h3')) : [];
        if (searchInput) {
            searchInput.setAttribute('aria-label', `Search ${data.subject.toLowerCase()} books by title`);
            searchInput.setAttribute('aria-controls', 'book-results');
            if (bookGrid) bookGrid.id = 'book-results';
        }
        if (bookGrid && cards.length) {
            const listItems = cards.map((card, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: card.querySelector('h3').textContent.trim()
            }));
            addStructuredData({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: data.heading,
                description: data.description,
                url: pageUrl.href,
                mainEntity: { '@type': 'ItemList', itemListElement: listItems }
            }, 'collection-structured-data');
        }
    } else if (fileName === 'index.html' || fileName === '') {
        addStructuredData({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'AVS Books Repository',
            url: pageUrl.href,
            description: 'Browse mathematics, physics, and chemistry books and study resources.'
        }, 'website-structured-data');
    }

    const searchInput = document.getElementById('bookSearch');
    if (searchInput) {
        const cards = [...document.querySelectorAll('.book-card')].filter(card => card.querySelector('h3'));
        const resultsMessage = document.createElement('p');
        resultsMessage.className = 'search-results-message';
        resultsMessage.setAttribute('role', 'status');
        resultsMessage.setAttribute('aria-live', 'polite');
        resultsMessage.hidden = true;
        searchInput.parentElement.insertAdjacentElement('afterend', resultsMessage);

        searchInput.addEventListener('input', event => {
            const term = event.target.value.toLocaleLowerCase().trim();
            let visibleCount = 0;
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLocaleLowerCase();
                const isVisible = title.includes(term);
                card.hidden = !isVisible;
                if (isVisible) visibleCount += 1;
            });
            resultsMessage.hidden = term.length === 0;
            resultsMessage.textContent = visibleCount === 0
                ? 'No books match your search. Try another title.'
                : `${visibleCount} ${visibleCount === 1 ? 'book' : 'books'} found.`;
        });
    }

    function addStructuredData(data, id) {
        if (document.getElementById(id)) return;
        const script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }
});
