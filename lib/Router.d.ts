import React, { Component, ReactNode } from 'react';
import { Watch } from '@watch-state/react';
import History from '@watch-state/history-api';
declare const history: History;
declare const RouterContext: React.Context<Router<RouterProps, any>>;
interface RouterProps {
    match?: string;
    path?: string;
    search?: string;
    hash?: string;
    other?: boolean;
    ish?: boolean;
    pathIsh?: boolean;
    searchIsh?: boolean;
    hashIsh?: boolean;
    delay?: number;
    showDelay?: number;
    hideDelay?: number;
    onShow?: () => void;
    onShown?: () => void;
    onHide?: () => void;
    onHidden?: () => void;
    children?: ((get: (id?: number, defaultValue?: string) => string) => ReactNode) | ReactNode;
}
declare const RouterDefaultProps: {
    match: string;
    path: string;
    search: string;
    hash: string;
    ish: boolean;
    pathIsh: boolean;
    searchIsh: boolean;
    hashIsh: boolean;
};
declare function getMatchReg(props: RouterProps): string;
declare class Router<P extends RouterProps = RouterProps, C = any> extends Component<P, C> {
    static defaultProps: {
        match: string;
        path: string;
        search: string;
        hash: string;
        ish: boolean;
        pathIsh: boolean;
        searchIsh: boolean;
        hashIsh: boolean;
    };
    static contextType: React.Context<Router<RouterProps, any>>;
    timer: any;
    reaction: Watch;
    componentDidMount(): void;
    componentWillUnmount(): void;
    get children(): any;
    unmount: boolean;
    show: boolean;
    childRouters: Set<Router>;
    get showOther(): boolean;
    get matched(): boolean;
    get matchReg(): string;
    onShow(): void;
    onShown(): void;
    onHide(): void;
    onHidden(): void;
    childDestructor(): void;
    destructor(): void;
    render(): JSX.Element;
}
export default Router;
export { Router, history, RouterContext, RouterProps, RouterDefaultProps, getMatchReg };
