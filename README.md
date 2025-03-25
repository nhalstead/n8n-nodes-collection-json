# n8n-nodes-collection-json

This is an n8n community node. It lets you use collection+json in your n8n workflows.

Collection+Json is able to convert Collection+Json payloads to Objects.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)   
[Compatibility](#compatibility)  
[Usage](#usage)
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

Converts a Collection+Json payload to an Object. Nothing else.

## Compatibility

Tested against v1.83.2

## Usage

1. Create a new workflow.
2. Fetch data from an API that returns Collection+Json.
3. Add the Collection+Json node to your workflow. (It expects the data to be provided through `item.json` values in the input data.)

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
