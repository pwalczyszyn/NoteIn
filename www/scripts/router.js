/**
 * Created by JetBrains PhpStorm.
 * User: pwalczys
 * Date: 2/1/12
 * Time: 3:57 PM
 * To change this template use File | Settings | File Templates.
 */

define([
    'jQuery',
    'underscore',
    'Backbone',
    'dispatcher',
    'require',
    'BackStack'
], function ($, _, Backbone, dispatcher, require, BackStack) {

    var currentView;
    var AppRouter = Backbone.Router.extend({

        navigator:undefined,

        routes:{
            // Define some URL routes
            "":"appInit",
            '*actions':'defaultRoute'
        },

        defaultRoute:function (fragment) {
            console.log('Rendering: ' + fragment);
            this.renderView(fragment);
        },

        initialize:function (options) {
            var ViewNavigator = BackStack.ViewNavigator;
            this.navigator = new ViewNavigator({id:'view-navigator-container'});
            this.navigator.on('push pop', function (event) {
                // Setting url based on the view path
                this.navigate(event.newView ? event.newView.viewPath : "", false);
            }, this);
            $('body').html(this.navigator.el);

            dispatcher.on("navigateTo",
                function (fragment, viewOptions) {
                    // Rendering view based on received fragment
                    this.renderView(fragment, viewOptions);
                },
                this);
        },

        appInit:function () {

//            localStorage.clear();

            var cloudSync = localStorage.getItem("cloudSync");

            if (cloudSync == undefined) {
                // Show welcome view
                this.renderView('user/welcome');
            } else if (cloudSync) {
                // Go to login view
//                this.showLogIn();
                this.renderView('user/login');
            } else {
                // Go to notes list view
            }
        },

        renderView:function (viewFragment, viewOptions) {
            var viewClassPath = 'views/' + viewFragment;
            require(['router', viewClassPath],
                function (router, ViewClass) {
                    router.navigator.pushView(ViewClass, viewOptions);
                });
        }
    });

    return new AppRouter();
});