'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var watchState = require('watch-state');
var watch = require('@watch-state/react');
var History = require('@watch-state/history-api');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var watch__default = /*#__PURE__*/_interopDefaultLegacy(watch);
var History__default = /*#__PURE__*/_interopDefaultLegacy(History);

var history = new History__default['default']();
var RouterContext = React.createContext(null);
var RouterDefaultProps = {
    match: '',
    path: '',
    search: '',
    hash: '',
    ish: false,
    pathIsh: false,
    searchIsh: false,
    hashIsh: false
};
function getMatchReg(props) {
    var match = props.match;
    if (match) {
        return match;
    }
    else {
        var search = props.search, pathIsh = props.pathIsh, searchIsh = props.searchIsh, ish = props.ish, path = props.path, hash = props.hash, hashIsh = props.hashIsh;
        return "^" + (path ? "" + path + (ish || pathIsh ? '(/[^?#]*)?' : '') : '[^?#]*') + (search ?
            "\\?" + (ish || searchIsh ? '([^#]*\\&)?' : '') + search + (ish || searchIsh ? '(\\&[^#]*)?' : '') :
            '(\\?[^#]*)?') + (hash ? "\\#" + (ish || hashIsh ? '.*' : '') + hash + (ish || hashIsh ? '.*' : '') : '(\\#.*)?') + "$";
    }
}
var Router = /** @class */ (function (_super) {
    tslib.__extends(Router, _super);
    function Router() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.unmount = false;
        _this.show = false;
        _this.childRouters = new Set();
        return _this;
    }
    Router.prototype.componentDidMount = function () {
        var _this = this;
        this.unmount = false;
        this.reaction = new watchState.Watch(function () {
            if (_this.matched) {
                _this.onShow();
            }
            else {
                _this.onHide();
            }
        }, true);
    };
    Router.prototype.componentWillUnmount = function () {
        var _a;
        if (this.show) {
            this.unmount = true;
            this.onHide();
        }
        (_a = this.reaction) === null || _a === void 0 ? void 0 : _a.destroy();
    };
    Object.defineProperty(Router.prototype, "children", {
        get: function () {
            var matchReg = this.matchReg;
            if (!matchReg)
                return null;
            var children = this.props.children;
            if (typeof children === 'function') {
                var _a = this.props, match_1 = _a.match, search_1 = _a.search, searchIsh_1 = _a.searchIsh, ish_1 = _a.ish, path_1 = _a.path;
                // @ts-ignore
                return children(function (id, defaultValue) {
                    if (id && !match_1 && search_1 && (searchIsh_1 || ish_1)) {
                        var start = 0;
                        var end = start + search_1.split('(').length + 1;
                        if (path_1) {
                            var length_1 = path_1.split('(').length;
                            start += length_1 - 1;
                            end += length_1 - 1;
                        }
                        if (id > start) {
                            id++;
                            if (id >= end) {
                                id++;
                            }
                        }
                    }
                    return history.get(matchReg, id, defaultValue) || defaultValue;
                });
            }
            else {
                return children;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "showOther", {
        get: function () {
            return !this.childRouters.size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "matched", {
        get: function () {
            var _a;
            var props = this.props;
            if (props.other && !((_a = this.context) === null || _a === void 0 ? void 0 : _a.showOther)) {
                return false;
            }
            if (!props.path && !props.search && !props.hash && !props.match) {
                return true;
            }
            return history.is(this.matchReg);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "matchReg", {
        get: function () {
            return getMatchReg(this.props);
        },
        enumerable: false,
        configurable: true
    });
    Router.prototype.onShow = function () {
        var _this = this;
        var _a = this.props, onShow = _a.onShow, showDelay = _a.showDelay, delay = _a.delay;
        if (onShow) {
            onShow();
        }
        if (!this.show && !this.props.other && this.context) {
            var childRouters = this.context.childRouters;
            if (!childRouters.size) {
                childRouters.add(this);
                watch.getState(this.context, 'childRouters').update();
            }
            else {
                childRouters.add(this);
            }
        }
        if (showDelay || delay) {
            clearTimeout(this.timer);
            this.timer = setTimeout(function () { return _this.onShown(); }, showDelay || delay);
        }
        else {
            this.onShown();
        }
    };
    Router.prototype.onShown = function () {
        var onShown = this.props.onShown;
        this.show = true;
        if (onShown) {
            onShown();
        }
    };
    Router.prototype.onHide = function () {
        var _this = this;
        this.childDestructor();
        var _a = this.props, onHide = _a.onHide, hideDelay = _a.hideDelay, delay = _a.delay;
        if (onHide) {
            onHide();
        }
        if ((hideDelay || delay) && !this.unmount) {
            clearTimeout(this.timer);
            this.timer = setTimeout(function () {
                if (!_this.matched) {
                    _this.onHidden();
                }
            }, hideDelay || delay);
        }
        else {
            this.onHidden();
        }
    };
    Router.prototype.onHidden = function () {
        if (this.show && !this.props.other && this.context) {
            var childRouters = this.context.childRouters;
            childRouters.delete(this);
            if (!childRouters.size) {
                watch.getState(this.context, 'childRouters').update();
            }
        }
        this.show = false;
        if (this.props.onHidden) {
            this.props.onHidden();
        }
    };
    Router.prototype.childDestructor = function () {
        this.childRouters.forEach(function (router) { return router.destructor(); });
    };
    Router.prototype.destructor = function () {
        var _a;
        this.childDestructor();
        (_a = this[watch.WATCHER]) === null || _a === void 0 ? void 0 : _a.destroy();
        this.reaction.destroy();
    };
    Router.prototype.render = function () {
        return this.show ? (React__default['default'].createElement(RouterContext.Provider, { value: this }, this.children)) : null;
    };
    Router.defaultProps = RouterDefaultProps;
    Router.contextType = RouterContext;
    tslib.__decorate([
        watch.state
    ], Router.prototype, "show", void 0);
    tslib.__decorate([
        watch.state
    ], Router.prototype, "childRouters", void 0);
    tslib.__decorate([
        watch.cache
    ], Router.prototype, "showOther", null);
    tslib.__decorate([
        watch.mixer
    ], Router.prototype, "matched", null);
    tslib.__decorate([
        watch.mixer
    ], Router.prototype, "matchReg", null);
    tslib.__decorate([
        watch.event
    ], Router.prototype, "onShow", null);
    tslib.__decorate([
        watch.event
    ], Router.prototype, "onShown", null);
    tslib.__decorate([
        watch.event
    ], Router.prototype, "onHide", null);
    tslib.__decorate([
        watch.event
    ], Router.prototype, "onHidden", null);
    tslib.__decorate([
        watch.event
    ], Router.prototype, "childDestructor", null);
    tslib.__decorate([
        watch.event
    ], Router.prototype, "destructor", null);
    Router = tslib.__decorate([
        watch__default['default']
    ], Router);
    return Router;
}(React.Component));

exports.Router = Router;
exports.RouterContext = RouterContext;
exports.RouterDefaultProps = RouterDefaultProps;
exports.default = Router;
exports.getMatchReg = getMatchReg;
exports.history = history;
