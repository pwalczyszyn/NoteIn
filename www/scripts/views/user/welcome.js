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
    'text!templates/user/welcome.html!strip'
], function ($, _, BackStack, welcomeTemplate) {

    var WelcomeView = BackStack.View.extend({

        viewPath:'user/welcome',

        render:function () {
            this.$el.html(_.template(welcomeTemplate));
            return this;
        }
    });

    return WelcomeView;
});