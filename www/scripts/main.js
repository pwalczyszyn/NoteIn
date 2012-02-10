/**
 * Created by JetBrains PhpStorm.
 * User: pwalczys
 * Date: 2/1/12
 * Time: 3:37 PM
 * To change this template use File | Settings | File Templates.
 */

require.config({
    paths:{
        jQuery:'libs/jquery/jquery',
        PhoneGap:'libs/phonegap/phonegap',
        underscore:'libs/underscore/underscore',
        Backbone:'libs/backbone/backbone',
        BackStack:'libs/backstack/backstack',
//        underscore:'libs/underscore/underscore-amd-1.3.1',
//        Backbone:'libs/backbone/backbone-amd-0.9.1',
//        BackStack:'libs/backstack/backstack-0.5.0',
        iScroll:'libs/iscroll/iscroll'
    }
});

require([
    'order!PhoneGap',
    'order!jQuery',
    'order!underscore',
    'order!Backbone',
    'order!router'
], function (PhoneGap, $, _, Backbone, router) {
    $.ajaxSetup({
        headers:{
            "X-Parse-Application-Id":"bE1QLQTTGA1qUo4Kcdf2aa1t8vwk9eZLw1WckiBP",
            "X-Parse-REST-API-Key":"j3OTT8kh9IWzibsjZTBH0bOorGstDHKgY5rSHiXD"
        }
    });
    Backbone.history.start();
});