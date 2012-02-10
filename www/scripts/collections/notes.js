/**
 * Created by JetBrains PhpStorm.
 * User: pwalczys
 * Date: 2/1/12
 * Time: 4:35 PM
 * To change this template use File | Settings | File Templates.
 */

define([
    'underscore',
    'Backbone',
    'models/note'
], function (_, Backbone, Note) {
    var NotesCollection = Backbone.Collection.extend({

        model:Note,

        url:"https://api.parse.com/1/classes/Note",

        parse:function (response) {
            return response.results;
        }
    });

    return NotesCollection;
});