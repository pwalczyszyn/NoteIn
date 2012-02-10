/**
 * Created by JetBrains PhpStorm.
 * User: pwalczys
 * Date: 2/1/12
 * Time: 3:46 PM
 * To change this template use File | Settings | File Templates.
 */

define([
    'underscore',
    'Backbone'
], function (_, Backbone) {
    return _.clone(Backbone.Events);
});