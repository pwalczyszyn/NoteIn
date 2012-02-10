/**
 * Created by JetBrains PhpStorm.
 * User: pwalczys
 * Date: 2/1/12
 * Time: 4:08 PM
 * To change this template use File | Settings | File Templates.
 */

define([
    'jQuery',
    'underscore',
    'BackStack',
    'dispatcher',
    'models/user',
    'text!templates/progress.html!strip',
    'text!templates/user/login.html!strip'
], function ($, _, BackStack, dispatcher, user, progressTemplate, logInTemplate) {

    var LogInView = BackStack.View.extend({

        viewPath:'user/login',

        events:{
            "change input":"change",
            "click #btn-login":"logIn"
        },

        render:function () {
            var username = localStorage.getItem("username");
            var password = localStorage.getItem("password");

            if (username && password) {
                user.set({username:username, password:password});
                this.logIn();

            } else {
                this.$el.html(_.template(logInTemplate, user.toJSON()));
            }

            return this;
        },

        change:function (event) {
            var error;
            var change = {};
            var target = event.target;

            change[target.id] = target.value;
            user.set(change, {
                error:function (model, errors) {
                    error = errors[target.id];
                }
            });

            if (error == undefined) {
                $(target).removeClass("input-error")
            }
            else {
                $(target).addClass("input-error");
            }
        },

        logIn:function (event) {
            if (event)
                event.preventDefault();

            this.$el.html(_.template(progressTemplate, {message:"Authorizing user..."}));

            user.on('change', this.logInSuccess, this);
            user.on('error', this.logInError, this);

            user.fetch({url:"https://api.parse.com/1/login", data:user.toJSON()});
        },

        logInSuccess:function (model, response) {
            model.off('change', this.logInSuccess, this);
            model.off('error', this.logInError, this);

            // TODO: clear this when log out
            $.ajaxSetup({headers:{"X-Parse-Session-Token":model.get('sessionToken')}});

            localStorage.setItem('cloudSync', true);
            localStorage.setItem('username', model.get('username'));
            localStorage.setItem('password', model.get('password'));

            dispatcher.trigger('navigateTo', 'notes/listview');
        },

        logInError:function (model, error) {
            model.off('change', this.logInSuccess, this);
            model.off('error', this.logInError, this);

            this.$el.html(_.template(logInTemplate, user.toJSON()));
        }
    });

    return LogInView;
});