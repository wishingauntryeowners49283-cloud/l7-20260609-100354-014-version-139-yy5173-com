(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var activeSlide = 0;

    function setSlide(index) {
        if (!slides.length) {
            return;
        }

        activeSlide = (index + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
            slide.classList.toggle('active', itemIndex === activeSlide);
        });
        dots.forEach(function (dot, itemIndex) {
            dot.classList.toggle('active', itemIndex === activeSlide);
        });
    }

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            setSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            setSlide(activeSlide + 1);
        }, 5200);
    }

    var searchInput = document.querySelector('[data-search]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var yearSelect = document.querySelector('[data-year-select]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var emptyState = document.querySelector('[data-empty-state]');
    var activeFilter = 'all';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilters() {
        var query = normalize(searchInput ? searchInput.value : '');
        var year = yearSelect ? yearSelect.value : 'all';
        var visible = 0;

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags'));
            var cardYear = card.getAttribute('data-year') || '';
            var cardCategory = card.getAttribute('data-category') || '';
            var matchedQuery = !query || text.indexOf(query) !== -1;
            var matchedYear = year === 'all' || cardYear === year;
            var matchedCategory = activeFilter === 'all' || cardCategory === activeFilter;
            var matched = matchedQuery && matchedYear && matchedCategory;

            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('show', visible === 0);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (yearSelect) {
        yearSelect.addEventListener('change', applyFilters);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeFilter = button.getAttribute('data-filter') || 'all';
            filterButtons.forEach(function (item) {
                item.classList.toggle('active', item === button);
            });
            applyFilters();
        });
    });

    applyFilters();
})();
