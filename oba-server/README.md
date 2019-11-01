# oba-server

This project contains the backend code for the OBA server.

The architecture of this project is intended to mimic the [Node (Express + Mongoose)](https://github.com/gothinkster/node-express-realworld-example-app) example application.

# Routing Table
| Route Category |                         Route                        | Request Type |                              Desc                              |
|:--------------:|:----------------------------------------------------:|:------------:|:--------------------------------------------------------------:|
|      User      |               localhost:3000/api/users               |      GET     | Registers a user and returns a JWT web token in response body. |
|      User      |            localhost:3000/api/users/login            |     POST     |       Logs in the user using token based authentication.       |
|      Class     |          localhost:3000/api/classes/get_all          |      GET     |                        Gets all classes.                       |
|      Class     |           localhost:3000/api/classes/create          |     POST     |             Creates a class(instance) of a course.             |
|     Course     |          localhost:3000/api/courses/get_all          |      GET     |                        Gets all courses.                       |
|     Course     |         localhost:3000/api/courses/get_by_id         |      GET     |                 Gets a course by the ObjectId.                 |
|     Course     |           localhost:3000/api/courses/create          |     POST     |                    Creates a UNIQUE course.                    |
|      Form      |      localhost:3000/api/forms/get_all_indicators     |      GET     |                     Returns all indicators.                    |
|      Form      | localhost:3000/api/forms/get_all_graduate_attributes |      GET     |                Returns all graduate attributes.                |
