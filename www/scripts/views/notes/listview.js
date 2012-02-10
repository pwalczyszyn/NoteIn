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
    'iScroll',
    'dispatcher',
    'collections/notes',
    'text!templates/notes/listview.html!strip',
    'views/notes/notelistitem',
    'models/note'
], function ($, _, BackStack, iScroll, dispatcher, NotesCollection, listViewTemplate, NoteListItem, Note) {

    var ListView = BackStack.View.extend({

        viewPath:'notes/listview',

        destructionPolicy:'never',

        initialize:function (options) {
            this.model = new NotesCollection;
            this.model.fetch({
                success:function () {
                    console.log("success fetching notes")
                },
                error:function () {
                    console.log("error fetching notes")
                }
            }, this);

            this.model.on('reset', this.addAll, this);
            this.model.on('add', this.addOne, this);
        },

        events:{
            "click #btn-add-note":"showEditView"
        },

        render:function () {
            this.$el.html(_.template(listViewTemplate));

            if (!this.listWrapper)
                this.listWrapper = new iScroll(this.$el.find('#lst-notes-wrapper').get(0));

            return this;
        },

        showEditView:function (event, note) {
            if (event)
                event.preventDefault();

            if (!note) {
                note = new Note;
                note.on('sync', this.newNoteSaved, this);
            }
            dispatcher.trigger('navigateTo', 'notes/editview', {model:note});
        },

        newNoteSaved:function (note) {
            note.off('sync', this.newNoteSaved, this);
            this.model.add(note);

            this.listWrapper.refresh();
        },

        addOne:function (note) {
            var view = new NoteListItem({model:note});
            view.on('edit', this.showEditView, this);
            $("#lst-notes").prepend(view.render().el);
        },

        addAll:function () {
            this.model.each(this.addOne, this);

            this.listWrapper.refresh();
        }
    });

    return ListView;
});
