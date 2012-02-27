
SC.initialize
  client_id: "c5ac4913db6312866a441ab53e43956b",
  redirect_uri: "http://example.com/callback.html",

window.Player = Backbone.Model.extend
  initialize: ->
    this.get('map').on 'change:city', this.findTrack, this
    console.log 'player', this.get('map')
  findTrack: ->
    player = this
    city = this.get('map').get('city')
    console.log "player.findTrack loading for #{city}"
    $.getJSON "http://api.soundcloud.com/tracks.json?client_id=c5ac4913db6312866a441ab53e43956b&tags=#{city.city}",(tracks) =>
      return console.log 'No tracks' unless tracks.length
      player.set('track', track = sample(tracks))
  togglePause: (val) ->
    this.set('paused', val)

window.PlayerView = Backbone.View.extend
  initialize: ->
    this.model.on 'change:track', this.play, this
    this.model.on 'change:paused', this.togglePause, this
  play: ->
    track = this.model.get('track')
    console.log 'track', track
    SC.whenStreamingReady =>
      console.log 'track id', track.id
      this.sound.stop() if this.sound
      this.sound.play() if this.sound = SC.stream(track.id)
  togglePause: ->
    console.log 'tog pause', this.sound
    if this.sound and this.model.get('paused') then this.sound.pause() else this.sound.play()

window.PlayingView = Backbone.View.extend
  initialize: ->
    this.model.on 'change:track', this.update, this
  update: ->
    track = this.model.get('track')
    $('.playing').html (this.template ?= _.template($('.playingTemplate').html()))(track)
    console.log('SHOW SRC', track.artwork_url)
    # bad leaky abstraction; quickfix for necessary the make happiness of people without instagram accounts
    unless matches = document.location.hash.match('#access_token=(.*)')
      setTimeout($('.citypic').attr('src', track.artwork_url||track.user.avatar_url||'icons/soundcloud.png'), 500) 
