window.PopupView = Backbone.View.extend
  initialize: ->

    $('.connectInstagram').click (ev) ->
      document.location.href = "https://instagram.com/oauth/authorize/?client_id=001bbed14598419483fbf4197ee31cef&" +
        "redirect_uri=#{document.location.origin}#{document.location.pathname}&response_type=token"

    city = this.model
    this.component = new L.Popup()
    this.component.setLatLng(new L.LatLng(city.lat, city.lon))
    this.popupTemplate ?= _.template($('.popupTemplate').html())
    this.component.setContent(this.popupTemplate(city))
    console.log('comp',this.component)

    if matches = document.location.hash.match('#access_token=(.*)')
      instagramToken = matches[1]
      $.getJSON "https://api.instagram.com/v1/media/search?"+
                "lat=#{city.lat}&lng=#{city.lon}&access_token=#{instagramToken}&callback=?", (response) ->
        console.log 'instagram response',response
        if response.data and photo = sample(response.data)
          console.log "ph", photo.images.low_resolution.url
          $('.citypic').attr('src', photo.images.low_resolution.url).click ->
            $instamodal = $('<img class="modal"/>').attr('src', photo.images.standard_resolution.url).appendTo('body')
            $instamodal.modal()
          $('.showing').html (this.showingTemplate ?= _.template($('.showingTemplate').html()))(photo)
        else
          $('.instagramWrapper').hide()
