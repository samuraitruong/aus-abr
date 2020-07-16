# aus-abr

NodeJS package to retrieve ABN or ACN from https://abr.business.gov.au/ below function are supported:

- lookupABN
- getHistory
- searchActive

[![Coverage Status](https://coveralls.io/repos/github/samuraitruong/aus-abr/badge.svg?branch=master)](https://coveralls.io/github/samuraitruong/aus-abr?branch=master)
This library will make request to public website to retrive and parse data , If you required to use more data, please consider to use ACIS official api

# Install

```sh
  npm install aus-abr
```

# Usage

```
const abr = require('aus-abr')

or ES6 Module

import abr from 'aus-abr'

or import {lookupABN} from 'aus-abr

```

## Use with async/await

```
const details = await lookupABN('1234567');

```

## Use with romise

# API

## lookupABN(abn)

Return current ABN information that display on https://abr.business.gov.au/ABN/View?abn=abn

```js
const ausAbr = require("aus-abr");

const details = await ausAbr.lookupABN("61006912563");

console.log(details);
```

It will output below data

```js
{
  "businessNames":  [],
  "details":{
    "abnStatus":{
      "from": "24 May 2000",
      "status": "Active",
      "statusText": "Active from 24 May 2000",
    },
    "businessLocation":{
      "postcode": 5093,
      "state": "SA",
    },
    "entityName": "COLES, ADRIAN STAN",
    "entityType": "Individual/Sole Trader",
    "gstStatus":{
      "from": undefined,
      "status": "unregistered",
      "statusText": "Not currently registered for GST",
    },
  },
  "tradingNames":  [
{
      "from": "24 May 2000",
      "tradingName": "ADRIAN COLES",
    },
  ],
}

```

## getHistory(abn)

```js
const ausAbr = require("aus-abr");

const details = await ausAbr.getHistory("15 035 513 435");

console.log(details);
```

It will output below data

```js
{
  "abnStatus": [
  {
      "from": "06 Jul 2006",
      "to": "(current)",
      "value": "Active",
    },
  ],
  "businessLocation": [
  {
      "from": "10 Sep 2014",
      "to": "(current)",
      "value": "SA 5352",
    },
  {
      "from": "19 Sep 2008",
      "to": "10 Sep 2014",
      "value": "SA 5352",
    },
  {
      "from": "24 Apr 2008",
      "to": "19 Sep 2008",
      "value": "SA 5355",
    },
  {
      "from": "06 Jul 2006",
      "to": "24 Apr 2008",
      "value": "SA 5352",
    },
  ],
  "businessName": [
  {
      "from": "29 Oct 2019",
      "to": "(current)",
      "value": "Barossa Australia",
    },
  {
      "from": "20 Oct 2018",
      "to": "(current)",
      "value": "Barossa Wine School",
    },
  {
      "from": "08 Aug 2018",
      "to": "(current)",
      "value": "BGWA",
    },
  {
      "from": "",
      "to": "",
      "value": "From 1 November 2023, ABN Lookup will not display trading names and will only display registered business names. For more information, click help.",
    },
  ],
  "entityName": [
  {
      "from": "24 Oct 2011",
      "to": "(current)",
      "value": "BAROSSA GRAPE AND WINE ASSOCIATION INCORPORATED",
    },
  {
      "from": "19 Sep 2008",
      "to": "24 Oct 2011",
      "value": "BAROSSA GRAPE AND WINE ASSOCIATION",
    },
  {
      "from": "25 Feb 2008",
      "to": "19 Sep 2008",
      "value": "Barossa Grape and Wine Association",
    },
  {
      "from": "11 Sep 2006",
      "to": "25 Feb 2008",
      "value": "Barossa Grape and Wine Association",
    },
  {
      "from": "06 Jul 2006",
      "to": "11 Sep 2006",
      "value": "Barossa Wine Grapegrowers Steering Committee",
    },
  ],
  "entityType": [
  {
      "from": "",
      "to": "",
      "value": "Other Incorporated Entity",
    },
  ],
  "gstStatus": [
  {
      "from": "01 Oct 2007",
      "to": "(current)",
      "value": "Registered",
    },
  ],
  "tradingName": [
  {
      "from": "19 Sep 2008",
      "to": "(current)",
      "value": "BAROSSA GRAPE AND WINE ASSOCIATION",
    },
  {
      "from": "27 Aug 2008",
      "to": "19 Sep 2008",
      "value": "Barossa Grape and Wine Association",
    },
  {
      "from": "",
      "to": "",
      "value": "Not entitled to receive tax deductible gifts",
    },
  ],
}

```

## searchActive(keyword)

Get list of company have business name or entity name match with keywork

```js
const ausAbr = require("aus-abr");

const details = await ausAbr.searchActive("Toy World");

console.log(details);
```

Output

```js
[
  {
    "abn": "43 165 614 120",
    "businessLocation": {
      "postcode": 3754,
      "state": "VIC",
    },
    "name": "Toy World Australia",
    "type": "Business Name",
  },
  {
    "abn": "91 156 208 221",
    "businessLocation": {
      "postcode": 2194,
      "state": "NSW",
    },
    "name": "T WORLD AUSTRALIA PTY LTD",
    "type": "Entity Name",
  },
  {
    "abn": "33 120 406 322",
    "businessLocation": {
      "postcode": 3000,
      "state": "VIC",
    },
    "name": "T-WORLD PTY. LTD.",
    "type": "Entity Name",
  },
.......
]
```
