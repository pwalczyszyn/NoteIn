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
    'models/note',
    'text!templates/notes/editview.html!strip'
], function ($, _, BackStack, dispatcher, user, Note, addPageTemplate) {

    var EditView = BackStack.View.extend({

        viewPath:'notes/editview',

        events:{
            "click #btn-save-note":"saveNote",
            'change #txt-note-content':'contentChanged'
        },

        render:function () {
            $(this.el).html(_.template(addPageTemplate, this.model.toJSON()));
            return this;
        },

        contentChanged:function (target) {

            this.model.dirty = true;

        },

        saveNote:function (event) {

            if (this.model.isNew()) {
                var acl = {};
                acl[user.get('objectId')] = { "read":true, "write":true };
                this.model.set('ACL', acl);
                this.model.set('content', $('#txt-note-content').val());
                this.model.save();
            } else {
                this.model.save('content', $('#txt-note-content').val());
            }

            this.viewNavigator.popView();
        }
    });

    return EditView;
});