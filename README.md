# ICW - Integerity Check Webhook

An API to get and receive file hashes for use with SRI 

## Run for development

```bash=
cd app
npm install
npm start
```

## Run for production

```bash=
docker build -t icw:latest .
docker run -d -p 3000:3000 --mount source=data,target=/data icw:latest
```

## What does it do

It exposes the following APIs

1. GET `/hash/:vendor` where `vendor` is the name of the hash file returned

Returns JSON in the same format as provided by the vendor in the POST. Example:

```
{
    "assets": [
        {
            "name": "salemove-chat",
            "versioned-name": "salemove-integration.js",
            "sri-hash": "sha256-02kfafskjbaskjfbaisfaishbiwyegfnsvbcicb28he8fh23bhjecbacfqdf=="
        }
    ]
}
```

2. POST `/hash/:vendor` where `vendor` is the name of the hash file

Returns 200 on success

Returns 406 on Invalid JSON format if JSON doesnt match schema

If a schema file is provided it should be added to the schemas dir with the name of the vendor as the file name `vendor.schema`. When the vendor posts to the endpoint the JSON posted will be validated against the schema. If no schema file is provided validation is skipped.
