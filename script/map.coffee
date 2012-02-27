# todo set place automatically from city
window.Map = Backbone.Model.extend
  defaults:
    city: cities['madrid']
  initialize: ->
    this.get('lookup').on 'change:text', this.matchCity, this
      # console.log('changed text', arguments)
      # city = this.matchCity(text)
  matchCity: ->
    text = this.get('lookup').get('text')
    text = text.replace(/[ _]/, '').toLowerCase()
    matches = []
    for cityKey, city of cities
      matches.push(city) if city.city.toLowerCase().indexOf(text)==0
    if matches.length==1
      # this.set('place', new L.LatLng(matches[0].lat, matches[0].lon))
      this.set('city', matches[0])
      this.change()
    return matches.length==1
    # this.set('place', new L.LatLng(matches[0].lat, matches[0].lon)) and console.log('matched') if matches.length==1

window.MapView = Backbone.View.extend
  initialize: ->
    # this.model.on "change:interactive", this.updateFocus, this
    this.model.on("change:city", this.pan, this)
    this.component = new L.Map('map', { scrollWheelZoom: false })
    cloudmadeUrl = 'http://{s}.tile.cloudmade.com/175d37c6a4cb4e4a8e70eecafa085681/997/256/{z}/{x}/{y}.png'
    cloudmadeAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade. http://musicmak.es'
    cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib})
    city = this.model.get("city")
    this.component.setView(new L.LatLng(city.lat,city.lon), 6).addLayer(cloudmade)
  pan: ->
    console.log 'view pan', this, this.model, this.component
    city = this.model.get("city")
    latlon = new L.LatLng(city.lat, city.lon)
    # this.component.panTo latlon
    offset = this.component._getNewTopLeftPoint(latlon).subtract(this.component._getTopLeftPoint())
    this.component.panBy(offset)

    this.component.closePopup()
    this.popupView = (new PopupView({model: city})).component
    setTimeout((=> this.component.openPopup(this.popupView)), 0)
    console.log 'done pan', city, this.popupView
  keyup: (keyCode) ->
    switch keyCode
      when '=' then this.component.zoomIn()
      when '-' then this.component.zoomOut()
  invalidateSize: ->
    this.component.invalidateSize()
