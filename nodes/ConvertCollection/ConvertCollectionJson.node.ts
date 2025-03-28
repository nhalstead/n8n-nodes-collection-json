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
	static convertAll(entries: CollectionJsonData[][]): object {
		return entries.map(ConvertCollectionJson.collectionToObject);
	}

	/**
	 * Convert Collection+JSON format to a standard JSON Object
	 */
	static collectionToObject(input: CollectionJsonData[]): object {
		return input
			.reduce((acc: KvAny, {name, value}: CollectionJsonData) => {
				if (!name) {
					return acc;
				}

				acc[name] = value;
				return acc;
			}, {});
	}

	static collectionToObjectWithOther(input: CollectionJsonItem): object {
		const obj = ConvertCollectionJson.collectionToObject(input.data) as KvAny;
		obj['_href'] = input.href;
		obj['_links'] = input.links;
		return obj;
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
			const entries: object[] = collection.items?.map(ConvertCollectionJson.collectionToObjectWithOther) || [];

			item.json = {
				items: entries,
				page_info: collection.page_info || null,
				links: collection.links || []
			};
		}

		return [items];
	}
}
