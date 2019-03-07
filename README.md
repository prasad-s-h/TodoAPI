# TodoAPI

This application mainly focuses on performing the CRUD operations by the authenticated users using RESTful API web services.
The application is built using NodeJS, Express and MongoDB.
Users need to signup by providing the email and password, by going to following endpoint [POST /users]
After successful signup, users will be provided with x-auth token.

With the help of x-auth token, each authenticated user can,
1. create/insert the data by setting the text and completed, for ex {"text":"hosting","completed":true}, by going to endpoint 
	 [POST /todos]
	 Note: data can only be inserted by providing valid x-auth header with the valid token.
2. retrieve the data by setting the x-auth header with the valid token. Endpoint has to be [GET /todos]
   Note: user can retrieve his/her own data.
	 Incase, if the user wishes to retrieve a specific data, then endpoint has to be [GET /todos/:id],
	 where id being the ObjectId of the specific data/document.
3. update the data by setting the x-auth header with the valid token. Endpoint has to be [PATCH /todos/:id]
	 Note: user can update his/her own data.
4. delete the data by setting the x-auth header with the valid token. Endpoint has to be [DELETE /todos/:id]
	 Note: user can delete his/her own data.
	 
User can get the details of his/her information by setting the x-auth header with the valid token and going to the endpoint [GET /users/me].
User can login by providing the email and password, going to endpoint [POST /users/login]
User can logout by going to endpoint [DELETE /users/me/logout]
User can also view the list of the users present in the application, endppoint being [GET /users].
