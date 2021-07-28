import { AnchorHTMLAttributes, Component, ReactNode } from 'react';
export interface LinkProps<T = any> extends AnchorHTMLAttributes<T> {
    activeClass?: string;
    exact?: boolean;
    replace?: boolean;
    scrollFirst?: boolean;
    scrollTo?: number | string;
    children?: ReactNode;
    onMove?: (move: () => void) => any;
    disabled?: boolean;
}
export declare const LinkDefaultProps: {
    href: string;
};
export declare class Link<P extends LinkProps = LinkProps, C = any> extends Component<P, C> {
    static defaultProps: {
        href: string;
    };
    move(url: any): void;
    onMove(url: string): void;
    onClick(e: any): void;
    get isLocal(): boolean;
    get isActive(): boolean;
    get className(): string;
    render(): JSX.Element;
}
