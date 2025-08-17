import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {
	CollectionJsonData, CollectionJsonItem,
	CollectionJsonWithPage,
	KvAny,
} from './collection';

export class ConvertCollectionJson implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Parse Collection+JSON',
		name: 'convertCollectionJson',
		group: ['transform'],
		version: 1,
		description: 'Parse Collection+JSON data to plain JSON Objects',
		defaults: {
			name: 'Parse C+JSON',
		},
		// @ts-ignore
		inputs: ['main'],
		// @ts-ignore
		outputs: ['main'],
		properties: [
			{
				displayName: 'Options',
				name: 'additionalFields',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				options: [
					{
						displayName: 'Include Links',
						name: 'includeLinks',
						type: 'boolean',
						default: true,
						description:
							'Whether to include _links in the output JSON. If false, only the data will be included.',
					},
					{
						displayName: 'Expand Items',
						name: 'expandItems',
						type: 'boolean',
						default: false,
						description:
							'Whether to expand the "items" array into individual objects. If false, the items will be returned as an array of objects.',
					},
				],
			},
		],
		icon: 'file:convertcollection.svg',
	};

	/**
	 * Convert Collection+JSON format to a standard JSON Object
	 */
	static collectionToObject(input: CollectionJsonItem): object {
		return input.data.reduce((acc: KvAny, { name, value }: CollectionJsonData) => {
			if (!name) {
				return acc;
			}

			acc[name] = value;
			return acc;
		}, {});
	}

	static collectionToObjectWithMeta(input: CollectionJsonItem): object {
		const obj = ConvertCollectionJson.collectionToObject(input) as KvAny;
		obj['_href'] = input.href;
		obj['_links'] = input.links;
		return obj;
	}

	static expandItems(items: INodeExecutionData[]): INodeExecutionData[] {
		return items.reduce((acc: INodeExecutionData[], item: INodeExecutionData) => {
			if (item.json?.items && Array.isArray(item.json.items)) {
				const expandedItems = item.json.items.map((entry: any) => {
					return {
						json: entry,
					} as INodeExecutionData
				});
				acc.push(...expandedItems);
			}
			return acc;
		}, []);
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const includeLinks = this.getNodeParameter('additionalFields.includeLinks', 0, true) as boolean;
		const expandItems = this.getNodeParameter('additionalFields.expandItems', 0, false) as boolean;

		const convertFn = includeLinks ?
			ConvertCollectionJson.collectionToObjectWithMeta : ConvertCollectionJson.collectionToObject;

		let item: INodeExecutionData;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			item = items[itemIndex];

			if (!item.json?.collection) {
				item.json = {
					items: [],
					page_info: null,
					links: [],
				};
				continue;
			}

			const collection: CollectionJsonWithPage = item.json.collection as CollectionJsonWithPage;
			const entries: object[] =
				collection.items?.map(convertFn) || [];

			item.json = {
				items: entries,
				page_info: collection.page_info || null,
				links: collection.links || [],
			};
		}

		if (expandItems) {
			return [ConvertCollectionJson.expandItems(items)];
		}

		return [items];
	}
}
