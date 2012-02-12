/**
 * This library is an extension to Backbone that allows you to do nice view navigation.
 * It is
 *
 * User: pwalczys
 * Date: 2/8/12
 * Time: 4:38 PM
 *
 */

(function (root, factory) {
    // Set up BackStack appropriately for the environment.
    if (typeof exports !== 'undefined') {
        // Node/CommonJS, no need for jQuery in that case.
        factory(root, exports, require('underscore'), require('jquery'), require('Backbone'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD
        define(['underscore', 'jquery', 'Backbone', 'exports'],
            function (_, $, Backbone, exports) {
                // Export global even in AMD case in case this script is loaded with
                // others that may still expect a global Backbone.
                root.BackStack = factory(root, exports, _, $, Backbone);
            });
    } else {
        // Browser globals
        root.BackStack = factory(root, {}, root._, root.jQuery, root.Backbone);
    }
}(this, function (root, BackStack, _, $, Backbone) {

    var ViewNavigatorSlideEffect = BackStack.ViewNavigatorSlideEffect = function (viewNavigator) {
        this.viewNavigator = viewNavigator;
    };
    ViewNavigatorSlideEffect.prototype.play = function (hideView, showView, direction, callback, context) {

        var supportedBrowsers = ['webkit', 'moz', 'ms', 'o', ''];
        var hideViewTransitionParams = 'all 0.4s ease-out 0.1s';
        var showViewTransitionParams = 'all 0.4s ease-out 0.1s';

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

                transformsMap['-' + supportedBrowsers[i] + '-transform'] = 'translateX(' + (direction == 'left' ? -this.viewNavigator.width() : this.viewNavigator.width()) + 'px)';

                if (supportedBrowsers[i] != 'ms') transitionEndEvents += ' ' + supportedBrowsers[i] + 'TransitionEnd ';
                else transitionEndEvents += ' MSTransitionEnd ';
            } else {
                clearTransitionsMap['transition'] = '';
                hideViewTransitionsMap['transition'] = hideViewTransitionParams;
                showViewTransitionsMap['transition'] = showViewTransitionParams;

                transformsMap['transform'] = 'translateX(' + (direction == 'left' ? -this.viewNavigator.width() : this.viewNavigator.width()) + 'px)';

                transitionEndEvents += ' transitionend ';
            }
        }

        var slides;
        var activeTransitions = 0;

        var transitionEndHandler = function (event) {
            activeTransitions--;
            $(event.target).css(clearTransitionsMap);

            if (activeTransitions == 0 && callback) {
                callback.call(context);
            }
        };

        if (hideView) {
            hideView.one(transitionEndEvents, transitionEndHandler);
            hideView.css('left', 0);
            hideView.css(hideViewTransitionsMap);

            activeTransitions++;
            slides = hideView;
        }

        if (showView) {
            showView.one(transitionEndEvents, transitionEndHandler);
            showView.css('left', direction == 'left' ? this.viewNavigator.width() : -this.viewNavigator.width());
            showView.css(showViewTransitionsMap);

            this.viewNavigator.append(showView);

            activeTransitions++;
            if (slides) slides = slides.add(showView);
            else slides = showView;
        }

        if (slides) {
            // This is a hack to force DOM reflow before transition starts
            this.viewNavigator.css('width');

            // Trigger transitions
            slides.css(transformsMap);
        }
    };

    var ViewNavigatorEvent = BackStack.ViewNavigatorEvent =
        function (action, oldViewClass, oldView, newViewClass, newView) {

            this.action = action;

            this.oldViewClass = oldViewClass;

            this.oldView = oldView;

            this.newViewClass = newViewClass;

            this.newView = newView;

            var defaultPrevented = false;

            this.preventDefault = function () {
                this.defaultPrevented = true;
            }

            this.isDefaultPrevented = function () {
                return defaultPrevented;
            }
        };

    var View = BackStack.View = Backbone.View.extend({

        viewPath:undefined,

        // Posible options auto or never
        destructionPolicy:"auto",

        viewNavigator:undefined,

        setViewNavigator:function (viewNavigator, navigationOptions) {
            this.viewNavigator = viewNavigator;

            if (navigationOptions) {
                if (navigationOptions.destructionPolicy)
                    this.destructionPolicy = navigationOptions.destructionPolicy;
            }
        }
    });

    BackStack.ViewNavigator = Backbone.View.extend({

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
            showView.setViewNavigator(this, options ? options.navigationOptions : null);

            var event = new ViewNavigatorEvent('push', hideViewRef ? hideViewRef.viewClass : null,
                hideViewRef ? hideViewRef.instance : null, viewClass, showView);
            this.trigger(event.action, event);

            if (!event.isDefaultPrevented()) {
                this.viewsStack.push({instance:showView, viewClass:viewClass, options:options});

                var slideEffect = new ViewNavigatorSlideEffect(this.$el);
                slideEffect.play(hideViewRef ? hideViewRef.instance.$el : null, showView.render().$el, 'left',
                    function () {
                        if (hideViewRef) {
                            if (hideViewRef.instance.destructionPolicy == 'never') {
                                hideViewRef.instance.$el.detach();
                            } else {
                                hideViewRef.instance.$el.remove();
                                hideViewRef.instance = null;
                            }
                        }
                    }, this);
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
                    showViewRef.instance.setViewNavigator(this, showViewRef.options ? showViewRef.options.navigationOptions : null);
                    showViewRef.instance.render();
                }
                var slideEffect = new ViewNavigatorSlideEffect(this.$el);
                slideEffect.play(hideViewRef.instance.$el, showViewRef ? showViewRef.instance.$el : null, 'right',
                    function () {
                        hideViewRef.instance.$el.remove();
                        hideViewRef.instance = null;
                    }, this);
            }
        }
    });

    return BackStack;
}));