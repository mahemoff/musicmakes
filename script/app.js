(function() {
  var city, cityList, key, lookup, lookupView, map, mapView, paused, player, rotator;
  cityList = [];
  for (key in cities) {
    city = cities[key];
    cityList.push(city);
  }
  lookup = map = mapView = lookupView = player = null;
  paused = false;
  console.log('START');
  $(function() {
    var fullScreenEnabled, playerView, playingView;
    lookup = new Lookup;
    map = new Map({
      lookup: lookup
    });
    window.mv = mapView = new MapView({
      el: $('.map'),
      model: map
    });
    lookupView = new LookupView({
      el: $('.lookup'),
      model: lookup,
      mapView: mapView,
      testing: 8
    });
    player = new window.Player({
      map: map
    });
    console.log('player', player);
    playerView = new window.PlayerView({
      model: player
    });
    playingView = new window.PlayingView({
      model: player
    });
    lookup.on('change:active', function() {
      console.log('active', lookup.get('active'), arguments);
      if (lookup.get('active')) {
        return rotator.loop();
      } else {
        return rotator.freeze();
      }
    });
    $('.map').resizable();
    console.log('RANDOM');
    $('#randomCity').click(function(ev) {
      rotator.freeze();
      map.set('city', sample(cityList));
      rotator.loop();
      return ev.stopPropagation();
    });
    fullScreenEnabled = typeof document.webkitCancelFullScreen !== 'undefined';
    $('#fullScreen').click(function(ev) {
      var delay, _i, _len, _ref, _results;
      if (fullScreenEnabled) {
        if ($('body:-webkit-full-screen').length) {
          document.webkitCancelFullScreen();
        } else {
          document.body.webkitRequestFullScreen();
        }
      } else {
        console.log('full not enabled');
        if ($('body').hasClass('fullScreen')) {
          $('body').removeClass('fullScreen');
        } else {
          $('body').addClass('fullScreen');
        }
      }
      mapView.invalidateSize();
      _ref = [1000, 2000, 3000];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        delay = _ref[_i];
        _results.push(setTimeout(mapView.invalidateSize, delay));
      }
      return _results;
    });
    /*
      $('body').on 'webkitfullscreenchange', ->
        console.log 'IS FULL?', document.webkitIsFullScreen
        if document.webkitIsFullScreen
          $('body').addClass('fullScreen')
        else
          $('body').removeClass('fullScreen')
        mapView.invalidateSize()
      */
    $('#pauseAll').click(function(ev) {
      console.log('pausd', paused);
      paused = !paused;
      if (paused) {
        rotator.freeze();
        player.togglePause(true);
      } else {
        rotator.loop();
        player.togglePause(false);
      }
      return ev.stopPropagation();
    });
    map.set('city', cities['barcelona']);
    rotator.loop();
    return $('.navbar').scrollspy();
  });
  rotator = {
    loop: function() {
      console.log("rot", $('.delay').val());
      return this.timer = window.setTimeout(this.rotate, 1000 * $('.delay').val());
    },
    freeze: function() {
      return clearTimeout(this.timer);
    },
    rotate: function() {
      var index;
      city = map.get('city');
      index = -1;
      _(cityList).find(function(city) {
        index = (index + 1) % cityList.length;
        return city === map.get('city');
      });
      city = cityList[index + 1];
      map.set('city', city);
      return rotator.loop();
    }
  };
}).call(this);
