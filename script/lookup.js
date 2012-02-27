(function() {
  window.Lookup = Backbone.Model.extend({
    defaults: {
      text: ''
    }
  });
  window.LookupView = Backbone.View.extend({
    events: {
      'keyup': 'update',
      'blur': 'finish'
    },
    tagName: 'input',
    className: 'lookup',
    initialize: function() {
      var me;
      me = this;
      return $('#startLookup').click(function() {
        console.log('me', $(me.el));
        return $(me.el).fadeIn().focus() && me.model.set('active', true);
      });
    },
    update: function(ev) {
      this.model.set('text', $(this.el).val());
      if (_(['return', 'escape']).include(keyCodes[ev.which])) {
        return this.finish();
      }
    },
    finish: function(ev) {
      $(this.el).hide().val('');
      return this.model.set('active', false);
    }
  });
}).call(this);
