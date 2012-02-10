/**
 * Created by JetBrains PhpStorm.
 * User: pwalczys
 * Date: 2/4/12
 * Time: 5:48 PM
 * To change this template use File | Settings | File Templates.
 */
define(function () {

    function ViewNavigatorEvent(action, oldViewClass, oldView, newViewClass, newView) {

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
    }

    return ViewNavigatorEvent;
})
