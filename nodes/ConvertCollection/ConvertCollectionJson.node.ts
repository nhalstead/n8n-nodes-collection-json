import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

/**
 * Taken from the SPEC on github
 * @link https://github.com/collection-json/spec
 */
interface CollectionJsonRoot {
	version: string | null
	href: string | null,
	ref: string | null,
	links: object[] | null,
	queries: object[] | null,
	template: object[] | null,
	items: CollectionJsonItem[] | null
}

interface CollectionJsonItem {
	href: string,
	data: CollectionJsonData[],
	links: CollectionJsonLink[]
}

type KvAny = { [key: string]: any };

type Mixed = string | number | boolean | null;

interface CollectionJsonData {
	name: string | null,
	value: Mixed,
	prompt: string | null
}

interface CollectionJsonLink {
	href: string,
	rel: string,
	name: string | null,
	render: string | null,
	prompt: string | null
}


export class ConvertCollectionJson implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Convert Collection+JSON',
		name: 'convertCollectionJson',
		group: ['transform'],
		version: 1,
		description: 'Convert Collection+JSON data to plain JSON Objects',
		defaults: {
			name: 'Convert Collection+JSON Node',
		},
		// @ts-ignore
		inputs: ['main'],
		// @ts-ignore
		outputs: ['main'],
		properties: [],
		icon: 'file:convertcollection.svg',
	};

	/**
	 * Convert Collection+JSON format to a standard JSON Object
	 */
	static convert(entries: CollectionJsonData[][]): object {
		return entries.map(input => {
			return input
				.reduce((acc: KvAny, {name, value}: CollectionJsonData) => {
					if (!name) {
						return acc;
					}

					acc[name] = value;
					return acc;
				}, {});
		});
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			item = items[itemIndex];

			if (! item.json?.collection) {
				item.json = {
					items: []
				}
				continue;
			}

			const collection: CollectionJsonRoot = item.json.collection as unknown as CollectionJsonRoot;

			const entries: CollectionJsonData[][] = collection.items?.map(collect => collect.data) || [];

			item.json = Object.assign({}, {
				items: ConvertCollectionJson.convert(entries)
			})

		}

		return [items];
	}
}
