cityList = []
cityList.push city for key, city of cities
lookup=map=mapView=lookupView=player=null
paused = false

console.log 'START'

$ ->
  lookup = new Lookup
  map = new Map
    lookup: lookup
  window.mv = mapView = new MapView
    el: $('.map')
    model: map
  lookupView = new LookupView
    el: $('.lookup')
    model: lookup
    mapView: mapView
    testing: 8
  player = new window.Player
    map: map
  console.log 'player', player
  playerView = new window.PlayerView
    model: player
  playingView = new window.PlayingView
    model: player

  lookup.on 'change:active', ->
    console.log 'active', lookup.get('active'), arguments
    if lookup.get('active') then rotator.loop() else rotator.freeze()

  $('.map').resizable()

  console.log 'RANDOM'

  $('#randomCity').click (ev) ->
    rotator.freeze()
    map.set('city', sample(cityList))
    rotator.loop()
    ev.stopPropagation()

  fullScreenEnabled = (typeof(document.webkitCancelFullScreen)!='undefined')
  $('#fullScreen').click (ev) ->
    if fullScreenEnabled
      if $('body:-webkit-full-screen').length
        document.webkitCancelFullScreen()
      else
        document.body.webkitRequestFullScreen() 
    else # oh well, at least we can big up the map
      console.log('full not enabled')
      if $('body').hasClass('fullScreen')
        $('body').removeClass('fullScreen')
      else
        $('body').addClass('fullScreen')
    mapView.invalidateSize()
    setTimeout(mapView.invalidateSize, delay) for delay in [1000,2000,3000] # Map JS needs actual size
  ###
  $('body').on 'webkitfullscreenchange', ->
    console.log 'IS FULL?', document.webkitIsFullScreen
    if document.webkitIsFullScreen
      $('body').addClass('fullScreen')
    else
      $('body').removeClass('fullScreen')
    mapView.invalidateSize()
  ###
    # if document.webkitIsFullScreen then document.webkitCancelFullScreen() else document.body.webkitRequestFullScreen() mapView.invalidateSize()

  $('#pauseAll').click (ev) ->
    console.log 'pausd', paused
    paused = !paused
    if paused
      rotator.freeze()
      player.togglePause(true)
    else
      rotator.loop()
      player.togglePause(false)
    ev.stopPropagation()

  map.set('city', cities['barcelona'])
  rotator.loop()

  $('.navbar').scrollspy()

rotator =
  loop: -> console.log("rot", $('.delay').val()); this.timer = window.setTimeout(this.rotate, 1000*$('.delay').val())
  freeze: -> clearTimeout this.timer
  rotate: ->
    city = map.get 'city'
    index = -1
    _(cityList).find (city) ->
      index = (index + 1) % cityList.length
      return city == map.get 'city'
    city = cityList[index+1]
    map.set 'city', city
    # map.set 'place', new L.LatLng(city.lat, city.lon)
    rotator.loop()
