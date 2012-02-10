/**
 * Created by JetBrains PhpStorm.
 * User: pwalczys
 * Date: 2/1/12
 * Time: 4:35 PM
 * To change this template use File | Settings | File Templates.
 */

define([
    'underscore',
    'Backbone'
], function (_, Backbone) {

    var User = Backbone.Model.extend({

        idAttribute:"objectId",

        url:"https://api.parse.com/1/users",

        defaults:{
//            username:"",
//            password:""
            username:"piotr.walczyszyn@gmail.com",
            password:"admin1"
        },

        validate:function (attrs) {
            var errors = {};

            if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(attrs.username))
                errors.username = "Wrong username name!";

            if (!attrs.password || attrs.password.length < 6)
                errors.password = "Password to short!";

            if (Object.keys(errors).length > 0)
                return errors;
        }
    });

    return new User;
});