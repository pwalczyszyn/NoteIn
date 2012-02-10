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
    'Backbone',
    'text!templates/notes/notelistitem.html!strip'
], function ($, _, Backbone, noteListItemTemplate) {

    var NoteListItem = Backbone.View.extend({
        tagName:"li",

        events:{
            'click':'editNote'
        },

        initialize:function (options) {
            this.model.bind('change', this.render, this);
        },

        render:function (event) {
            var content = $.trim(this.model.get('content'));
            var newLineIndex = content.indexOf('\n');
            if (newLineIndex > 0)
                content = content.substring(0, newLineIndex);

            var createdAt = new Date(this.model.get('createdAt'));
            var createdAtStr = createdAt.getHours() + ':' + createdAt.getMinutes() + '   ' + createdAt.getDate()
                + '.' + createdAt.getMonth() + '.' + createdAt.getFullYear();

            this.$el.html(_.template(noteListItemTemplate, {content:content, createdAt:createdAtStr}));
            return this;
        },

        editNote:function (target) {
            this.trigger('edit', target, this.model);
        }
    });

    return NoteListItem;
});