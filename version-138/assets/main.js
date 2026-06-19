(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobile = document.querySelector(".mobile-nav");
    if (toggle && mobile) {
      toggle.addEventListener("click", function () {
        mobile.classList.toggle("open");
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (slides.length > 1) {
      var active = 0;
      var show = function (index) {
        active = index;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === active);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === active);
        });
      };
      dots.forEach(function (dot, i) {
        dot.addEventListener("click", function () {
          show(i);
        });
      });
      window.setInterval(function () {
        show((active + 1) % slides.length);
      }, 5200);
    }

    initFilters();
  });

  function initFilters() {
    var grid = document.querySelector(".filter-grid");
    if (!grid) {
      return;
    }

    var input = document.querySelector(".filter-input");
    var year = document.querySelector(".filter-year");
    var type = document.querySelector(".filter-type");
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";

    if (input && query) {
      input.value = query;
    }

    var apply = function () {
      var q = input ? input.value.trim().toLowerCase() : "";
      var y = year ? year.value : "";
      var t = type ? type.value : "";

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-year") || "",
          card.getAttribute("data-type") || ""
        ].join(" ").toLowerCase();
        var okQuery = !q || haystack.indexOf(q) !== -1;
        var okYear = !y || card.getAttribute("data-year") === y;
        var okType = !t || card.getAttribute("data-type") === t;
        card.classList.toggle("is-hidden-card", !(okQuery && okYear && okType));
      });
    };

    if (input) {
      input.addEventListener("input", apply);
    }
    if (year) {
      year.addEventListener("change", apply);
    }
    if (type) {
      type.addEventListener("change", apply);
    }
    apply();
  }
})();

function startMoviePlayer(src) {
  var run = function () {
    var video = document.getElementById("moviePlayer");
    var cover = document.getElementById("playerCover");
    if (!video || !cover || !src) {
      return;
    }

    var loaded = false;
    var playVideo = function () {
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {});
      }
    };

    var load = function () {
      if (loaded) {
        playVideo();
        return;
      }
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
        playVideo();
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true });
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(src);
        });
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          playVideo();
        });
      } else {
        video.src = src;
        playVideo();
      }
    };

    cover.addEventListener("click", function () {
      cover.classList.add("is-hidden");
      load();
    });

    video.addEventListener("play", function () {
      cover.classList.add("is-hidden");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
}
