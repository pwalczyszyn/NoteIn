/**
 * Created by JetBrains PhpStorm.
 * User: pwalczys
 * Date: 2/3/12
 * Time: 7:04 PM
 * To change this template use File | Settings | File Templates.
 */

define(['jQuery', 'Underscore', 'Backbone', 'navigator/ViewNavigatorEvent' ],
    function ($, _, Backbone, ViewNavigatorEvent) {

        var ViewNavigatorSlideEffect = function (navigator) {
            this.navigator = navigator;
        };
        ViewNavigatorSlideEffect.prototype.play = function (hideView, showView, action) {

            var supportedBrowsers = ['webkit', 'moz', 'ms', 'o', ''];
            var hideViewTransitionParams = 'all 0.5s linear 0.1s';
            var showViewTransitionParams = 'all 0.5s linear 0.1s';

            var clearTransitionsMap = {};
            var hideViewTransitionsMap = {};
            var showViewTransitionsMap = {};

            var transformsMap = {};

            var transitionEndEvents = '';

            for (var i = 0; i < supportedBrowsers.length; i++) {
                if (supportedBrowsers[i] != '') {
                    clearTransitionsMap['-' + supportedBrowsers[i] + '-transition'] = '';
                    hideViewTransitionsMap['-' + supportedBrowsers[i] + '-transition'] = hideViewTransitionParams;
                    showViewTransitionsMap['-' + supportedBrowsers[i] + '-transition'] = showViewTransitionParams;

                    transformsMap['-' + supportedBrowsers[i] + '-transform'] = 'translateX(' + (action == 'push' ? -this.navigator.width() : this.navigator.width()) + 'px)';

                    if (supportedBrowsers[i] != 'ms') transitionEndEvents += ' ' + supportedBrowsers[i] + 'TransitionEnd ';
                    else transitionEndEvents += ' MSTransitionEnd ';
                } else {
                    clearTransitionsMap['transition'] = '';
                    hideViewTransitionsMap['transition'] = hideViewTransitionParams;
                    showViewTransitionsMap['transition'] = showViewTransitionParams;

                    transformsMap['transform'] = 'translateX(' + (action == 'push' ? -this.navigator.width() : this.navigator.width()) + 'px)';

                    transitionEndEvents += ' transitionend ';
                }
            }

            if (hideView) {

                hideView.$el.one(transitionEndEvents, function (event) {
                    hideView.$el.css(clearTransitionsMap);

                    if (hideView.destructionPolicy == 'never') {
                        hideView.$el.detach();

                    } else {
                        hideView.$el.remove();
                        hideView.instance = null;
                    }
                });

                hideView.$el.css('left', 0);
                hideView.$el.css(hideViewTransitionsMap);
                hideView.$el.css(transformsMap);
            }

            if (showView) {

                showView.$el.one(transitionEndEvents, function (event) {
                    showView.$el.css(clearTransitionsMap);
                });

                if (action == 'push') {
                    showView.$el.css('left', this.navigator.width());
                } else {
                    showView.$el.css('left', -this.navigator.width());
                }
                this.navigator.append(showView.$el);

                // This is a hack, for some reason it doesn't work without calling width
                this.navigator.css('width');

                showView.$el.css(showViewTransitionsMap);
                showView.$el.css(transformsMap);
            }
        }

        var ViewNavigator;
        ViewNavigator = Backbone.View.extend({

            tagName:'div',

            viewsStack:new Array(),

            initialize:function (options) {
                if (options && options.firstView)
                    this.pushView(options.firstView, options.firstViewOptions);
            },

            pushView:function (viewClass, options) {
                var showView, hideViewRef;

                if (this.viewsStack.length > 0)
                    hideViewRef = this.viewsStack[this.viewsStack.length - 1];

                showView = new viewClass(options);
                showView.setNavigator(this, options ? options.navigationOptions : null);

                var event = new ViewNavigatorEvent('push', hideViewRef ? hideViewRef.viewClass : null,
                    hideViewRef ? hideViewRef.instance : null, viewClass, showView);
                this.trigger(event.action, event);

                if (!event.isDefaultPrevented()) {
                    this.viewsStack.push({instance:showView, viewClass:viewClass, options:options});

                    var slideEffect = new ViewNavigatorSlideEffect(this.$el);
                    slideEffect.play(hideViewRef ? hideViewRef.instance : null, showView.render(), 'push');
                }
            },

            popView:function () {
                var showViewRef, hideViewRef;
                if (this.viewsStack.length > 0)
                    hideViewRef = this.viewsStack[this.viewsStack.length - 1];

                if (this.viewsStack.length > 1)
                    showViewRef = this.viewsStack[this.viewsStack.length - 2];

                var event = new ViewNavigatorEvent('pop',
                    hideViewRef ? hideViewRef.viewClass : null, hideViewRef ? hideViewRef.instance : null,
                    showViewRef ? showViewRef.viewClass : null, showViewRef ? showViewRef.instance : null);
                this.trigger(event.action, event);

                if (!event.isDefaultPrevented()) {
                    this.viewsStack.pop();

                    if (showViewRef && !showViewRef.instance) {
                        var viewClass = showViewRef.viewClass;
                        showViewRef.instance = new viewClass(showViewRef.options);
                        showViewRef.instance.setNavigator(this, showViewRef.options ? showViewRef.options.navigationOptions : null);
                        showViewRef.instance.render();
                    }
                    var slideEffect = new ViewNavigatorSlideEffect(this.$el);
                    slideEffect.play(hideViewRef.instance, showViewRef ? showViewRef.instance : null, 'pop');
                }
            }
        });

        return ViewNavigator;
    });