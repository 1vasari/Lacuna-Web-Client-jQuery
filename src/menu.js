define(['jquery', 'lacuna', 'template', 'login', 'mapPlanet', 'mapStars', 'body', 'buildings', 'queue'], function($, Lacuna, Template, Login, MapPlanet, MapStars, Body, Buildings, Queue) {
    function Menu() {
        // Helper for jQuery's weird scope management.
        var scope = this;

        this.renderMenu = function() {
            $('#menu_to_starmap').on({
                click: function(e) {
                    $('#buildingsParent').css('visibility', 'hidden');
                    $('#starsParent').css('visibility', 'visible');
                    $('#lacuna').css('background-image', "url('" + window.assetsUrl + "/star_system/field.png')");
                    $('#menu_to_starmap').css('visibility', 'hidden');
                    $('#menu_to_planetmap').css('visibility', 'visible');
                    MapStars.renderStars();
                }
            });
            $('#menu_to_planetmap').on({
                click: function(e) {
                    $('#buildingsParent').css('visibility', 'visible');
                    $('#starsParent').css('visibility', 'hidden');
                    $('#lacuna').css('background-image', "url('" + window.assetsUrl + "/star_system/field.png')");
                    $('#menu_to_starmap').css('visibility', 'visible');
                    $('#menu_to_planetmap').css('visibility', 'hidden');
                    // Fire the callbacks to redisplay the planet image
                    Body.backgroundCallbackFire();
                }
            });
            $('#menu_logout').on({
                click: function(e) {
                    Lacuna.send({
                        module: '/empire',
                        method: 'logout',

                        params: [
                            Lacuna.getSession()
                        ],

                        success: function(o) {
                            Lacuna.hidePulser();
                            
                            // Remove the session cookie.
                            $.cookie.destroy('lacuna-expanse-session');
                            
                            // Delete all the status data to avoid "confusion."
                            delete Lacuna.status;

                            // Clear all the buildings data.
                            Buildings.buildings = {};
                            MapPlanet.renderPlanet();

                            // Kill everything in the queue.
                            Queue.killall();

                            $('#gameHeader, #gameFooter, #buildingsParent').css('visibility', 'hidden');
                            $('#starsParent').css('visibility', 'visible');

                            Login.start();
                        }
                    });
                }
            });
        };
    }

    return new Menu();
});