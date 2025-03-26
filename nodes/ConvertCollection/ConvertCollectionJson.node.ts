import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {
	CollectionJsonData,
	CollectionJsonWithPage,
	KvAny,
}	from './collection';

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

			if (!item.json?.collection) {
				item.json = {
					items: [],
					page_info: null,
					links: []
				}
				continue;
			}

			const collection: CollectionJsonWithPage = item.json.collection as CollectionJsonWithPage;
			const entries: CollectionJsonData[][] = collection.items?.map(collect => collect.data) || [];

			item.json = {
				items: ConvertCollectionJson.convert(entries),
				page_info: collection.page_info || null,
				links: collection.links || []
			};
		}

		return [items];
	}
}
