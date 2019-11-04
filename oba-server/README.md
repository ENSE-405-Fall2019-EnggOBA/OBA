# oba-server

This project contains the backend code for the OBA server.

The architecture of this project is intended to mimic the [Node (Express + Mongoose)](https://github.com/gothinkster/node-express-realworld-example-app) example application.

# Routing API Documentation 
The end points described below are meant to serve json to the oba-client.

Documentation style follows @iros REST api documentation.



## Routing Table
|  # 	| Category 	|                 Route URL                	| Request Type 	|                                                    Desc                                                    	| More Info 	|
|:--:	|:--------:	|:----------------------------------------:	|:------------:	|:----------------------------------------------------------------------------------------------------------:	|:---------:	|
|  1 	|   User   	|         localhost:3000/api/users         	|      POST     	|                       Registers a user and returns a JWT web token in response body.                       	|    [Register](#register)   	|
|  2 	|   User   	|      localhost:3000/api/users/login      	|     POST     	|                             Logs in the user using token based authentication.                             	|    [Login](#login)   	|
|  3 	|  Course  	|        localhost:3000/api/courses        	|      GET     	|                                           Gets a course by name.                                           	|      [Get by name](#GetName)   	|
|  4 	|  Course  	|       localhost:3000/api/courses/id      	|      GET     	|                                       Gets a course by the ObjectId.                                       	|    [Get by objectid](#GetObjectId)   	|
|  5 	|  Course  	|      localhost:3000/api/courses/all      	|      GET     	|                                              Gets all courses.                                             	|     [Get all](#GetAll)   	|
|  6 	|  Course  	|     localhost:3000/api/courses/create    	|     POST     	|                                          Creates a UNIQUE course.                                          	|     [Create](#create)   	|
|  7 	|   Class  	|        localhost:3000/api/classes        	|      GET     	| Gets classes by name. Can return more than one class if multiple are offered in same year different terms. 	|     [Get all by name](#GetAllName)   	|
|  8 	|   Class  	|       localhost:3000/api/classes/id      	|      GET     	|                                        Gets a class by the ObjectId.                                       	|      [Get by objectid](#GetObjectId)    	|
|  9 	|   Class  	|      localhost:3000/api/classes/all      	|      GET     	|                                              Gets all classes.                                             	|       [Get all](#GetAll)	|
| 10 	|   Class  	|        localhost:3000/api/classes        	|      PUT     	|                                     Updates an existing class instance.                                    	|     [Update](#Update)   	|
| 11 	|   Class  	|        localhost:3000/api/classes        	|     POST     	|                                   Creates a class(instance) of a course.                                   	|   [Create](#Create) 	|
| 12 	|   Form   	|    localhost:3000/api/forms/indicators   	|      GET     	|                                            Gets all indicators.                                            	|        [Get indicators](#GetAllIndicators)	|
| 13 	|   Form   	|    localhost:3000/api/forms/questions    	|      GET     	|                                             Gets all questions.                                            	|      [Get graduate attributes](#GetAllGraduateAttributes)   	|
| 14 	|   Form   	| localhost:3000/api/forms/grad_attributes 	|      GET     	|                                        Gets all graduate attributes.                                       	|    [Get questions](#GetAllQuestions)  	|


Routes Table of Contents
=================

<!--ts-->
   * [**Users**](#users)
      * [Register](#register)
      * [Login](#login)
   * [**Courses**](#courses)
      * [Get by name](#GetName)
      * [Get by objectid](#GetObjectId)
      * [Get all](#GetAll)
      * [Create](#create)
   * [**Classes**](#Classes)
       * [Get all by name](#GetAllName)
       * [Get by objectid](#GetObjectId)
       * [Get all](#GetAll)
       * [Create](#Create)
       * [Update](#Update)
   * [**Form**](#Forms)
      * [Get indicators](#Indicators)
      * [Get graduate attributes](#GraduateAttributes)
      * [Get questions](#Questions)
<!--te-->

Notes
============

* **All http responses are encoded in JSON.**

* **All http requests are encoded in JSON:** 
    `application/json` .
    
   * **Except Route #10 which requires one of two MIME types for *'content-type'* in a header field:** 
   
       `multipart/form-data` .
    
       OR
    
       `application/x-www-form-urlencoded` .
       
* **All http responses are encoded in JSON.**

* **If Routes are protected :**

	* **Auth Required:**
	    Yes

	     Then Bearer Authentication is required on routes:
	 * **Required:**

             * **Header:**
  
                `key=[{string}]`

                `value=["string"]`
    
	* **Constraints:**
	  
	    `key=[{string}]` :
	  
	     Must contain "Authorization"
	  
	    `value=["string"]` :
	  
	     Must be of form:  
	     `Token x`
	  
	     OR
	  
	     `Bearer x`
	    
	      where x is the string value of the signed JWT token.
        
	* **Sample Request Header:**
	    ```json
	    {
	        "key": "Authorization",
	        "value": "Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYmZiMWM1MzY4Mz
	                  c4NTU4NDU5M2NlYyIsInJvbGUiOiJpbnN0cnVjdG9yIiwiZXhwIjoxNTc4MDI3OTc0LCJpYXQiOjE1NzI4
	                  NDM5NzN9.frrVRoN0346B1VwNUaYorpiPEo28YAH3afVFyXptzHE"
	    }
	    ```
	    
	    
Users
============
Register
-----
```bash
  Registers a user and returns a JWT web token in response body. 
```

* **Route:** 

  localhost:3000/api/users
  
  
* **Request Type:** 
  
  POST
  
  
* **Auth Required:**

  No
  
  
* **Required:**

  * **Body:**

      `user=[{email,password}]`
  
      `email=[string]`
   
      `password=[string]`
  
  
* **Optional:**
  
   `user=[{role}]`
   
  `role=[string]`
  
* **Sample Request:**

```json  
{
	"user" : {
		"email" : "jinhao34@gmail.com",
		"password" : "69"
	}
}
```

```json  
{
	"user" : {
		"email" : "jinhao34@gmail.com",
		"password" : "69",
		"role" : "instructor
	}
}
```
  
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": {
        "email": "jinhao34@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkY..."
    }
}
```


* **Error Response:**

```json
 {
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "user-register": {
            "email": {
                "message": "is already taken",
                "name": "ValidatorError",
                "properties": {
                    "message": "is already taken",
                    "type": "unique",
                    "path": "email",
                    "value": "jinhao32@gmail.com"
                },
                "kind": "unique",
                "path": "email",
                "value": "jinhao32@gmail.com"
            }
        }
    },
    "result": {}
}
```

Login
-----
```bash
  Logs in the user using token based authentication.
```

* **Route:** 

  localhost:3000/api/users/login


* **Request Type:** 
  
  POST
  
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**

  * **Body:**
      `user=[{email,password}]`
  
      `email=[string]`
   
      `password=[string]`
  
  
* **Optional:**

  * **Body:**
  
      `user=[{role}]`
   
      `role=[string]`
  
* **Sample Request:**

```json  
{
	"user" : {
		"email" : "jinhao34@gmail.com",
		"password" : "69"
	}
}
```

```json  
{
	"user" : {
		"email" : "jinhao34@gmail.com",
		"password" : "69",
		"role" : "instructor"
	}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": {
        "email": "jinhao34@gmail.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYmZiMW..."
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "user-login": {
            "email or password": "is invalid"
        }
    },
    "result": {}
}
```


Courses
============
Create
-----
```bash
  Creates a class(instance) of a course.
```

* **Route:** 

  localhost:3000/api/courses
  
* **Request Type:** 
  
  POST
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**

  * **Body:**

      `course=[{name,faculty,status}]`
  
      `name=[string]`
   
      `faculty=[string]`
  
      `status=[string]`
  
  
* **Optional:**
  
  
  
* **Constraints:**

  `name=[string]` :   `faculty=[string]` :
  
   Name of course must correspond to a course offered within the faculty. 
   
   ENSE <=> Software Systems Engineering
   
   ENEL <=> Electronic Systems Engineering
   
   ENEV <=> Enviromental Systems Engineering
   
   ENPE <=> Petroleum Systems Engineering
   
   ENIN <=> Industrial Systems Engineering
   
   ENPC <=> Process Systems Engineering
   
  
* **Sample Request:**

```json  
{
	"course" : {
			"name": "ENEL564",
			"faculty": "Electronic Systems Engineering",
			"status": "active"	
		}
}
```

```json  
{
	"course" : {
			"name": "ENSE420",
			"faculty": "Software Systems Engineering",
			"status": "active"	
		}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": {
        "_id": "5dbfbf4c7b4d955ef486e2ba",
        "faculty": "Electronic Systems Engineering",
        "name": "ENEL564",
        "status": "active",
        "createdAt": "2019-11-04T22:01:15.993Z",
        "updatedAt": "2019-11-04T22:01:15.993Z",
        "__v": 0
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "course-create": "E11000 duplicate key error collection: test.Courses
	 index: faculty_1_name_1 dup key: { : \"Electronic Systems Engineering\",
	 : \"ENEL564\" }"
    },
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```


GetObjectId
-----
```bash
    Gets a course by the ObjectId. Example : '5dbfbf4c7b4d955ef486esba' . 
```

* **Route:** 

  localhost:3000/api/courses/id
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**

  * **Body:**

      `course=[{object_id}]`
  
  
* **Optional:**
  
  
  
* **Constraints:**

  `course=[{object_id}]` :
  
   The 12-byte ObjectId value represented as a hexadecimal string.
   
  
* **Sample Request:**

```json  
{
	"course" : {
			"object_id" : "5dbfbf4c7b4d955ef486e2ba"
		}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": {
        "_id": "5dbfbf4c7b4d955ef486e2ba",
        "faculty": "Electronic Systems Engineering",
        "name": "ENEL564",
        "status": "active",
        "createdAt": "2019-11-04T22:01:01.553Z",
        "updatedAt": "2019-11-04T22:01:01.553Z",
        "__v": 0
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "joi": [
            "course.object_id with value 5dbfbf4c7b4d955ef486esba fails to match the valid mongo id pattern"
        ]
    },
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```
GetName
-----
```bash
  Gets a course by the course name. Example : 'ENSE470' . 
```

* **Route:** 

  localhost:3000/api/courses
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**

  * **Body:**

      `course=[{name}]`
  
      `name=[string]`
  
  
* **Optional:**
  
  
  
* **Constraints:**

  `name=[string]` :
  
   Name must be of form: 
   
   ENSExxx
   
   ENELxxx
   
   ENEVxxx
   
   ENPExxx
   
   ENSExxx
   
   ENPCxxx
 
   where xxx = [number]
   
   Minimum value is : 000 and maximum value is : 999
   
   Example: ENSE200, ENEV470, ENEL420
  
* **Sample Request:**

```json  
{
	"course" : {
			"name": "ENEL564"
		}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": {
        "_id": "5dbfbf4c7b4d955ef486e2ba",
        "faculty": "Electronic Systems Engineering",
        "name": "ENEL564",
        "status": "active",
        "createdAt": "2019-11-04T22:01:26.993Z",
        "updatedAt": "2019-11-04T22:01:26.993Z",
        "__v": 0
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "course-get-name": "invalid course name"
    },
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```


GetAll
-----
```bash
  Gets all courses.
```

* **Route:** 

  localhost:3000/api/courses/all
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**
  
  
* **Optional:**
  
  
  
* **Constraints:**

  
* **Sample Request:**

```json  

```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "result": [
        {
            "_id": "5dbfbf4c7b4d955ef486e2ba",
            "faculty": "Electronic Systems Engineering",
            "name": "ENEL564",
            "status": "active",
            "createdAt": "2019-11-04T22:01:26.993Z",
            "updatedAt": "2019-11-04T22:01:26.993Z",
            "__v": 0
        },
        {
            "_id": "5dbfc6aea326183894be54b7",
            "faculty": "Electronic Systems Engineering",
            "name": "ENEL568",
            "status": "active",
            "createdAt": "2019-11-04T22:01:26.993Z",
            "updatedAt": "2019-11-04T22:01:26.993Z",
            "__v": 0
        }
    ],
    "errors": []
}
```

* **Error Response:**

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```

Classes
============
Create
-----
```bash
  Creates a class.
```

* **Route:** 

  localhost:3000/api/classes/
  
* **Request Type:** 
  
  POST
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**

    * **Body:**

      `class=[{name,faculty,term,year,status}]`
  
      `name=[string]`
      
      `faculty=[string]`
      
      `term=[string]`
	    
      `year=[number]`
      
      `status=[number]`
  
* **Optional:**
  
  
  
* **Constraints:**

  `name=[string]` :   `faculty=[string]` :
  
   Name of course must correspond to a course offered within the faculty. 
   
   ENSE <=> Software Systems Engineering
   
   ENEL <=> Electronic Systems Engineering
   
   ENEV <=> Enviromental Systems Engineering
   
   ENPE <=> Petroleum Systems Engineering
   
   ENIN <=> Industrial Systems Engineering
   
   ENPC <=> Process Systems Engineering
   
   `term=[string]`:
   
   Must be one of
   
   Spring
   
   Summer
   
   Fall
   
   Winter
   
   `year=[number]` :
   
   Must be current year. 
   
   `status=[number]` :
   
   Must be either:
   
   Active
   
   Inactive
  
* **Sample Request:**

```json  
{
	"class" : {
			"name": "ENEL568",
		    "faculty": "Software Systems Engineering",
		    "term": "Fall",
		    "status": "inactive",
		    "year": 2019
		}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": {
        "classes": [
            "5dbfcbe972b9e372f011dda0"
        ],
        "_id": "5dbfb1c53683785584593cec",
        "role": "instructor",
        "email": "jinhao34@gmail.com",
        "salt": "3a688a0ac56c7301bec42e2eaab44333",
        "hash": "50dbaa6bbb23c7a5a7510bdd2f9ba5fd9631807b46a080d116a3...",
        "createdAt": "2019-11-04T22:01:26.993Z",
        "updatedAt": "2019-11-04T22:01:26.993Z",
        "__v": 1
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "joi": [
            "class.name with value ENEL568 fails to match the required pattern: /^ENSE\\d{3}$/"
        ]
    },
    "result": {}
}
```
*note: this error has multiple variations if regex pattern does not match*

OR 

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "class-create": "couldnt find existing course to create class for"
    },
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```

GetAllName
-----
```bash
  Gets classes by name. Note: assumes prof can teach same class in the same academic
  year more than once. Hence, there can be more than 1 match.
```

* **Route:** 

  localhost:3000/api/classes/
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**

    * **Body:**

      `class=[{name}]`
  
      `name=[string]`
  
* **Optional:**
  
  
  
* **Constraints:**

  `name=[string]` :
  
   Name must be of form: 
   
   ENSExxx
   
   ENELxxx
   
   ENEVxxx
   
   ENPExxx
   
   ENSExxx
   
   ENPCxxx
   
   where xxx = [number]
   
   Minimum value is : 000 and maximum value is : 999
   
   Example: ENSE200, ENEV470, ENEL420
  
* **Sample Request:**

```json  
{
	"class" : {
			"name": "ENEL568"
		}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": [
        {
            "instructor_ids": [
                "5dbfb1c53683785584593cec"
            ],
            "graduate_attributes": [],
            "indicators": [],
            "_id": "5dbfcbe972b9e372f011dda0",
            "course_id": {
                "_id": "5dbfbf4c7b4d955ef486e2ba",
                "faculty": "Electronic Systems Engineering",
                "name": "ENEL564",
                "status": "active",
                "createdAt": "2019-11-04T22:01:26.993Z",
                "updatedAt": "2019-11-04T22:01:26.993Z",
                "__v": 0
            },
            "status": "inactive",
            "year": 2019,
            "term": "Fall",
            "questions_answers": [],
            "createdAt": "2019-11-04T22:01:26.993Z",
            "updatedAt": "2019-11-04T22:01:26.993Z",
            "__v": 0
        }
    ]
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "joi": [
            "class.name with value ENEL5623 fails to match the 
	    required pattern: /^(ENEL|ENSE|ENPE|ENPC|ENIN|ENEV)\\d{3}$/"
        ]
    },
    "result": {}
}
```

OR

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "class-get-name": "user does not have any matching classes with given name"
    },
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```


GetObjectId
-----
```bash
  Gets a class by the ObjectId.
```

* **Route:** 

  localhost:3000/api/classes/id
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**

    * **Body:**

      `class=[{object_id}]`
  
      `object_id=[ObjectId]`
  
* **Optional:**
  
  
  
* **Constraints:**

  `object_id=[ObjectId]` :
  
The 12-byte ObjectId value represented as a hexadecimal string.
  
* **Sample Request:**

```json  
{
	"class" : {
			"object_id": "5dbfcbe972b9e372f011dda0"
		}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": [
        {
            "instructor_ids": [
                "5dbfb1c53683785584593cec"
            ],
            "graduate_attributes": [],
            "indicators": [],
            "_id": "5dbfcbe972b9e372f011dda0",
            "course_id": "5dbfbf4c7b4d955ef486e2ba",
            "status": "inactive",
            "year": 2019,
            "term": "Fall",
            "questions_answers": [],
            "createdAt": "2019-11-04T06:57:45.994Z",
            "updatedAt": "2019-11-04T06:57:45.994Z",
            "__v": 0
        }
    ]
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "joi": [
            "class.object_id with value 42 fails to match the valid mongo id pattern"
        ]
    },
    "result": {}
}
```

OR

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "class-get-id": "couldnt find class by ObjectId"
    },
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```

GetAll
-----
```bash
  Returns all the classes for a user.
```

* **Route:** 

  localhost:3000/api/classes/all
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**

    * **Body:**

  
* **Optional:**
  
  
  
* **Constraints:**


  
* **Sample Request:**

```json  
{
	"class" : {
			"object_id": "5dbfcbe972b9e372f011dda0"
		}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": [
        {
            "instructor_ids": [
                "5dbfb1c53683785584593cec"
            ],
            "graduate_attributes": [],
            "indicators": [],
            "_id": "5dbfcbe972b9e372f011dda0",
            "course_id": {
                "_id": "5dbfbf4c7b4d955ef486e2ba",
                "faculty": "Electronic Systems Engineering",
                "name": "ENEL564",
                "status": "active",
                "createdAt": "2019-11-04T22:01:26.993Z",
                "updatedAt": "2019-11-04T22:01:26.993Z",
                "__v": 0
            },
            "status": "inactive",
            "year": 2019,
            "term": "Fall",
            "questions_answers": [],
            "createdAt": "2019-11-04T22:01:26.993Z",
            "updatedAt": "2019-11-04T22:01:26.993Z",
            "__v": 0
        },
        {
            "instructor_ids": [
                "5dbfb1c53683785584593cec"
            ],
            "graduate_attributes": [],
            "indicators": [],
            "_id": "5dbfed6d46544022e8463d96",
            "course_id": {
                "_id": "5dbfbf4c7b4d955ef486e2ba",
                "faculty": "Electronic Systems Engineering",
                "name": "ENEL564",
                "status": "active",
                "createdAt": "2019-11-04T22:01:26.993Z",
                "updatedAt": "2019-11-04T22:01:26.993Z",
                "__v": 0
            },
            "status": "inactive",
            "year": 2019,
            "term": "Winter",
            "questions_answers": [],
            "createdAt": "2019-11-04T22:01:26.993Z",
            "updatedAt": "2019-11-04T22:01:26.993Z",
            "__v": 0
        }
    ]
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "class-get-all": "couldnt find any class for user"
    },
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```

Update
-----
```bash
  Updates an exisiting class.
```

* **Route:** 

  localhost:3000/api/classes/
  
* **Request Type:** 
  
  PUT
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**

*note: request must be sent with multipart/form-data encryption*

    * **Body:**
    
    `graduateattr=[string]`

    `indicator=[string]`
    
    `exceeds_doc=[file]`
    
    `meets_doc=[file]`
    
    `developing_doc=[file]`
    
    `fail_doc=[file]`
    
    `questions=[array[string]]`
    
    `answers=[array[string]]`

    `class_id=[ObjectId]`
    
    `exceeds=[{criteria,grade}]`
    
    `exceeds[criteria]=[string]`
    
    `exceeds[grade]=[string]`
    
    `meets=[{criteria,grade}]`
    
    `meets[criteria]=[string]`
    
    `meets[grade]=[string]`
    
    `developing=[{criteria,grade}]`
    
    `developing[criteria]=[string]`
    
    `developing[grade]=[string]`
    
    `fail=[{criteria,grade}]`
    
    `fail[criteria]=[string]`
    
    `fail[grade]=[string]`
  
* **Optional:**
  
  
  
* **Constraints:**

    `graduateattr=[string]` :
    
    Max Length: 50 characters
    
    `indicator=[string]` :
    
    Max Length: 50 characters
    
    `exceeds_doc=[file]` :
    
    Must be of type: doc,txt, or pdf
    
    `meets_doc=[file]` :
    
    Must be of type: doc,txt, or pdf
    
    `developing_doc=[file]` :
    
    Must be of type: doc,txt, or pdf
       
    `fail_doc=[file]` :
    
    Must be of type: doc,txt, or pdf
    
    `questions=[array[string]]` :
    
    Array length must be same as answers array length. Max length for each question of 500 characters.
    
    `answers=[array[string]]` : 
    
    Array length must be same as questions array length. Max length for each answer of 150 characters.
    
    `exceeds=[{criteria,grade}]`
    
    Criteria: Max Length 500 characters. 

    Grade: Between 0 and 100. 
    
    `meets=[{criteria,grade}]`
    
    Criteria: Max Length 500 characters. 

    Grade: Between 0 and 100. 
    
    `developing=[{criteria,grade}]`
    
    Criteria: Max Length 500 characters. 

    Grade: Between 0 and 100. 
    
    `fail=[{criteria,grade}]`
    
    Criteria: Max Length 500 characters. 

    Grade: Between 0 and 100. 
 

  
* **Sample Request:**

```json  

```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": {
        "evaluation_report": {
            "exceeds": {
                "criteria": "Can he fly? ",
                "grade": 10,
                "documents": "uploads\\docs\\3ade1841855fe2fb8cfc9a85a6b00faa"
            },
            "meets": {
                "criteria": "Can he swim?",
                "grade": 23,
                "documents": "uploads\\docs\\a8d4d7b83c622ad5889c4ae41f4b6d27"
            },
            "developing": {
                "criteria": "Can he breathe?",
                "grade": 45,
                "documents": "uploads\\docs\\32687d1890ce927d1221f2ff8ce06382"
            },
            "fail": {
                "criteria": "Can he talk?",
                "grade": 69,
                "documents": "uploads\\docs\\8708c43effa7b58a1061c127abe85da0"
            }
        },
        "instructor_ids": [
            "5dbfb1c53683785584593cec"
        ],
        "graduate_attributes": [
            "Lambda"
        ],
        "indicators": [
            "GoodLife"
        ],
        "_id": "5dbfcbe972b9e372f011dda0",
        "course_id": "5dbfbf4c7b4d955ef486e2ba",
        "status": "inactive",
        "year": 2019,
        "term": "Fall",
        "questions_answers": [
            {
                "question": "How r u?",
                "answer": "Wow"
            },
            {
                "question": "How is ur day?",
                "answer": "Cool"
            },
            {
                "question": "What r u doing?",
                "answer": "Gogo"
            },
            {
                "question": "Wow How Cool?",
                "answer": "Dogger"
            },
            {
                "question": "Yolo Squad yoshi?",
                "answer": "Logger"
            }
        ],
        "createdAt": "2019-11-04T22:01:26.993Z",
        "updatedAt": "2019-11-04T22:01:26.993Z",
        "__v": 1
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "class-update": "couldnt find class that is being updated"
    },
    "result": {}
}
```
*note: error has lots of varations based on invalid input fields*

OR

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "class-update": {
            "joi": [
                "graduateattr is required"
            ]
        }
    },
    "result": {}
}
```
*note: error has lots of varations based on invalid input fields*

OR

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "class-update": {
            "joi": [
                "developing.grade must be a number"
            ]
        }
    },
    "result": {}
}
```
*note: error has lots of varations based on invalid input fields*

OR 

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": {
        "class-update": {
            "name": "MulterError",
            "code": "Invalid file ext supplied for documents",
            "storageErrors": []
        }
    },
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```

Form
============
GetAllIndicators
-----
```bash
  Gets all indicators.
```

* **Route:** 

  localhost:3000/api/forms/indicators
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**
  
  
* **Optional:**
  
  
  
* **Constraints:**

  
* **Sample Request:**

```json  

```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": [
        "communication",
        "problem solving",
        "critical thinking",
        "design",
        "technical report writing"
    ]
}
```

* **Error Response:**

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```

GetAllGraduateAttributes
-----
```bash
  Gets all graduate attributes.
```

* **Route:** 

  localhost:3000/api/forms/grad_attributes
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**
  
  
* **Optional:**
  
  
  
* **Constraints:**

  
* **Sample Request:**

```json  

```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": [
        "knowledge base for learning",
        "problem base analysis",
        "life long learning"
    ]
}
```

* **Error Response:**

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```

GetAllQuestions
-----
```bash
  Gets all questions.
```

* **Route:** 

  localhost:3000/api/forms/questions
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Required:**
  
  
* **Optional:**
  
  
  
* **Constraints:**

  
* **Sample Request:**

```json  

```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": {},
    "result": [
        "what's a xylophone?",
        "what's the longest river in the world?",
        "what is your favorite ice cream flavor?",
        "which do you like better, Coke or Pepsi?",
        "do you have any pet peeves?"
    ]
}
```

* **Error Response:**

```json
{
    "status": "401 (Unauthorized)",
    "errors": {
        "auth": "Unauthorized access to protected route."
    },
    "result": {}
}
```
