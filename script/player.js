(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  SC.initialize({
    client_id: "c5ac4913db6312866a441ab53e43956b",
    redirect_uri: "http://example.com/callback.html"
  });
  window.Player = Backbone.Model.extend({
    initialize: function() {
      this.get('map').on('change:city', this.findTrack, this);
      return console.log('player', this.get('map'));
    },
    findTrack: function() {
      var city, player;
      player = this;
      city = this.get('map').get('city');
      console.log("player.findTrack loading for " + city);
      return $.getJSON("http://api.soundcloud.com/tracks.json?client_id=c5ac4913db6312866a441ab53e43956b&tags=" + city.city, __bind(function(tracks) {
        var track;
        if (!tracks.length) {
          return console.log('No tracks');
        }
        return player.set('track', track = sample(tracks));
      }, this));
    },
    togglePause: function(val) {
      return this.set('paused', val);
    }
  });
  window.PlayerView = Backbone.View.extend({
    initialize: function() {
      this.model.on('change:track', this.play, this);
      return this.model.on('change:paused', this.togglePause, this);
    },
    play: function() {
      var track;
      track = this.model.get('track');
      console.log('track', track);
      return SC.whenStreamingReady(__bind(function() {
        console.log('track id', track.id);
        if (this.sound) {
          this.sound.stop();
        }
        if (this.sound = SC.stream(track.id)) {
          return this.sound.play();
        }
      }, this));
    },
    togglePause: function() {
      console.log('tog pause', this.sound);
      if (this.sound && this.model.get('paused')) {
        return this.sound.pause();
      } else {
        return this.sound.play();
      }
    }
  });
  window.PlayingView = Backbone.View.extend({
    initialize: function() {
      return this.model.on('change:track', this.update, this);
    },
    update: function() {
      var matches, track, _ref;
      track = this.model.get('track');
      $('.playing').html(((_ref = this.template) != null ? _ref : this.template = _.template($('.playingTemplate').html()))(track));
      console.log('SHOW SRC', track.artwork_url);
      if (!(matches = document.location.hash.match('#access_token=(.*)'))) {
        return setTimeout($('.citypic').attr('src', track.artwork_url || track.user.avatar_url || 'icons/soundcloud.png'), 500);
      }
    }
  });
}).call(this);
