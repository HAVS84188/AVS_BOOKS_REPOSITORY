document.addEventListener('DOMContentLoaded', () => {
    const siteRoot = 'https://havs84188.github.io/AVS_BOOKS_REPOSITORY/';
    const pageName = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    const pages = {
        'maths.html': {
            title: 'Mathematics Books for JEE and Olympiad | AVS Books',
            description: 'Browse mathematics books and study resources for JEE and Olympiad preparation, including algebra, calculus, geometry, trigonometry, and number theory.',
            subject: 'Mathematics'
        },
        'physics.html': {
            title: 'Physics Books for Classes 11 and 12 | AVS Books',
            description: 'Browse physics books for Classes 11 and 12, including NCERT textbooks and resources for JEE and Olympiad preparation.',
            subject: 'Physics'
        },
        'chemistry.html': {
            title: 'Chemistry Books for Classes 11 and 12 | AVS Books',
            description: 'Browse chemistry books for Classes 11 and 12, including NCERT textbooks and physical and organic chemistry study resources.',
            subject: 'Chemistry'
        }
    };

    function setMeta(selector, attributes, value) {
        let element = document.head.querySelector(selector);
        if (!element) {
            element = document.createElement('meta');
            Object.entries(attributes).forEach(([name, attributeValue]) => {
                element.setAttribute(name, attributeValue);
            });
            document.head.appendChild(element);
        }
        element.setAttribute('content', value);
    }

    function addJsonLd(id, data) {
        if (document.getElementById(id)) return;
        const script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
    }

    const pageUrl = new URL(pageName === 'index.html' ? '' : pageName, siteRoot).href;
    if (pageName === 'index.html' || pageName === '') {
        addJsonLd('website-jsonld', {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'AVS Books Repository',
            url: siteRoot,
            description: 'Browse mathematics, physics, and chemistry books and study resources.'
        });
    } else if (pages[pageName]) {
        const page = pages[pageName];
        document.title = page.title;
        setMeta('meta[name="description"]', { name: 'description' }, page.description);
        setMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
        setMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, 'AVS Books Repository');
        setMeta('meta[property="og:title"]', { property: 'og:title' }, page.title);
        setMeta('meta[property="og:description"]', { property: 'og:description' }, page.description);
        setMeta('meta[property="og:url"]', { property: 'og:url' }, pageUrl);
        setMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary');
        setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, page.title);
        setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, page.description);

        const cards = [...document.querySelectorAll('.book-card')].filter(card => card.querySelector('h3'));
        addJsonLd('collection-jsonld', {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${page.subject} book collection`,
            description: page.description,
            url: pageUrl,
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
