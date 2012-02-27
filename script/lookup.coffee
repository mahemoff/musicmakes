window.Lookup = Backbone.Model.extend
  defaults:
    text: ''

window.LookupView = Backbone.View.extend
  events:
    'keyup': 'update'
    'blur': 'finish'
  tagName: 'input'
  className: 'lookup'
  initialize: ->
    me = this
    $('#startLookup').click ->
      console.log 'me', $(me.el)
      $(me.el).fadeIn().focus()  and me.model.set('active', true)
  update: (ev) ->
    this.model.set('text', $(this.el).val())
    this.finish() if _(['return', 'escape']).include(keyCodes[ev.which])
  finish: (ev) ->
    $(this.el).hide().val('')
    this.model.set('active', false)
