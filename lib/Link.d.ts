import { AnchorHTMLAttributes, Component, ReactNode } from 'react';
interface LinkProps<T = any> extends AnchorHTMLAttributes<T> {
    activeClass?: string;
    exact?: boolean;
    replace?: boolean;
    scrollFirst?: boolean;
    scrollTo?: number | string;
    children?: ReactNode;
    onMove?: (move: () => void) => any;
    disabled?: boolean;
}
declare const LinkDefaultProps: {
    href: string;
};
declare class Link<P extends LinkProps = LinkProps, C = any> extends Component<LinkProps, C> {
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
export default Link;
export { Link, LinkProps, LinkDefaultProps, };
