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

    var Note = Backbone.Model.extend({
        idAttribute:"objectId",

        urlRoot:"https://api.parse.com/1/classes/Note",

        defaults:{
            content:""
        },

        dirty:false,

        /**
         * This is an override to send only content data when updating.
         *
         * @param method
         * @param model
         * @param options
         */
        sync:function (method, model, options) {
            if (method == 'update') {
                options.contentType = 'application/json';
                options.data = JSON.stringify({content:this.get('content')});
            }

            Backbone.sync.call(this, method, model, options);
        }
    });

    return Note;
});