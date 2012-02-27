(function() {
  window.PopupView = Backbone.View.extend({
    initialize: function() {
      var city, instagramToken, matches, _ref;
      $('.connectInstagram').click(function(ev) {
        return document.location.href = "https://instagram.com/oauth/authorize/?client_id=001bbed14598419483fbf4197ee31cef&" + ("redirect_uri=" + document.location.origin + document.location.pathname + "&response_type=token");
      });
      city = this.model;
      this.component = new L.Popup();
      this.component.setLatLng(new L.LatLng(city.lat, city.lon));
      if ((_ref = this.popupTemplate) == null) {
        this.popupTemplate = _.template($('.popupTemplate').html());
      }
      this.component.setContent(this.popupTemplate(city));
      console.log('comp', this.component);
      if (matches = document.location.hash.match('#access_token=(.*)')) {
        instagramToken = matches[1];
        return $.getJSON("https://api.instagram.com/v1/media/search?" + ("lat=" + city.lat + "&lng=" + city.lon + "&access_token=" + instagramToken + "&callback=?"), function(response) {
          var photo, _ref2;
          console.log('instagram response', response);
          if (response.data && (photo = sample(response.data))) {
            console.log("ph", photo.images.low_resolution.url);
            $('.citypic').attr('src', photo.images.low_resolution.url).click(function() {
              var $instamodal;
              $instamodal = $('<img class="modal"/>').attr('src', photo.images.standard_resolution.url).appendTo('body');
              return $instamodal.modal();
            });
            return $('.showing').html(((_ref2 = this.showingTemplate) != null ? _ref2 : this.showingTemplate = _.template($('.showingTemplate').html()))(photo));
          } else {
            return $('.instagramWrapper').hide();
          }
        });
      }
    }
  });
}).call(this);
