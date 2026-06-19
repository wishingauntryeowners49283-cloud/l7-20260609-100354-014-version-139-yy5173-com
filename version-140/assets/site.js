(function () {
    var ready = function (callback) {
        if (document.readyState !== "loading") {
            callback();
            return;
        }
        document.addEventListener("DOMContentLoaded", callback);
    };

    ready(function () {
        var toggle = document.querySelector(".nav-toggle");
        var mobileMenu = document.querySelector(".mobile-menu");

        if (toggle && mobileMenu) {
            toggle.addEventListener("click", function () {
                mobileMenu.classList.toggle("is-open");
            });
        }

        var searchForm = document.querySelector(".header-search");

        if (searchForm) {
            searchForm.addEventListener("submit", function (event) {
                event.preventDefault();
                var input = searchForm.querySelector("input");
                var query = input ? input.value.trim() : "";
                var url = "./search.html";
                if (query) {
                    url += "?q=" + encodeURIComponent(query);
                }
                window.location.href = url;
            });
        }

        initHero();
        initFilters();
        initPlayer();
    });

    function initHero() {
        var slider = document.querySelector(".hero-slider");
        if (!slider) {
            return;
        }

        var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
        var prev = slider.querySelector(".hero-prev");
        var next = slider.querySelector(".hero-next");
        var active = 0;

        if (slides.length <= 1) {
            return;
        }

        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(active - 1);
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                show(dotIndex);
            });
        });

        window.setInterval(function () {
            show(active + 1);
        }, 5200);
    }

    function initFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll(".filter-panel"));
        if (!panels.length) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query) {
                window.location.href = "./search.html?q=" + encodeURIComponent(query);
            }
            return;
        }

        panels.forEach(function (panel) {
            var scopeSelector = panel.getAttribute("data-scope");
            var scope = scopeSelector ? document.querySelector(scopeSelector) : document;
            if (!scope) {
                return;
            }

            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card, .rank-card"));
            var queryInput = panel.querySelector("[data-filter='query']");
            var yearSelect = panel.querySelector("[data-filter='year']");
            var typeSelect = panel.querySelector("[data-filter='type']");
            var regionSelect = panel.querySelector("[data-filter='region']");
            var empty = document.querySelector(panel.getAttribute("data-empty") || "");
            var params = new URLSearchParams(window.location.search);
            var initialQuery = params.get("q");

            if (initialQuery && queryInput) {
                queryInput.value = initialQuery;
            }

            function apply() {
                var query = queryInput ? queryInput.value.trim().toLowerCase() : "";
                var year = yearSelect ? yearSelect.value : "";
                var type = typeSelect ? typeSelect.value : "";
                var region = regionSelect ? regionSelect.value : "";
                var visible = 0;

                cards.forEach(function (card) {
                    var text = (card.getAttribute("data-search") || "").toLowerCase();
                    var cardYear = card.getAttribute("data-year") || "";
                    var cardType = card.getAttribute("data-type") || "";
                    var cardRegion = card.getAttribute("data-region") || "";
                    var matched = true;

                    if (query && text.indexOf(query) === -1) {
                        matched = false;
                    }

                    if (year && cardYear !== year) {
                        matched = false;
                    }

                    if (type && cardType !== type) {
                        matched = false;
                    }

                    if (region && cardRegion !== region) {
                        matched = false;
                    }

                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [queryInput, yearSelect, typeSelect, regionSelect].forEach(function (control) {
                if (!control) {
                    return;
                }
                control.addEventListener("input", apply);
                control.addEventListener("change", apply);
            });

            apply();
        });
    }

    function initPlayer() {
        var players = Array.prototype.slice.call(document.querySelectorAll(".player-card"));
        players.forEach(function (holder) {
            var video = holder.querySelector("video");
            var overlay = holder.querySelector(".player-overlay");
            var src = holder.getAttribute("data-video");
            var hlsInstance = null;
            var prepared = false;

            if (!video || !overlay || !src) {
                return;
            }

            function start() {
                overlay.classList.add("is-hidden");
                video.setAttribute("controls", "controls");

                if (!prepared) {
                    prepared = true;
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = src;
                        video.play().catch(function () {});
                        return;
                    }

                    if (window.Hls && window.Hls.isSupported()) {
                        hlsInstance = new window.Hls({
                            lowLatencyMode: true,
                            backBufferLength: 90
                        });
                        hlsInstance.loadSource(src);
                        hlsInstance.attachMedia(video);
                        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                            video.play().catch(function () {});
                        });
                        return;
                    }

                    video.src = src;
                }

                video.play().catch(function () {});
            }

            overlay.addEventListener("click", start);
            video.addEventListener("click", function () {
                if (video.paused) {
                    start();
                }
            });
            window.addEventListener("beforeunload", function () {
                if (hlsInstance) {
                    hlsInstance.destroy();
                }
            });
        });
    }
})();
