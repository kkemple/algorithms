(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function() {
    var App;
    App = App || {};
    App.Models = App.Models || {};
    App.Views = App.Views || {};
    App.Collections = App.Collections || {};
    App.Util = App.Util || {};
    App.Util.Events = _.extend({}, Backbone.Events);
    App.Util.LoadTemplate = (function() {
      var buildObj, getTemplate, loaded, templates;
      templates = {};
      loaded = false;
      buildObj = function(html) {
        var temps;
        temps = $(html).children('script');
        $.each(temps, function(index, template) {
          return templates[template.id] = _.template(template.innerHTML.trim());
        });
        loaded = true;
        return false;
      };
      getTemplate = function(temp) {
        if (__indexOf.call(templates, temp) >= 0) {
          return templates[temp];
        } else {
          return null;
        }
      };
      $.ajax({
        method: 'GET',
        url: 'templates/templates.html',
        async: false
      }).done(function(html) {
        return buildObj(html);
      }).error(function(err) {
        return console.warn("Failed to load Backbone Templates :: " + err.message);
      });
      return getTemplate;
    })();
    App.Router = Backbone.Router.extend({
      routes: {
        '': 'default',
        'about': 'about',
        'test/:type': 'test',
        'search/:term': 'search'
      },
      "default": function() {
        var mainView;
        mainView = $('#main-view');
        mainView.children().hide();
        return mainView.children('#default-view').show();
      },
      about: function() {
        var mainView;
        mainView = $('#main-view');
        mainView.children().hide();
        return mainView.children('#about-view').show();
      },
      test: function(type) {
        var mainView;
        mainView = $('#main-view');
        mainView.children().hide();
        mainView.children().children('div').hide();
        mainView.children('#test-view').show();
        return mainView.children('#test-view').children('#' + type).show();
      },
      search: function() {
        var mainView;
        mainView = $('#main-view');
        mainView.children().hide();
        return mainView.children('#search-view').show();
      }
    });
    new App.Router;
    Backbone.history.start();
    return window.App = App;
  })();

}).call(this);
