/**
 * Created by JetBrains PhpStorm.
 * User: pwalczys
 * Date: 2/3/12
 * Time: 7:04 PM
 * To change this template use File | Settings | File Templates.
 */

define(['jQuery', 'Underscore', 'Backbone'],
    function ($, _, Backbone, module) {
        var View = Backbone.View.extend({

            viewPath:undefined,

            // Posible options auto or never
            destructionPolicy:"auto",

            navigator:undefined,

            setNavigator:function (navigator, navigationOptions) {
                this.navigator = navigator;

                if (navigationOptions) {
                    if (navigationOptions.destructionPolicy)
                        this.destructionPolicy = navigationOptions.destructionPolicy;
                }
            }
        });

        return View;
    });