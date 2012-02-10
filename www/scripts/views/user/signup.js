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
    'text!templates/user/signup.html!strip'
], function ($, _, BackStack, dispatcher, user, signUpTemplate) {

    var SignUpView = BackStack.View.extend({

        viewPath:'user/signup',

        events:{
            "change input":"change",
            "click #btn-signup":"signUp"
        },

        render:function () {
            $(this.el).html(_.template(signUpTemplate));
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

        signUp:function (event) {
            event.preventDefault();

            user.on('sync', this.signUpSuccess, this);
            user.on('error', this.signUpError, this);
            user.save();
        },

        signUpSuccess:function (model, response) {
            model.off('sync', this.signUpSuccess, this);
            model.off('error', this.signUpError, this);

            console.log("Saved success!");

            dispatcher.trigger('navigateTo', 'notes/listview');
        },

        signUpError:function (model, response) {
            model.off('sync', this.signUpSuccess, this);
            model.off('error', this.signUpError, this);

            console.log("Saved error!");
        }
    });

    return SignUpView;
});