# FCC ISQA Project Personal Library
FreeCodeCamp Information &amp; Quality Assurance Project

Simple API which allows you to `POST` new book titles to a "library" and retrieve a JSON object back containing its `title` and unique `_id`. A `POST` request made to `/api/books/{bookID}` with a comment in the request body will add that comment to the book and return that book object, including the new comment.

Options for `GET` requests to retrieve all books or a single book depending on whether an id was provided.

Ability to `DELETE` a single book or entire library of books.


`test-runner.js`, `assertion-analyser.js`, `routes/fcctesting.js` were provided by FCC as part of the project template, for testing purposes.
