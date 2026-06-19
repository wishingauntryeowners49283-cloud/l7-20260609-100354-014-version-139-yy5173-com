(function () {
  function setup(player) {
    var video = player.querySelector('video');
    var startButton = player.querySelector('.player-start');
    if (!video || !startButton) {
      return;
    }

    var source = video.getAttribute('data-hls');
    var prepared = false;
    var hlsInstance = null;

    function prepare() {
      if (prepared || !source) {
        return;
      }
      prepared = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
      video.setAttribute('controls', 'controls');
    }

    function playVideo() {
      prepare();
      var action = video.paused ? video.play() : video.pause();
      if (action && typeof action.catch === 'function') {
        action.catch(function () {
          player.classList.remove('is-playing');
        });
      }
    }

    startButton.addEventListener('click', playVideo);
    video.addEventListener('click', playVideo);
    video.addEventListener('play', function () {
      player.classList.add('is-playing');
    });
    video.addEventListener('pause', function () {
      player.classList.remove('is-playing');
    });
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setup);
})();
