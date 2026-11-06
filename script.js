document.addEventListener('DOMContentLoaded', () => {
    const pageData = {
        'maths.html': {
            title: 'Mathematics Books for JEE & Olympiad | AVS Books',
            description: 'Explore mathematics books for JEE and Olympiad preparation, including algebra, calculus, geometry, trigonometry, number theory, and school-level resources.',
            heading: 'Mathematics books for JEE and Olympiad preparation',
            intro: 'Browse study resources across algebra, calculus, geometry, trigonometry, and number theory, with books for school, JEE, and Olympiad preparation.',
            subject: 'Mathematics',
            faqs: [
                ['What mathematics topics can I browse?', 'The collection includes resources for algebra, calculus, geometry, trigonometry, number theory, and mathematics Olympiad preparation. Use the search box to find titles by name.'],
                ['Are these books intended for JEE and Olympiad preparation?', 'The collection includes titles listed for JEE, pre-RMO, and mathematics Olympiad study, as well as broader mathematics references. Check each title and linked resource for its intended level.']
            ]
        },
        'physics.html': {
            title: 'Physics Books for Classes 11–12, JEE & Olympiad | AVS Books',
            description: 'Browse physics books for Classes 11 and 12, JEE, and Olympiad preparation, including NCERT textbooks and problem-solving resources.',
            heading: 'Physics books for school, JEE, and Olympiad study',
            intro: 'Find physics study resources for Classes 11 and 12, JEE preparation, and Olympiad practice, including NCERT textbooks and problem-solving titles.',
            subject: 'Physics',
            faqs: [
                ['Are Class 11 and 12 NCERT physics books listed?', 'The collection includes links to NCERT Physics Class 11 and Class 12, Parts 1 and 2. Follow the relevant resource link to check its current availability.'],
                ['Can I find physics problem-solving books here?', 'The page lists several physics reference and problem-solving titles alongside school textbooks. Search by book title to locate a resource.']
            ]
        },
        'chemistry.html': {
            title: 'Chemistry Books for Classes 11–12 | AVS Books',
            description: 'Explore chemistry books for Classes 11 and 12, including NCERT textbooks and physical and organic chemistry study resources.',
            heading: 'Chemistry books for Classes 11 and 12',
            intro: 'Browse chemistry resources for Classes 11 and 12, including NCERT textbooks and study books covering physical and organic chemistry.',
            subject: 'Chemistry',
            faqs: [
                ['Are NCERT chemistry textbooks listed for Classes 11 and 12?', 'The collection includes links to NCERT Chemistry Class 11 and Class 12, Parts 1 and 2. Check the NCERT resource page for current editions and availability.'],
                ['Which chemistry topics are represented?', 'The collection includes physical and organic chemistry study resources. Review each book listing and its linked page for specific contents and level.']
            ]
        }
    };
    const fileName = window.location.pathname.toLowerCase().split('/').pop() || 'index.html';
    const data = pageData[fileName];
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

    function setCanonical(url) {
        let canonical = document.head.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = url;
    }

    setCanonical(pageUrl);

    if (data) {
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

        const header = document.querySelector('header');
        if (header && !header.querySelector('.site-home-link')) {
            const homeLink = document.createElement('a');
            homeLink.className = 'site-home-link';
            homeLink.href = 'index.html';
            homeLink.textContent = 'AVS Books home';
            homeLink.setAttribute('aria-label', 'Return to AVS Books home page');
            header.appendChild(homeLink);
        }

        const searchInput = document.getElementById('bookSearch');
        const bookGrid = document.querySelector('.book-grid');
        const cards = bookGrid ? [...bookGrid.querySelectorAll('.book-card')].filter(card => card.querySelector('h3')) : [];
        if (searchInput) {
            searchInput.setAttribute('type', 'search');
            searchInput.setAttribute('aria-label', `Search ${data.subject.toLowerCase()} books by title`);
            searchInput.setAttribute('aria-controls', 'book-results');
            searchInput.setAttribute('autocomplete', 'off');
            if (bookGrid) bookGrid.id = 'book-results';
        }

        cards.forEach((card, index) => {
            const title = card.querySelector('h3').textContent.trim();
            const image = card.querySelector('img');
            if (image) {
                if (!image.alt || /^(v\d+|black book|pink book|phys n awas neet|i\.e\.irodov)$/i.test(image.alt.trim())) {
                    image.alt = `${title} book cover`;
                }
                image.loading = index < 2 ? 'eager' : 'lazy';
                image.decoding = 'async';
                if (index === 0) image.fetchPriority = 'high';
            }
            const link = card.querySelector('a.btn');
            if (link) {
                link.setAttribute('aria-label', `Open resource for ${title}`);
                if (link.target === '_blank') link.rel = 'noopener noreferrer';
                link.textContent = 'View resource';
            }
        });

        if (bookGrid && cards.length) {
            addStructuredData('collection-structured-data', {
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: data.heading,
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
        }

        addFaqs(container, data.faqs);
        addCollectionNavigation(container, fileName);
    } else {
        setMeta('meta[property="og:url"]', { property: 'og:url' }, pageUrl);
        addStructuredData('website-structured-data', {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'AVS Books Repository',
            url: siteRoot,
            description: 'Browse mathematics, physics, and chemistry study books and resources.'
        });
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

    function addFaqs(container, faqs) {
        if (!container || !faqs || container.querySelector('.collection-faq')) return;
        const section = document.createElement('section');
        section.className = 'collection-faq';
        section.setAttribute('aria-labelledby', 'faq-heading');
        const heading = document.createElement('h2');
        heading.id = 'faq-heading';
        heading.textContent = `About the ${pageData[fileName].subject} book collection`;
        section.appendChild(heading);
        faqs.forEach(([question, answer]) => {
            const details = document.createElement('details');
            const summary = document.createElement('summary');
            summary.textContent = question;
            const paragraph = document.createElement('p');
            paragraph.textContent = answer;
            details.append(summary, paragraph);
            section.appendChild(details);
        });
        container.appendChild(section);
    }

    function addCollectionNavigation(container, currentPage) {
        if (!container || container.querySelector('.related-collections')) return;
        const links = [
            ['maths.html', 'Mathematics'],
            ['physics.html', 'Physics'],
            ['chemistry.html', 'Chemistry']
        ].filter(([href]) => href !== currentPage);
        const section = document.createElement('nav');
        section.className = 'related-collections';
        section.setAttribute('aria-label', 'Explore other book collections');
        const heading = document.createElement('h2');
        heading.textContent = 'Explore other collections';
        const list = document.createElement('ul');
        links.forEach(([href, label]) => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = href;
            link.textContent = `${label} books`;
            item.appendChild(link);
            list.appendChild(item);
        });
        section.append(heading, list);
        container.appendChild(section);
    }
});
