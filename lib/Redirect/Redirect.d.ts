import { Component, ReactNode } from 'react';
export interface RedirectData {
    path: string;
    search: string;
    hash: string;
    push: boolean;
    scrollFirst: boolean;
    position: string | number;
}
export interface RedirectProps {
    url?: string;
    path?: string;
    search?: {
        [key: string]: string | undefined;
    } | string;
    hash?: string;
    push?: boolean;
    scrollFirst?: boolean;
    position?: string | number;
    children?: ReactNode;
}
export declare const RedirectDefaultProp: {
    url: string;
    path: string;
    hash: string;
    children: any;
};
export declare class Redirect<P extends RedirectProps = RedirectProps, C = any> extends Component<P, C> {
    static data: RedirectData;
    static defaultProps: {
        url: string;
        path: string;
        hash: string;
        children: any;
    };
    static redirect(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    get data(): RedirectData;
    render(): (P["children"] & string) | (P["children"] & number) | (P["children"] & false) | (P["children"] & true) | (P["children"] & {}) | (P["children"] & import("react").ReactElement<any, string | ((props: any) => import("react").ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)>) | (new (props: any) => Component<any, any, any>)>) | (P["children"] & import("react").ReactNodeArray) | (P["children"] & import("react").ReactPortal);
}
