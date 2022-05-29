# Serverless PLog

This project is a simple PLog application using AWS Lambda and Serverless framework. 
It can be easily extended to support VLogs and allow uploading multiple pictures / videos. 
Many features can be added like full text search, group by places, filter by dates etc. But for the scope of the project, the the project is started with minimal features.

# Functionality of the application

This application will allow creating/removing/updating/fetching PLog items. 
Each PLog item can optionally have an attachment image. Each user only has access to PLog items that they have created.

# PLog items

The application should store PLog items, and each PLog item contains the following fields:

* `PLogId` (string) - a unique id for an item
* `userId` (string) - a unique id for the user that the plog item belogs to
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a PLog item (e.g. "A Dayout at Dublin beach")
* `comments` (string) - Log experiences about the day (e.g. "A lucky day with sunny spells and a light breeze...")
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a PLog item


# Functions implemented

This project offers the following functions :

* `Auth` - this function implements a custom authorizer for API Gateway that should be added to all other functions.

* `GetPLogs` - returns all PLogs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It returns data that looks like this:

```json
{
  "items": [
    {
      "plogId": "123",
      "createdAt": "2022-05-29T20:01:45.424Z",
      "title": "Day at Dublin Zoo",
      "location": "Phoenix Park - Dublin",
      "comments": "A place where every family should visit in Dublin. We saw numerous animals happily coexisting.",
      "attachmentUrl": "http://example.com/zoo.png"
    },
    {
      "plogId": "321",
      "createdAt": "2022-05-28T20:01:45.424Z",
      "title": "Dinner at Lebanese",
      "location": "Parson Street",
      "comments": "Lovely vegetarian food. Do not miss their Mezze",
      "attachmentUrl": "http://example.com/mezze.png"
    }
  ]
}
```

* `CreatePLog` - creates a new Plog for a current user. A shape of data send by a client application to this function can be found in the `CreatePLogRequest.ts` file

It receives a new PLog item to be created in JSON format that looks like this:

```json
 {
      "plogId": "123",
      "createdAt": "2022-05-29T20:01:45.424Z",
      "title": "Day at Dublin Zoo",
      "location": "Phoenix Park - Dublin",
      "comments": "A place where every family should visit in Dublin. We saw numerous animals happily coexisting.",
      "attachmentUrl": "http://example.com/zoo.png"
    }
```

It  returns a new PLog item that looks like this:

```json
{
  "item":  {
                "plogId": "123",
                "createdAt": "2022-05-29T20:01:45.424Z",
                "title": "Day at Dublin Zoo",
                "location": "Phoenix Park - Dublin",
                "comments": "A place where every family should visit in Dublin. We saw numerous animals happily coexisting.",
                "attachmentUrl": "http://example.com/zoo.png"
              }
}
```

* `UpdatePLog` - updates a Plog item created by a current user. A shape of data send by a client application to this function can be found in the `UpdatePLogRequest.ts` file

It receives an object that contains three fields that can be updated in a PLog item:

```json
{
  "title": "Dinner at Umi Falafel",
  "comments": "Many options for vegetarian food. Do not miss their Mezze",
  "location": "Parson Street"
}
```

The id of an item that should be updated is passed as a URL parameter.

It returns an empty body.

* `DeletePLog` - deletes a PLog item created by a current user. Expects an id of a PLog item to remove.

It returns an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a PLog item.

It returns a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user is extracted from a JWT token passed by a client.

# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

```ts
const apiId = '...' 
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```
