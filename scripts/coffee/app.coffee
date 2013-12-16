do () ->
    App = App || {}
    App.Models = App.Models || {}
    App.Views = App.Views || {}
    App.Collections = App.Collections || {}
    App.Util = App.Util || {}
    App.Util.Events = _.extend( {}, Backbone.Events )
    App.Util.LoadTemplate= do () ->
        templates = {}
        loaded = false

        buildObj = ( html ) ->
            temps = $( html ).children( 'script' )
            $.each temps, ( index, template ) ->
                templates[template.id] = _.template template.innerHTML.trim()
            loaded = true
            return false

        getTemplate = ( temp ) ->
            if temp in templates
                templates[temp]
            else
                null

        $.ajax
            method: 'GET'
            url: 'templates/templates.html'
            async: false
        .done ( html ) ->
            buildObj html
        .error ( err ) ->
            console.warn "Failed to load Backbone Templates :: " + err.message

        return getTemplate;

    App.Router = Backbone.Router.extend
        routes :
            '' : 'default'
            'about' : 'about'
            'test/:type' : 'test'
            'search/:term' : 'search'

        default : () ->
            mainView = $ '#main-view'
            mainView.children().hide()
            mainView.children( '#default-view' ).show()

        about : () ->
            mainView = $ '#main-view'
            mainView.children().hide()
            mainView.children( '#about-view' ).show()

        test : ( type ) ->
            mainView = $ '#main-view'
            mainView.children().hide()
            mainView.children().children( 'div' ).hide()
            mainView.children( '#test-view' ).show()
            mainView.children( '#test-view' ).children( '#' + type ).show()

        search : () ->
            mainView = $ '#main-view'
            mainView.children().hide()
            mainView.children( '#search-view' ).show()

    new App.Router
    Backbone.history.start();

    window.App = App