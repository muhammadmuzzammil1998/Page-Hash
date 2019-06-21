# Page Hash [![Build Status](https://travis-ci.com/muhammadmuzzammil1998/Page-Hash.svg?token=HfFvHNnzvYdmdyodsU3h&branch=master)](https://travis-ci.com/muhammadmuzzammil1998/Page-Hash)

Page Hash API provides hashes of the given item which some URL points to in JSON object. An example is given below:

```json
{
  "load": 314,
  "url": "https://example.com",
  "hashes": [
    {
      "algo": "sha256",
      "hash": "3587cb776ce0e4e8237f215800b7dffba0f25865cb84550e87ea8bbac838c423"
    },
    {
      "algo": "sha1",
      "hash": "0e973b59f476007fd10f87f347c3956065516fc0"
    },
    {
      "algo": "md5",
      "hash": "09b9c392dc1f6e914cea287cb6be34b0"
    }
  ]
}
```

## Contents

- [Running a local version](#running-a-local-version)

  - [Install dependencies](#install-dependencies)
  - [Running](#run)

- [Using in Node.js](#using-in-nodejs)

- [Using in Golang](https://muzzammil.xyz/pagehashgo)

- [Documentation](#documentation)

  - [TL;DR](#tldr)
  - [Calling the API](#calling-the-api)

    - [Examples](#examples)

  - [Error handling](#error-handling)

    - [Error detection](#error-detection)

- [Contributions](#contributions)

## Running a local version

### Install dependencies

```bash
npm install
```

### Run

```bash
npm start
```

This will start the app on port 7800\. If you'd like to change that, change `PORT` in `app.js`.

## Using in Node.js

### Install using npm

```bash
npm install page-hash --save
```

## Documentation

### TL;DR

- API endpoint: `pagehash.muzzammil.xyz/?url=%` where `%` = full URL of resource.
- In Node.js, `pagehash(STRING)` takes URL as input and returns a `promise`.
- Example: `curl "https://pagehash.muzzammil.xyz/?url=https://example.com"`
- Error handling:

  - In Node.js, handle `promise` rejection.
  - For other stuff, `if(hashes == null) { alert("err"); }`

### Calling the API

In Node.js, `pagehash(STRING)`'s `promise` returns result as an `object`.

API endpoint: `pagehash.muzzammil.xyz/?url=%` where `%` = full URL of resource.

The API will return a JSON object containing one of the keys as `hashes` which is an array of multiple hashes computed for the given URL. Each element of the array contains the name of the algorithm used in `algo` and the computed hash in `hash`.

```json
...
  "hashes": [
    {
      "algo": "sha256",
      "hash": "3587cb776ce0e4e8237f215800b7dffba0f25865cb84550e87ea8bbac838c423"
    },
    {
      "algo": "sha1",
      "hash": "0e973b59f476007fd10f87f347c3956065516fc0"
    },
...
```

Along with the hashes computed, the returned JSON also contains the URL for which the hash is computed in `url` and API load time in `load`.

```json
{
  "load": 314,
  "url": "https://example.com",
...
```

#### Examples

-- using cURL

```bash
$ curl "https://pagehash.muzzammil.xyz/?url=https://example.com"
{
  "load": 314,
  "url": "https://example.com",
  "hashes": [
    {
      "algo": "sha256",
      "hash": "3587cb776ce0e4e8237f215800b7dffba0f25865cb84550e87ea8bbac838c423"
    },
    {
      "algo": "sha1",
      "hash": "0e973b59f476007fd10f87f347c3956065516fc0"
    },
    {
      "algo": "md5",
      "hash": "09b9c392dc1f6e914cea287cb6be34b0"
    }
  ]
}
```

-- using Node.js

```javascript
const pagehash = require("page-hash")

pagehash("https://example.com").then(result => {
  console.log("Result\n", result)
}, error => {
  console.log("Error\n", error)
})
```

```bash
Result
 { url: 'https://example.com',
  hashes:
   [ { algo: 'sha256',
       hash:
        '3587cb776ce0e4e8237f215800b7dffba0f25865cb84550e87ea8bbac838c423' },
     { algo: 'sha1',
       hash: '0e973b59f476007fd10f87f347c3956065516fc0' },
     { algo: 'md5', hash: '09b9c392dc1f6e914cea287cb6be34b0' } ] }
```

### Error handling

In Node.js, handle rejection for returned `promise` as shown in the example for Node.js.

Like the hashes, error details are also given in JSON object which contains multiple ways to detect errors and what caused them. An example of error response may look like this:

```json
{
  "url": "https://example.co",
  "hashes": null,
  "errno": "ENOTFOUND",
  "code": "ENOTFOUND",
  "syscall": "getaddrinfo",
  "hostname": "example.co",
  "host": "example.co",
  "port": 443
}
```

The above error occured because there is no <https://example.co>, yet, and the API failed to get any response from this URL.

#### Error detection

TL;DR -- Short checking, `if(hashes == null) { alert("err"); }`

I appended the error returned by `request` in `node.js` so I can't guarantee what it will return. But, I turned `hashes` to `null` in case of any error. So, if you don't want to dig deep, just check if `hashes` is `null` or not. If it is, it means that error has occurred somewhere. However, if you want to dig deep, for some reason, make sure `errno` and other keys exist before reading them to avoid any further failure.

## Contributions

Contributions are welcome but **please** don't make Pull Requests for typos, grammatical mistakes, _"sane way"_ of doing it, etc. Open an issue for it. Thanks!
