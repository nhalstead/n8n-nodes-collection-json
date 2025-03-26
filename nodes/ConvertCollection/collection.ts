
export type KvAny = { [key: string]: any };

export type KindOfValue = string | number | boolean | null;

export interface CollectionErrorDocument {
	title: string,
	code: string,
	message: string
}

export interface CollectionJsonItem {
	href: string,
	data: CollectionJsonData[],
	links: CollectionJsonLink[]
}

export interface CollectionJsonData {
	name: string | null,
	value: KindOfValue,
	prompt: string | null
}

export interface CollectionJsonDataQuery {
	data: CollectionJsonData[]
}

export interface CollectionJsonDataQueryWithMetadata extends CollectionJsonDataQuery {
	href: string,
	rel: string,
	prompt: string | null
}

export interface CollectionJsonLink {
	href: string,
	rel: string,
	name: string | null,
	render: string | null,
	prompt: string | null
}

export interface CollectionJson {
	version: string | null
	href: string | null,
	rel: string | null,
	links: CollectionJsonLink[] | null,
	queries: CollectionJsonDataQueryWithMetadata | null,
	template: CollectionJsonDataQuery | null,
	items: CollectionJsonItem[] | null
	error: CollectionErrorDocument | null
}

export interface CollectionJsonWithPage extends CollectionJson {
	// Not exactly in the standard, but is included in the TeamSnap implementation of Collection+JSON
	page_info: {
		total_items: number,
		page_size: number,
		page_number: number
	}
}
