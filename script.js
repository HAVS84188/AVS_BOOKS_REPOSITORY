document.addEventListener('DOMContentLoaded', () => {
    const pageData = {
        'index.html': {
            title: 'AVS Books | NCERT, JEE & Olympiad Books',
            description: 'Browse the AVS Books Repository for mathematics, physics, and chemistry books, including NCERT textbooks and JEE and Olympiad study resources.',
            subject: null
        },
        'maths.html': {
            title: 'Mathematics Books for JEE & Olympiad | AVS Books',
            description: 'Explore mathematics books for JEE and Olympiad preparation, including algebra, calculus, geometry, trigonometry, number theory, and school resources.',
            subject: 'Mathematics'
        },
        'physics.html': {
            title: 'Physics Books for Classes 11–12, JEE & Olympiad | AVS Books',
            description: 'Browse physics books for Classes 11 and 12, JEE, and Olympiad preparation, including NCERT textbooks and problem-solving resources.',
            subject: 'Physics'
        },
        'chemistry.html': {
            title: 'Chemistry Books for Classes 11–12 | AVS Books',
            description: 'Explore chemistry books for Classes 11 and 12, including NCERT textbooks and physical and organic chemistry study resources.',
            subject: 'Chemistry'
        }
    };
    const fileName = window.location.pathname.toLowerCase().split('/').pop() || 'index.html';
    const data = pageData[fileName] || pageData['index.html'];
    const siteRoot = 'https://havs84188.github.io/AVS_BOOKS_REPOSITORY/';
    const pageUrl = new URL(fileName === 'index.html' ? '' : fileName, siteRoot).href;

    function setMeta(selector, attributes, content) {
        let element = document.head.querySelector(selector);
        if (!element) {
            element = document.createElement('meta');
            Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    }

    function addStructuredData(id, dataObject) {
        if (document.getElementById(id)) return;
        const script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(dataObject);
        document.head.appendChild(script);
    }

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
    }
    canonical.href = pageUrl;

    document.title = data.title;
    setMeta('meta[name="description"]', { name: 'description' }, data.description);
    setMeta('meta[name="robots"]', { name: 'robots' }, 'index, follow, max-image-preview:large');
    setMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, 'AVS Books Repository');
    setMeta('meta[property="og:title"]', { property: 'og:title' }, data.title);
    setMeta('meta[property="og:description"]', { property: 'og:description' }, data.description);
    setMeta('meta[property="og:url"]', { property: 'og:url' }, pageUrl);
    setMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary');
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, data.title);
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, data.description);

    if (data.subject) {
        const cards = [...document.querySelectorAll('.book-card')].filter(card => card.querySelector('h3'));
        cards.forEach((card, index) => {
            const image = card.querySelector('img');
            if (image) {
                image.loading = index < 2 ? 'eager' : 'lazy';
                image.decoding = 'async';
            }
        });
        addStructuredData('collection-structured-data', {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${data.subject} book collection`,
            description: data.description,
            url: pageUrl,
            isPartOf: { '@type': 'WebSite', name: 'AVS Books Repository', url: siteRoot },
            mainEntity: {
                '@type': 'ItemList',
                numberOfItems: cards.length,
                itemListElement: cards.map((card, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    name: card.querySelector('h3').textContent.trim()
                }))
            }
        });

        const searchInput = document.getElementById('bookSearch');
        if (searchInput) {
            searchInput.setAttribute('aria-label', `Search ${data.subject.toLowerCase()} books by title`);
            searchInput.setAttribute('autocomplete', 'off');
        }
    } else {
        addStructuredData('website-structured-data', {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'AVS Books Repository',
            url: siteRoot,
            description: data.description
        });
    }

    const searchInput = document.getElementById('bookSearch');
    if (searchInput) {
        searchInput.addEventListener('input', event => {
            const searchTerm = event.target.value.toLowerCase().trim();
            document.querySelectorAll('.book-card').forEach(card => {
                const heading = card.querySelector('h3');
                if (!heading) return;
                card.style.display = heading.textContent.toLowerCase().includes(searchTerm) ? 'flex' : 'none';
            });
        });
    }
});
