# Server
Encapsulates express components from application layer for easy transition to new
versions or alternatives.

## Middleware (/lib)
All custom middleware components should be placed within the lib folder.

## Routes (/routes)
All routes for express and contained within the routes folder.

## Importants Notes

### Routes should not contain model logic
The routes are controllers and encapsulate server logic (i.e. headers, redirects).

### Use middleware over anonymous callback methods
Middleware components are used to hook into model logic throughout the routes
without replicating code. To maintain testability you should never use an anonymous callback function
to describe a route/middleware. You must use a middleware to encapsulate the logic and test this
independently so it can also be used elsewhere

