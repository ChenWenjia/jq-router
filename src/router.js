(function($, window) {
    var router,
        isFirstTime = true,
        defaultRoute,
        events = {
            routeChangeStart: 'router.routeChangeStart',
            routeChangeSucess: 'router.routeChangeSucess'
        },
        render;

    router = (function() {
        var s = {},
            current;

        function onhashchange() {
            var hash = window.location.hash,
                matchedRoute = router.match(hash);

            if (matchedRoute) {
                $(window).trigger(events.routeChangeStart, [matchedRoute]);
                render.processRoute(matchedRoute, s.routes)
                    .then(function() {
                        render.render(current, matchedRoute, s.routes);
                        $(window).trigger(events.routeChangeSucess, [matchedRoute]);
                        current = matchedRoute;
                    });
            }
        }

        s.match = function(url) {
            var s = this,
                route;
            for (var routeName in s.routes) {
                if (!s.routes[routeName].abstract && s.routes[routeName].url === url) {
                    route = s.routes[routeName];
                }
            }
            return route;
        };

        s.setController = function(ctrl) {
            render.setController(ctrl);
            return this;
        };

        s.setData = function(data) {
            var s = this;

            s.routes = {};
            for (var routeName in data) {
                var segments = routeName.split('.'),
                    _routeName = [],
                    url = '',
                    route = s.routes[routeName] = {
                        segments: []
                    };

                for (var i in segments) {
                    _routeName.push(segments[i]);
                    var segment = _routeName.join('.');

                    url += data[segment].url;
                    route.segments.push(segment);
                }
                route.url = url;
                route.templateUrl = data[routeName].templateUrl;
                route.controller = data[routeName].controller;
            }
            return s;
        };

        s.setDefault = function(name) {
            defaultRoute = name;
            return this;
        };

        s.getCurrentRoute = function() {
            return render.getCurrentRoute();
        };

        s.go = function(routeName, params) {
            var s = this;
            routeName = routeName || defaultRoute;
            window.location = s.routes[routeName].url;
            return s;
        };

        s.run = function(viewSelector, routeName, params) {
            var s = this;
            if (isFirstTime) {
                render.setViewSelector(viewSelector);
                $(window).on("hashchange", onhashchange);
                var route = s.match(window.location.hash);
                if (!route) {
                    s.go(routeName, params);
                } else {
                    onhashchange();
                }
                isFirstTime = false;
            }
        };

        return s;
    }());


    render = (function() {
        var s = {},
            templateCache = {},
            controller,
            viewSelector;

        s.setController = function(ctrl) {
            controller = ctrl;
        };

        s.setViewSelector = function(selector) {
            viewSelector = selector;
            return this;
        };

        s.getViewTemplate = function(url) {
            return $.get(url, "html")
                .then(function(content) {
                    templateCache[url] = content;
                });
        };

        s.processRoute = function(route, routes) {
            var s = this,
                requests = [];

            for (var i in route.segments) {
                var segment = route.segments[i],
                    _route = routes[segment];

                if (!templateCache[_route.templateUrl]) {
                    requests.push(s.getViewTemplate(_route.templateUrl));
                }
            }

            return $.when.apply($, requests);
        };

        s.render = function(current, route, routes) {
            for (var i in route.segments) {
                var segment = route.segments[i],
                    _route = routes[segment],
                    $page = $(viewSelector + ':eq(' + i + ')');
                if (!current || route.segments[i] !== current.segments[i]) {
                    $page.html(templateCache[_route.templateUrl]);
                    if (controller.is(_route.controller)) {
                        controller.get(_route.controller).init();
                    }
                }
            }
        };

        return s;
    }());

    $.router = router;
}(jQuery, this));