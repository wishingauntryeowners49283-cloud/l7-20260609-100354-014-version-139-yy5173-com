(function () {
    var video = document.querySelector('[data-player]');

    if (!video) {
        return;
    }

    var overlay = document.querySelector('[data-player-overlay]');
    var button = document.querySelector('[data-play-button]');
    var stream = video.getAttribute('data-video') || '';
    var attached = false;

    function attachStream() {
        if (attached || !stream) {
            return;
        }

        attached = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hls.loadSource(stream);
            hls.attachMedia(video);
            video._hlsPlayer = hls;
            return;
        }

        video.src = stream;
    }

    function start(event) {
        if (event) {
            event.preventDefault();
        }

        attachStream();

        if (overlay) {
            overlay.classList.add('is-hidden');
        }

        video.controls = true;
        var playTask = video.play();

        if (playTask && typeof playTask.catch === 'function') {
            playTask.catch(function () {
                video.controls = true;
            });
        }
    }

    if (button) {
        button.addEventListener('click', start);
    }

    if (overlay) {
        overlay.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
        if (!attached) {
            start();
        }
    });
})();
