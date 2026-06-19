(function () {
    var navToggle = document.querySelector('.nav-toggle');
    var siteNav = document.querySelector('.site-nav');

    if (navToggle && siteNav) {
        navToggle.addEventListener('click', function () {
            var opened = siteNav.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var prev = document.querySelector('.hero-prev');
    var next = document.querySelector('.hero-next');
    var slideIndex = 0;
    var slideTimer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        slideIndex = (index + slides.length) % slides.length;
        slides.forEach(function (slide, itemIndex) {
            slide.classList.toggle('is-active', itemIndex === slideIndex);
        });
        dots.forEach(function (dot, itemIndex) {
            dot.classList.toggle('is-active', itemIndex === slideIndex);
        });
    }

    function startSlides() {
        if (slides.length < 2) {
            return;
        }
        window.clearInterval(slideTimer);
        slideTimer = window.setInterval(function () {
            showSlide(slideIndex + 1);
        }, 5200);
    }

    if (slides.length) {
        dots.forEach(function (dot, itemIndex) {
            dot.addEventListener('click', function () {
                showSlide(itemIndex);
                startSlides();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(slideIndex - 1);
                startSlides();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                showSlide(slideIndex + 1);
                startSlides();
            });
        }
        startSlides();
    }

    var searchInput = document.getElementById('siteSearch');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var activeFilter = '全部';

    function cardText(card) {
        return [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-genre') || '',
            card.getAttribute('data-tags') || '',
            card.getAttribute('data-region') || '',
            card.getAttribute('data-year') || '',
            card.textContent || ''
        ].join(' ').toLowerCase();
    }

    function applySearch() {
        if (!cards.length) {
            return;
        }
        var keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
        cards.forEach(function (card) {
            var text = cardText(card);
            var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchesFilter = activeFilter === '全部' || text.indexOf(activeFilter.toLowerCase()) !== -1;
            card.classList.toggle('is-hidden', !(matchesKeyword && matchesFilter));
        });
    }

    if (searchInput) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query) {
            searchInput.value = query;
        }
        searchInput.addEventListener('input', applySearch);
    }

    if (filterButtons.length) {
        filterButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                activeFilter = button.getAttribute('data-filter') || '全部';
                filterButtons.forEach(function (item) {
                    item.classList.toggle('is-active', item === button);
                });
                applySearch();
            });
        });
        filterButtons[0].classList.add('is-active');
    }

    applySearch();

    function playVideo(wrapper) {
        var video = wrapper.querySelector('video');
        var button = wrapper.querySelector('.play-cover');
        var url = wrapper.getAttribute('data-video-url');

        if (!video || !url) {
            return;
        }

        wrapper.classList.add('is-playing');
        video.controls = true;

        if (!video.getAttribute('src')) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    maxBufferLength: 32,
                    enableWorker: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
            } else {
                video.src = url;
            }
        }

        var attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {
                if (button) {
                    button.style.display = 'grid';
                }
                wrapper.classList.remove('is-playing');
            });
        }
    }

    Array.prototype.slice.call(document.querySelectorAll('.js-player')).forEach(function (wrapper) {
        var button = wrapper.querySelector('.play-cover');
        var video = wrapper.querySelector('video');

        if (button) {
            button.addEventListener('click', function () {
                playVideo(wrapper);
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                playVideo(wrapper);
            });
            video.addEventListener('play', function () {
                wrapper.classList.add('is-playing');
            });
        }
    });
}());
