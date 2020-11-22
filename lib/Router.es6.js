import { __decorate } from 'tslib';
import React, { createContext, Component } from 'react';
import watch, { Watch, unwatch, state, cache, event } from '@watch-state/react';
import History__default from '@watch-state/history-api';

const history = new History__default();
const RouterContext = createContext(null);
const RouterDefaultProps = {
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
    const { match } = props;
    if (match) {
        return match;
    }
    else {
        let { search, pathIsh, searchIsh, ish, path, hash, hashIsh } = props;
        return `^${path ? `${path}${ish || pathIsh ? '(/[^?#]*)?' : ''}` : '[^?#]*'}${search ?
            `\\?${ish || searchIsh ? '([^#]*\\&)?' : ''}${search}${ish || searchIsh ? '(\\&[^#]*)?' : ''}` :
            '(\\?[^#]*)?'}${hash ? `\\#${ish || hashIsh ? '.*' : ''}${hash}${ish || hashIsh ? '.*' : ''}` : '(\\#.*)?'}$`;
    }
}
let Router = class Router extends Component {
    constructor() {
        super(...arguments);
        this.unmount = false;
        this.show = false;
        this.childRouterCount = 0;
    }
    componentDidMount() {
        this.unmount = false;
        this.reaction = new Watch(() => {
            if (this.matched) {
                unwatch(() => {
                    this.onShow();
                });
            }
            else {
                unwatch(() => {
                    this.onHide();
                });
            }
        });
    }
    componentWillUnmount() {
        if (this.show) {
            this.unmount = true;
            this.onHide();
        }
        this.reaction.destructor();
    }
    get children() {
        const { matchReg } = this;
        if (!matchReg)
            return null;
        let { children } = this.props;
        if (typeof children === 'function') {
            let { match, search, searchIsh, ish, path } = this.props;
            // @ts-ignore
            return children((id, defaultValue) => {
                if (id && !match && search && (searchIsh || ish)) {
                    let start = 0;
                    let end = start + search.split('(').length + 1;
                    if (path) {
                        const { length } = path.split('(');
                        start += length - 1;
                        end += length - 1;
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
    }
    get showOther() {
        return !this.childRouterCount;
    }
    get matched() {
        var _a;
        const { props } = this;
        if (props.other && !((_a = this.context) === null || _a === void 0 ? void 0 : _a.showOther)) {
            return false;
        }
        if (!props.path && !props.search && !props.hash && !props.match) {
            return true;
        }
        return history.is(this.matchReg);
    }
    get matchReg() {
        return getMatchReg(this.props);
    }
    onShow() {
        const { onShow, showDelay, delay } = this.props;
        if (onShow) {
            onShow();
        }
        if (showDelay || delay) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.onShown(), showDelay || delay);
        }
        else {
            this.onShown();
        }
    }
    onShown() {
        const { onShown } = this.props;
        if (!this.show && !this.props.other && this.context) {
            this.context.childRouterCount++;
        }
        this.show = true;
        if (onShown) {
            onShown();
        }
    }
    onHide() {
        const { onHide, hideDelay, delay } = this.props;
        if (onHide) {
            onHide();
        }
        if ((hideDelay || delay) && !this.unmount) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => this.onHidden(), hideDelay || delay);
        }
        else {
            this.onHidden();
        }
    }
    onHidden() {
        if (this.show && !this.props.other && this.context) {
            this.context.childRouterCount--;
        }
        this.show = false;
        if (this.props.onHidden) {
            this.props.onHidden();
        }
    }
    render() {
        return this.show ? (React.createElement(RouterContext.Provider, { value: this }, this.children)) : null;
    }
};
Router.defaultProps = RouterDefaultProps;
Router.contextType = RouterContext;
__decorate([
    state
], Router.prototype, "show", void 0);
__decorate([
    state
], Router.prototype, "childRouterCount", void 0);
__decorate([
    cache
], Router.prototype, "showOther", null);
__decorate([
    cache
], Router.prototype, "matched", null);
__decorate([
    cache
], Router.prototype, "matchReg", null);
__decorate([
    event
], Router.prototype, "onShow", null);
__decorate([
    event
], Router.prototype, "onShown", null);
__decorate([
    event
], Router.prototype, "onHide", null);
__decorate([
    event
], Router.prototype, "onHidden", null);
Router = __decorate([
    watch
], Router);
var Router$1 = Router;

export default Router$1;
export { Router, RouterContext, RouterDefaultProps, getMatchReg, history };
