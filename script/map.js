(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  window.Map = Backbone.Model.extend({
    defaults: {
      city: cities['madrid']
    },
    initialize: function() {
      return this.get('lookup').on('change:text', this.matchCity, this);
    },
    matchCity: function() {
      var city, cityKey, matches, text;
      text = this.get('lookup').get('text');
      text = text.replace(/[ _]/, '').toLowerCase();
      matches = [];
      for (cityKey in cities) {
        city = cities[cityKey];
        if (city.city.toLowerCase().indexOf(text) === 0) {
          matches.push(city);
        }
      }
      if (matches.length === 1) {
        this.set('city', matches[0]);
        this.change();
      }
      return matches.length === 1;
    }
  });
  window.MapView = Backbone.View.extend({
    initialize: function() {
      var city, cloudmade, cloudmadeAttrib, cloudmadeUrl;
      this.model.on("change:city", this.pan, this);
      this.component = new L.Map('map', {
        scrollWheelZoom: false
      });
      cloudmadeUrl = 'http://{s}.tile.cloudmade.com/175d37c6a4cb4e4a8e70eecafa085681/997/256/{z}/{x}/{y}.png';
      cloudmadeAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade. http://musicmak.es';
      cloudmade = new L.TileLayer(cloudmadeUrl, {
        maxZoom: 18,
        attribution: cloudmadeAttrib
      });
      city = this.model.get("city");
      return this.component.setView(new L.LatLng(city.lat, city.lon), 6).addLayer(cloudmade);
    },
    pan: function() {
      var city, latlon, offset;
      console.log('view pan', this, this.model, this.component);
      city = this.model.get("city");
      latlon = new L.LatLng(city.lat, city.lon);
      offset = this.component._getNewTopLeftPoint(latlon).subtract(this.component._getTopLeftPoint());
      this.component.panBy(offset);
      this.component.closePopup();
      this.popupView = (new PopupView({
        model: city
      })).component;
      setTimeout((__bind(function() {
        return this.component.openPopup(this.popupView);
      }, this)), 0);
      return console.log('done pan', city, this.popupView);
    },
    keyup: function(keyCode) {
      switch (keyCode) {
        case '=':
          return this.component.zoomIn();
        case '-':
          return this.component.zoomOut();
      }
    },
    invalidateSize: function() {
      return this.component.invalidateSize();
    }
  });
}).call(this);
