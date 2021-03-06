(function($) {

    var routes = {},
        defaultRoute = 'home';

    routes['home'] = {
        url: '#/',
        templateUrl: 'templates/advance/home.html'
    };

    routes['about'] = {
        url: '#/about',
        templateUrl: 'templates/advance/about.html'
    };

    routes['gallery'] = {
        abstract: true,
        url: '#/gallery',
        templateUrl: 'templates/advance/gallery.html'
    };

    routes['gallery.dashboard'] = {
        url: '',
        templateUrl: 'templates/advance/gallery_dashboard.html'
    };

    routes['gallery.portfolio'] = {
        url: '/portfolio/:portfolioId',
        templateUrl: 'templates/advance/portfolio.html'
    };

    routes['contact'] = {
        url: '#/contact',
        templateUrl: 'templates/advance/contact.html'
    };

    $.router
        .setData(routes)
        .setDefault(defaultRoute);

    $.when($.ready)
        .then(function() {
            $.router.run('.my-view', 'home');
        });

}(jQuery));