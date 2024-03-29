'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var History = require('@watch-state/history-api');
var Router = require('../Router/Router.js');

var RedirectDefaultProp = {
    url: '',
    path: '',
    hash: '',
    children: null
};
var Redirect = /** @class */ (function (_super) {
    tslib.__extends(Redirect, _super);
    function Redirect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Redirect.redirect = function () {
        if (Redirect.data) {
            var _a = Redirect.data, path = _a.path, search = _a.search, hash = _a.hash, position = _a.position, scrollFirst = _a.scrollFirst, push = _a.push;
            var url = path + search + hash;
            delete Redirect.data;
            if (Router.history.url !== url) {
                Router.history[push ? 'push' : 'replace'](url, position, scrollFirst);
            }
        }
    };
    Redirect.prototype.componentDidMount = function () {
        Redirect.redirect();
    };
    Redirect.prototype.componentDidUpdate = function () {
        Redirect.redirect();
    };
    Object.defineProperty(Redirect.prototype, "data", {
        get: function () {
            var _a = this.props, url = _a.url, path = _a.path, search = _a.search, hash = _a.hash, push = _a.push, position = _a.position, scrollFirst = _a.scrollFirst;
            if (url.startsWith('http')) {
                location.href = url;
                return;
            }
            var _b = Redirect.data, data = _b === void 0 ? {
                path: Router.history.path,
                search: location.search,
                hash: location.hash,
                position: 0,
                push: false,
                scrollFirst: false
            } : _b;
            if (url) {
                var parsedUrl = History.parseUrl(url);
                if (!path) {
                    path = parsedUrl.path;
                }
                if (!search) {
                    search = parsedUrl.search;
                }
                if (!hash) {
                    hash = parsedUrl.hash;
                }
            }
            if (path) {
                data.path = path;
            }
            if (typeof search === 'object') {
                for (var key in search) {
                    var value = search[key];
                    // @ts-ignore
                    data.search = History.setSearch(data.search, key, value);
                }
            }
            else if (search) {
                data.search = '?' + search;
            }
            if (hash) {
                data.hash = '#' + hash;
            }
            if (push !== undefined) {
                data.push = push;
            }
            if (position !== undefined) {
                data.position = position;
            }
            if (scrollFirst !== undefined) {
                data.scrollFirst = scrollFirst;
            }
            return data;
        },
        enumerable: false,
        configurable: true
    });
    Redirect.prototype.render = function () {
        Redirect.data = this.data;
        return this.props.children;
    };
    Redirect.defaultProps = RedirectDefaultProp;
    return Redirect;
}(React.Component));

exports.Redirect = Redirect;
exports.RedirectDefaultProp = RedirectDefaultProp;
