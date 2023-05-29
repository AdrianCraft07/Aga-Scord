type nodeTypeFn = (props: nodeProps) => nodeDom;
declare module 'https://adriancraft07.github.io/js-lib/$.js' {
	interface QueryScroll {
		to(x: number, y: number): ThisType;
		to(options: ScrollToOptions): ThisType;
		top(value: number, behavior?: ScrollBehavior): ThisType;
		left(value: number, behavior?: ScrollBehavior): ThisType;
		bottom(value: number, behavior?: ScrollBehavior): ThisType;
		right(value: number, behavior?: ScrollBehavior): ThisType;
		height(): number;
		width(): number;
	}
	interface QueryValue {
		(value?: string): string;
		push(value: string): ThisType;
	}
	interface Query {
		element: HTMLElement;
		css: (property: string, value: string) => ThisType;
		css: (property: { [key: string]: string }) => ThisType;
		on<K extends keyof HTMLElementEventMap>(event: K, callback: (event: HTMLElementEventMap[K]) => void): ThisType;
		html: (data?: string) => string;
		text: (data?: string) => string;
		append: (data: string | HTMLElement) => ThisType;
		prepend: (data: string | HTMLElement) => ThisType;
		childrens: () => QueryList;
		parent: () => Query;
		getAttribute: (name: string) => string;
		setAttribute: (name: string, value: string) => ThisType;
		removeAttribute: (name: string) => ThisType;
		clone: (deep?: boolean) => Query;
		remove: () => ThisType;
		scroll: QueryScroll;
		value: QueryValue;
	}
	interface QueryList extends Query {
		forEach:
			| ((callback: (element: Query, index: number, array: QueryList) => void) => ThisType)
			| ((callback: (element: Query, index: number) => void) => ThisType)
			| ((callback: (element: Query) => void) => ThisType);
		[key: number]: Query;
		[Symbol.iterator]: () => IterableIterator<Query>;
	}

	type QueryNode = HTMLElement | Node | ParentNode;

	export function $(selector: string | NodeList | QueryNode | null): QueryList;
	function ƒ(element: HTMLElement): Query;
	$.ƒ = ƒ;
}
declare module 'https://raw.githubusercontent.com/AdrianCraft07/js-lib/main/$.js' {
	export * from 'https://adriancraft07.github.io/js-lib/$.js';
}

declare module 'https://adriancraft07.github.io/js-lib/dom.js' {
	type nodeProps = Record<string, any> | null;
	type nodeType = string | ((props: nodeProps) => nodeDom);
	type nodeChildren = number | string | HTMLElement | undefined;
	interface nodeDom {
		type: nodeType;
		props: nodeProps;
		childrens: nodeChildren[];
	}
	export function dom(type: nodeType, props: nodeProps, ...childrens: nodeChildren[]): nodeDom;
	export function createElement(node: nodeDom): HTMLElement;
	export function createElementDom(type: nodeType, props: nodeProps, ...childrens: nodeChildren[]): HTMLElement;
}
declare module 'https://raw.githubusercontent.com/AdrianCraft07/js-lib/main/dom.js' {
	export * from 'https://adriancraft07.github.io/js-lib/dom.js';
}

declare module 'https://adriancraft07.github.io/js-lib/SPA.js' {
	export function navigateTo(url: string, callback: () => void): void;
	export function makeLink(callback: () => void): nodeTypeFn
}
declare module 'https://raw.githubusercontent.com/AdrianCraft07/js-lib/main/SPA.js' {
	export * from 'https://adriancraft07.github.io/js-lib/SPA.js';
}
