# oba-server

This project contains the backend code for the OBA server.

The architecture of this project is intended to mimic the [Node (Express + Mongoose)](https://github.com/gothinkster/node-express-realworld-example-app) example application.

# API Documentation 
The end points described below are meant to serve JSON to the oba-client.

Documentation style follows @iros REST api documentation.

# Table of Contents

<!--ts-->
 * [**Users**](#users)
     * [Register](#register)
     * [Login](#login)
 * [**Courses**](#courses)
     * [Get by name](#GetName)
     * [Get all](#GetAll)
     * [Create](#create)
 * [**Classes**](#Classes)
     * [Get all by name](#GetAllName)
     * [Get all](#GetAll)
     * [Update](#Update)
 * [**Form**](#Form)
     * [Indicators](#GetIndicatorByNumber)
       * [Get by number](#GetIndicatorByNumber)
       * [Get all](#GetAllIndicators)
       * [Create](#CreateIndicator)
       * [Update](#UpdateIndicator)
     * [Graduate Attributes](#GetGraduateAttributeByNumber)
       * [Get by number](#GetGraduateAttributeByNumber)
       * [Get all](#GetAllGraduateAttributes)
       * [Create](#CreateGraduateAttribute)
       * [Update](#UpdateGraduateAttribute)
     * [Questions](#GetAllQuestions)
       * [Get all](#GetAllQuestions)
<!--te-->

# API Endpoints Table
|  # 	| Category 	|                 Route URL                	| Request Type 	|                                                    Desc                                                    	| More Info 	|
|:--:	|:--------:	|:----------------------------------------:	|:------------:	|:----------------------------------------------------------------------------------------------------------:	|:---------:	|
|  1 	|   User   	|         localhost:3000/api/users         	|      POST     	|                       Registers a user and returns a JWT web token in response body.                       	|    [Register](#register)   	|
|  2 	|   User   	|      localhost:3000/api/users/login      	|     POST     	|                             Logs in the user using token based authentication.                             	|    [Login](#login)   	|
|  3 	|  Course  	|        localhost:3000/api/courses        	|      GET     	|                                           Gets a course by name.                                           	|      [Get by name](#GetName)   	|
|  4 	|  Course  	|      localhost:3000/api/courses/all      	|      GET     	|                                              Gets all courses.                                             	|     [Get all](#GetAll)   	|
|  5 	|  Course  	|     localhost:3000/api/courses/create    	|     POST     	|                                          Creates a UNIQUE course.                                          	|     [Create](#create)   	|
|  6 	|   Class  	|        localhost:3000/api/classes        	|      GET     	| Gets classes by name. Can return more than one class if multiple are offered in same year different terms. 	|     [Get all by name](#GetAllName)   	|
|  7 	|   Class  	|      localhost:3000/api/classes/all      	|      GET     	|                                              Gets all classes.                                             	|       [Get all](#GetAll)	|
| 8 	|   Class  	|        localhost:3000/api/classes        	|      PUT     	|                                     Updates an existing class instance. If a class does not exisit, a new one will be created.                                    	|     [Update](#Update)   	|
| 9 	|   Form   	|    localhost:3000/api/forms/indicator   	|      GET     	|                                            Get indicator by a unique identification number.                                            	|        [Get by number](#GetIndicatorByNumber)	|
| 10 	|   Form   	|    localhost:3000/api/forms/indicators   	|      GET     	|                                            Get all indicators.                                            	|        [Get all](#GetAllIndicators)	|
| 11 	|   Form   	|    localhost:3000/api/forms/indicator   	|      POST     	|                                            Create a new UNIQUE indicator.                                            	|        [Create](#CreateIndicator)	|
| 12 	|   Form   	|    localhost:3000/api/forms/indicator   	|      PUT     	|                                            Update an exisiting indicator.                                            	|        [Update](#UpdateIndicator)	|
| 13 	|   Form   	| localhost:3000/api/forms/grad_attribute 	|      GET     	|                                        Gets graduate attribute by a unique identification number.                                       	|    [Get by number](#GetGraduateAttributeByNumber)  	|
| 14 	|   Form   	| localhost:3000/api/forms/grad_attributes 	|      GET     	|                                        Gets all graduate attributes.                                       	|    [Get all](#GetAllGraduateAttributes)  	|
| 15 	|   Form   	| localhost:3000/api/forms/grad_attribute 	|      POST     	|                                        Create a new UNIQUE graduate attribute.                                       	|    [Create](#CreateGraduateAttribute)  	|
| 16 	|   Form   	| localhost:3000/api/forms/grad_attribute 	|      PUT     	|                                        Updates an exisiting graduate attribute.                                       	|    [Update](#UpdateGraduateAttribute)  	|
| 17 	|   Form   	|    localhost:3000/api/forms/questions    	|      GET     	|                                             Gets all questions.                                            	|      [Get all](#GetAllQuestions)   	|


Notes
============

* **Authorization:**

    If **auth required** is listed for an endpoint, then Bearer Authentication is required.

    * **Header:**
	 
	|          	|                 Authorization                 	|
	|:--------:	|:---------------------------------------------:	|
	| Required 	|                       x                       	|
	| Optional 	|                                               	|
	|   Notes  	| Valid format: Token jwttoken or Bearer jwttoken 	|    
     
     
     
    * **Sample Header Request:**
    
	
	| Field Type 	|   Field Name  	|             Field Value             	|
	|:----------:	|:-------------:	|:-----------------------------------:	|
	|     key    	| Authorization 	| Token eyJhbGciOiJIUzI1NiIsInR5cC... 	|    


	OR    


	| Field Type 	|   Field Name  	|             Field Value             	|
	|:----------:	|:-------------:	|:-----------------------------------:	|
	|     key    	| Authorization 	|   Bearer eyJhbGciOiJIUzI1NiIsIn...  	|    
	        
	    
	    
* **Premission Levels:**	

    Premission levels based on user role field.

	|      Premission type     	| Access Level 	|
	|:------------------------:	|:------------:	|
	|        read_local        	|       1      	|
	|        write_local       	|       2      	|
	|  read_local_write_local  	|       3      	|
	|       read_faculty       	|       4      	|
	| read_faculty_write_local 	|       5      	|
	|         read_all         	|       8      	|

	<br/>

	|                   	| Professor 	| Program Chair 	| Staff 	|
	|:-----------------:	|:---------:	|:-------------:	|:-----:	|
	| Premission Levels 	|     3     	|       5       	|   8   	|
	
    The values can be configured via the misc-data.json:
    ```json
        "premissions" : {
      "read_local" : 1,
      "write_local" : 2,
      "read_local_write_local" : 3,
      "read_faculty": 4,
      "read_faculty_write_local": 5,
      "read_all" : 8
    },
    "role_access_levels" : {
      "Professor" : 3,
      "Program Chair" : 5,
      "Staff" : 8
    }
    ``` 
	
* **Status Updates:**

    Class documents are automatically updated on certain time periods yearily based on the term. At the time listed below all class documents will be scanned in the database for the current term to see if any need to be marked with the status field set to "Late".
    
    By default they are:
    
    |       Term      	|  Fall 	| Winter 	| Spring/Summer 	|
    |:---------------:	|:-----:	|:------:	|:-------------:	|
    | Late Check Date 	| Jan 1 	|  May 1 	|     Sept 1    	|
    
    The values can be configured via the misc-data.json:
    
```json 
    "late_policies": [
      {
        "Fall": {
          "Month": "January",
          "Day": 1
        },
        "Winter": {
          "Month": "May",
          "Day": 1
        },
        "Spring/Summer": {
          "Month": "September",
          "Day": 1
        }
      }
    ]
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
  
  
* **Content Type:** 
 
    `multipart/form-data` .
    
    OR
    
    `application/x-www-form-urlencoded` .
  
  
* **Auth Required:**

  No
  
* **Body:**

|          	|                Email                	|                        Password                       	|                       Role                      	|                                                                                                      Faculty                                                                                                     	|                        Avatar                        	|
|:--------:	|:-----------------------------------:	|:-----------------------------------------------------:	|:-----------------------------------------------:	|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:----------------------------------------------------:	|
| Required 	|                  x                  	|                           x                           	|                        x                        	|                                                                                                         x                                                                                                        	|                                                      	|
| Optional 	|                                     	|                                                       	|                                                 	|                                                                                                                                                                                                                  	|                           x                          	|
|   Notes  	| Regex: ^[a-zA-Z0-9._~]+@uregina.ca$ 	| Regex: ^(?=.{6,})(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$ 	| Allowed Values: Professor, Program Chair, Staff 	| Allowed Values: Software Systems Engineering,  Electronic Systems Engineering,  Environmental Systems Engineering,  Industrial Systems Engineering,  Petroleum Systems Engineering,  Process Systems Engineering 	| Allowed MIME Types: image/bmp, image/jpeg, image/png 	|
  
 
* **Sample Request:**

| Field Type 	| Field Name 	|          Field Value         	|
|:----------:	|:----------:	|:----------------------------:	|
|    text    	|    email   	|    wowcoolemail@uregina.ca   	|
|    text    	|  password  	|          dragonBall1         	|
|    text    	|    role    	|           Professor          	|
|    text    	|   faculty  	| Software Systems Engineering 	|
|    file    	|   avatar   	|               -              	|
  
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "email": "wowcoolemail@uregina.ca",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "avatar": "uploads\\avatars\\273f8bfdc33229b98a465bd959fc13b3"
    }
}
```


OR


```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "email": "wowcoolemail@uregina.ca",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
    }
}
```


* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        "user already exists"
    ],
    "result": {}
}
```


OR


```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        [
            {
                "message": "\"role\" is required",
                "path": [
                    "role"
                ],
                "type": "any.required",
                "context": {
                    "label": "role",
                    "key": "role"
                }
            }
        ]
    ],
    "result": {}
}
```


OR


```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        [
            {
                "message": "\"password\" is required",
                "path": [
                    "password"
                ],
                "type": "any.required",
                "context": {
                    "label": "password",
                    "key": "password"
                }
            }
        ]
    ],
    "result": {}
}
```

OR


```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        [
            {
                "message": "\"faculty\" is required",
                "path": [
                    "faculty"
                ],
                "type": "any.required",
                "context": {
                    "label": "faculty",
                    "key": "faculty"
                }
            }
        ]
    ],
    "result": {}
}
```

OR

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        {
            "name": "MulterError",
            "code": "Invalid file ext supplied for avatar",
            "storageErrors": []
        }
    ],
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
  
  
* **Content Type:** 
 
    `application/json` .
  
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

|          	|                 Email                	|                      Password                     	|
|:--------:	|:------------------------------------:	|:-------------------------------------------------:	|
| Required 	|                   x                  	|                         x                         	|
| Optional 	|                                      	|                                                   	|
|   Notes  	| Regex: ^[a-zA-Z0-9._~] +@uregina.ca$ 	| Regex: ^(?=.{6,})(?=.[0-9])(?=.[a-z])(?=.[A-Z]).$ 	|
  
* **Sample Request:**

```json  
{ 
   "user":{ 
      "email":"whatacoolemail@uregina.ca",
      "password":"69"
   }
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "email": "whatacoolemail@uregina.ca",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....",
        "avatar": "uploads\\avatars\\273f8bfdc33229b98a465bd959fc13b3"
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        "unable to authenticate user. Invalid email or pass."
    ],
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
  
  
* **Content Type:** 
 
    `application/json` .
  
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

|          	|                                           Name                                          	|                                                                                                                     Faculty                                                                                                                     	|
|:--------:	|:---------------------------------------------------------------------------------------:	|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|
| Required 	|                                            x                                            	|                                                                                                                        x                                                                                                                        	|
| Optional 	|                                                                                         	|                                                                                                                                                                                                                                                 	|
|   Notes  	| Valid Types(x are digits, Y optional letters):   ENSExxxYY,      ENELxxxYY,      ENEVxxxYY,      ENPExxxYY,      ENINxxxYY,      ENPCxxxYY,      ENGGxxxYY 	| Valid Types:    Software Systems Engineering,         Electronic Systems Engineering,         Environmental Systems Engineering,         Petroleum Systems Engineering,          Industrial Systems Engineering ,        Process Systems Engineering,        General Engineering 	|
  
* **Sample Request:**

```json  
{ 
   "course":{ 
      "name":"ENEL564",
      "faculty":"Electronic Systems Engineering"
   }
}
```

```json  
{ 
   "course":{ 
      "name":"ENSE420",
      "faculty":"Software Systems Engineering"
   }
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "_id": "5ddb8a4dcf136d5ab0307954",
        "faculty": "Software Systems Engineering",
        "name": "ENSE320",
        "createdAt": "2019-11-25T23:59:52.432Z",
        "updatedAt": "2019-11-25T23:59:52.432Z",
        "__v": 0
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        [
            {
                "message": "\"course.name\" with value \"ENSE350\" fails to match the required pattern:
		/^ENEL\\d{3}$/",
                "path": [
                    "course",
                    "name"
                ],
                "type": "string.pattern.base",
                "context": {
                    "regex": {},
                    "value": "ENSE350",
                    "label": "course.name",
                    "key": "name"
                }
            }
        ]
    ],
    "result": {}
}
```

*note: this error has multiple variations if regex pattern does not match*

OR

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        "unable to authenticate user. Invalid email or pass."
    ],
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

GetName
-----
```bash
  Gets a course by the course name. 
```

* **Route:** 

  localhost:3000/api/courses
  
* **Request Type:** 
  
  GET
  
  
* **Content Type:** 
 
    `application/json` .
  
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

|          	|                                           Name                                          		|
|:--------:	|:---------------------------------------------------------------------------------------:		|
| Required 	|                                            x                                            		|
| Optional 	|                                                                                         		|
|   Notes  	| Valid Types(x digits, y letters):   ENSExxxYY      ENELxxxYY      ENEVxxxYY      ENPExxxYY      ENINxxxYY      ENPCxxxYY      ENGGxxxYY 	|
  
* **Sample Request:**

```json  
{ 
   "course":{ 
      "name":"ENEL564"
   }
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "_id": "5dbfbf4c7b4d955ef486e2ba",
        "faculty": "Electronic Systems Engineering",
        "name": "ENEL150",
        "createdAt": "2019-11-25T23:59:52.432Z",
        "updatedAt": "2019-11-25T23:59:52.432Z",
        "__v": 0
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        "invalid course name"
    ],
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```


GetAll
-----
```bash
  Gets all courses. 
  All user roles are able to retrieve all courses unrestricted from the db.
```

* **Route:** 

  localhost:3000/api/courses/all
  
* **Request Type:** 
  
  GET
  
  
* **Content Type:** 
 
    `application/json` .
  
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

  
* **Sample Request:**

```json  

```
  
* **Success Response:**

Sample response for staff:
(can see all classes)

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": [
        {
            "_id": "5dbfbf4c7b4d955ef486e2ba",
            "faculty": "Electronic Systems Engineering",
            "name": "ENEL564",
            "status": "active",
            "createdAt": "2019-11-04T06:00:56.121Z",
            "updatedAt": "2019-11-04T06:00:56.121Z",
            "__v": 0
        },
        {
            "_id": "5dbfc6aea326183894be54b7",
            "faculty": "Software Systems Engineering",
            "name": "ENSE568",
            "status": "active",
            "createdAt": "2019-11-04T06:35:26.722Z",
            "updatedAt": "2019-11-04T06:35:26.722Z",
            "__v": 0
        },
        {
            "_id": "5dc09fb687b1d9760494352a",
            "faculty": "Electronic Systems Engineering",
            "name": "ENEL590",
            "status": "active",
            "createdAt": "2019-11-04T22:01:26.993Z",
            "updatedAt": "2019-11-04T22:01:26.993Z",
            "__v": 0
        },
        {
            "_id": "5ddb8a4dcf136d5ab0307954",
            "faculty": "Software Systems Engineering",
            "name": "ENSE350",
            "createdAt": "2019-11-25T08:01:17.092Z",
            "updatedAt": "2019-11-25T08:01:17.092Z",
            "__v": 0
        },
        {
            "_id": "5ddc6af8b2f47a80184c4292",
            "faculty": "Electronic Systems Engineering",
            "name": "ENEL359",
            "createdAt": "2019-11-25T23:59:52.432Z",
            "updatedAt": "2019-11-25T23:59:52.432Z",
            "__v": 0
        }
    ]
}
```

*results vary based on the premission role of the user*

* **Error Response:**

```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

Classes
============

GetAllName
-----
```bash
  Gets classes by name. 
  Profs can only see their classes with the matching input class name.
  Program chairs can see classes within the faculty and their own that match the input class name.
  Staff can see all classes that match the input class name.
```

* **Route:** 

  localhost:3000/api/classes/
  
* **Request Type:** 
  
  GET
  
  
* **Content Type:** 
 
    `application/json` .
  
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

|          	|                                           Name                                          	|
|:--------:	|:---------------------------------------------------------------------------------------:	|
| Required 	|                                            x                                            	|
| Optional 	|                                                                                         	|
|   Notes  	| Valid Types:   ENSExxx      ENELxxx      ENEVxxx      ENPExxx      ENINxxx      ENPCxxx      ENGGxxx 	|
  
* **Sample Request:**

```json  
{ 
   "class":{ 
      "name":"ENSE110"
   }
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": [
        {
            "_id": "5ddb92f40d3037f9f1a62909",
            "course_id": {
                "_id": "5ddb8a4dcf136d5ab0307954",
                "faculty": "Software Systems Engineering",
                "name": "ENSE110",
                "createdAt": "2019-11-04T06:00:56.121Z",
                "updatedAt": "2019-11-04T06:00:56.121Z",
                "__v": 0
            },
            "instructor_id": "5dd8ca8b6cc68874201ec5f8",
            "term": "Fall",
            "__v": 2,
            "createdAt": "2019-11-04T06:00:56.121Z",
            "updatedAt": "2019-11-04T06:00:56.121Z",
            "data": [
                {
                    "evaluation_report": {
                        "exceeds": {
                            "criteria": "criteria text here",
                            "grade": 32,
                            "documents": "uploads\\docs\\98a1ed3414f41a89546816faa5a7395f"
                        },
                        "meets": {
                            "criteria": "criteria text here",
                            "grade": 31,
                            "documents": ""
                        },
                        "developing": {
                            "criteria": "criteria text here",
                            "grade": 33,
                            "documents": ""
                        },
                        "fail": {
                            "criteria": "criteria text here",
                            "grade": 90,
                            "documents": ""
                        }
                    },
                    "_id": "5ddb92f480cfea7ef0d502ad",
                    "questions_answers": [
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                        {
                            "question": "some question",
                            "answer": "some ans"
                        }
                    ],
                    "grad_attribute": "CriticalThinking",
                    "indicator": "lolz"
                }
            "status": "Complete"
        },
        {
            "_id": "5ddb95850d3037f9f1a6959e",
            "course_id": {
                "_id": "5ddb8a4dcf136d5ab0307954",
                "faculty": "Software Systems Engineering",
                "name": "ENSE110",
                "createdAt": "2019-11-04T06:00:56.121Z",
                "updatedAt": "2019-11-04T06:00:56.121Z",
                "__v": 0
            },
            "instructor_id": "5dd8ca8b6cc68874201ec5f8",
            "term": "Spring/Summer",
            "__v": 2,
            "createdAt": "2019-11-04T06:00:56.121Z",
            "updatedAt": "2019-11-04T06:00:56.121Z",
            "data": [
                {
                    "evaluation_report": {
                        "exceeds": {
                            "criteria": "criteria text here",
                            "grade": 32,
                            "documents": "uploads\\docs\\99cdf27bb2247d3a79ba888ffd6195ca"
                        },
                        "meets": {
                            "criteria": "criteria text here",
                            "grade": 31,
                            "documents": ""
                        },
                        "developing": {
                            "criteria": "criteria text here",
                            "grade": 33,
                            "documents": ""
                        },
                        "fail": {
                            "criteria": "criteria text here",
                            "grade": 90,
                            "documents": ""
                        }
                    },
                    "_id": "5ddb95856bfb4bb3b838b701",
                    "questions_answers": [
                        {
                            "question": "question here",
                            "answer": "answer here"
                        },
                        {
                            "question": "question here",
                            "answer": "answer here"
                        },
                        {
                            "question": "question here",
                            "answer": "answer here"
                        },
                        {
                            "question": "answer here",
                            "answer": "answer here"
                        }
                    ],
                    "grad_attribute": "CriticalThinking",
                    "indicator": "lolz"
                },
                {
                    "_id": "5ddb95856bfb4bb3b838b702",
                    "questions_answers": [],
                    "grad_attribute": "Listening",
                    "indicator": "lulzec"
                }
            ],
            "status": "Incomplete"
        }
    ]
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        [
            {
                "message": "\"class.name\" with value \"ENSs350\" fails to match the required pattern:
		/^(ENEL|ENSE|ENPE|ENPC|ENIN|ENEV)\\d{3}$/",
                "path": [
                    "class",
                    "name"
                ],
                "type": "string.pattern.base",
                "context": {
                    "regex": {},
                    "value": "ENSs350",
                    "label": "class.name",
                    "key": "name"
                }
            }
        ]
    ],
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

GetAll
-----
```bash
  Returns all the classes.
  User role determines records retrieved. See permissions table at the top.
  Professors can only see their own classes.
  Program Chairs can see their own classes and all classes inside their faculty(not their own). 
  Staff can see all classes in the db unrestricted.
```

* **Route:** 

  localhost:3000/api/classes/all
  
* **Request Type:** 
  
  GET
  
  
* **Content Type:** 
 
    `application/json` .
  
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

  
* **Sample Request:**

```json  
```
  
* **Success Response:**

*Sample request for staff:*

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": [
        {
            "_id": "5ddb92f40d3037f9f1a62909",
            "course_id": {
                "_id": "5ddb8a4dcf136d5ab0307954",
                "faculty": "Software Systems Engineering",
                "name": "ENSE110",
                "createdAt": "2019-11-04T06:00:56.121Z",
                "updatedAt": "2019-11-04T06:00:56.121Z",
                "__v": 0
            },
            "instructor_id": "5dd8ca8b6cc68874201ec5f8",
            "term": "Fall",
            "__v": 2,
            "createdAt": "2019-11-04T06:00:56.121Z",
            "updatedAt": "2019-11-04T06:00:56.121Z",
            "data": [
                {
                    "evaluation_report": {
                        "exceeds": {
                            "criteria": "criteria text here",
                            "grade": 32,
                            "documents": "uploads\\docs\\98a1ed3414f41a89546816faa5a7395f"
                        },
                        "meets": {
                            "criteria": "criteria text here",
                            "grade": 31,
                            "documents": ""
                        },
                        "developing": {
                            "criteria": "criteria text here",
                            "grade": 33,
                            "documents": ""
                        },
                        "fail": {
                            "criteria": "criteria text here",
                            "grade": 90,
                            "documents": ""
                        }
                    },
                    "_id": "5ddb92f480cfea7ef0d502ad",
                    "questions_answers": [
                        {
                            "question": "question here",
                            "answer": "answer here"
                        },
                        {
                            "question": "question here",
                            "answer": "answer here"
                        },
                        {
                            "question": "question here",
                            "answer": "answer here"
                        },
                        {
                            "question": "answer here",
                            "answer": "answer here"
                        }
                    ],
                    "grad_attribute": "CriticalThinking",
                    "indicator": "lolz"
                },
                {
                    "_id": "5ddb92f480cfea7ef0d502ae",
                    "questions_answers": [],
                    "grad_attribute": "Listening",
                    "indicator": "lulzec"
                }
            ],
            "status": "Complete"
        },
        {
            "_id": "5ddb934e0d3037f9f1a637cf",
            "course_id": {
                "_id": "5dc09fb687b1d9760494352a",
                "faculty": "Electronic Systems Engineering",
                "name": "ENEL201",
                "status": "active",
                "createdAt": "2019-11-04T06:00:56.121Z",
                "updatedAt": "2019-11-04T06:00:56.121Z",
                "__v": 0
            },
            "instructor_id": "5dd8ca8b6cc68874201ec5f8",
            "__v": 1,
            "createdAt": "2019-11-04T06:00:56.121Z",
            "updatedAt": "2019-11-04T06:00:56.121Z",
            "data": [
                {
                    "evaluation_report": {
                        "exceeds": {
                            "criteria": "criteria text here",
                            "grade": 32,
                            "documents": "uploads\\docs\\5c0c102f685cdd744668158650d8dd2c"
                        },
                        "meets": {
                            "criteria": "criteria text here",
                            "grade": 31,
                            "documents": ""
                        },
                        "developing": {
                            "criteria": "criteria text here",
                            "grade": 33,
                            "documents": ""
                        },
                        "fail": {
                            "criteria": "criteria text here",
                            "grade": 90,
                            "documents": ""
                        }
                    },
                    "_id": "5ddb934e80cfea7ef0d502af",
                    "questions_answers": [
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                        {
                            "question": "some question",
                            "answer": "some ans"
                        }
                    ],
                    "grad_attribute": "CriticalThinking",
                    "indicator": "lolz"
                },
                {
                    "_id": "5ddb934e80cfea7ef0d502b0",
                    "questions_answers": [],
                    "grad_attribute": "Listening",
                    "indicator": "lulzec"
                }
            ],
            "status": "Incomplete"
        },
        {
            "_id": "5ddb93740d3037f9f1a63e62",
            "course_id": {
                "_id": "5dbfc6aea326183894be54b7",
                "faculty": "Software Systems Engineering",
                "name": "ENEL333",
                "status": "active",
                "createdAt": "2019-11-04T06:00:56.121Z",
                "updatedAt": "2019-11-04T06:00:56.121Z",
                "__v": 0
            },
            "instructor_id": "5dd8ca8b6cc68874201ec5f8",
            "__v": 1,
            "createdAt": "2019-11-04T06:00:56.121Z",
            "updatedAt": "2019-11-04T06:00:56.121Z",
            "data": [
                {
                    "evaluation_report": {
                        "exceeds": {
                            "criteria": "criteria text here",
                            "grade": 32,
                            "documents": "uploads\\docs\\384d08644fbb6fe495ec82c9b2ab752a"
                        },
                        "meets": {
                            "criteria": "criteria text here",
                            "grade": 31,
                            "documents": ""
                        },
                        "developing": {
                            "criteria": "criteria text here",
                            "grade": 33,
                            "documents": ""
                        },
                        "fail": {
                            "criteria": "criteria text here",
                            "grade": 90,
                            "documents": ""
                        }
                    },
                    "_id": "5ddb937480cfea7ef0d502b1",
                    "questions_answers": [
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                        {
                            "question": "some question",
                            "answer": "some ans"
                        },
                    ],
                    "grad_attribute": "CriticalThinking",
                    "indicator": "lolz"
                },
                {
                    "_id": "5ddb937480cfea7ef0d502b2",
                    "questions_answers": [],
                    "grad_attribute": "Listening",
                    "indicator": "lulzec"
                }
            ],
            "status": "Incomplete"
        }
    ]
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        "couldnt find any class for user"
    ],
    "result": {}
}
```

OR

```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

Update
-----
```bash
  Updates an exisiting class. If the class does not exisit, a new document is created for the class.
```

* **Route:** 

  localhost:3000/api/classes/
  
  
* **Request Type:** 
  
  PUT
  
  
* **Content Type:** 
 
    `multipart/form-data` .
    
    OR
    
    `application/x-www-form-urlencoded` .
  
  
* **Auth Required:**

  **Yes**
 
* **Body:**

| Field Type 	|         Field Name         	|                                                                                      Field Value                                                                                      	|
|:----------:	|:--------------------------:	|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|
|   string   	|            term            	|                                                                            "Fall"/"Winter"/"Spring/Summer"                                                                            	|
|   string   	|           faculty          	|                                                          "Software Systems Engineering"/"Electronic Systems Engineering"/...                                                          	|
|   string   	|         course_name        	|                                                                      "ENSExxx"/"ENEVxxx"/"ENPExxx"/"ENELxxx"/....                                                                     	|
|   integer  	|            year            	|                                                                                     2019/2020/...                                                                                     	|
|   string   	|   data[i][grad_attribute]  	|                                                                      data[0][grad_attribute] = "CriticalThinking"                                                                     	|
|   string   	|     data[i][indicator]     	|                                                                           data[0][indicator] = "WorkingHard"                                                                          	|
|  string[]  	|     data[i][questions]     	|                                                            data[0][questions][0] = "q1"/ data[0][questions][1] = "q2"/....                                                            	|
|  string[]  	|      data[i][answers]      	|                                                              data[0][answers][0] = "a1"/ data[0][answers][1] = "a2"/....                                                              	|
|   string   	| data[i][exceeds][criteria] 	|                                                                       data[0][exceeds][criteria] = "can he fly?"                                                                      	|
|   integer  	|   data[i][exceeds][grade]  	|                                                                              data[0][exceeds][grade] = 69                                                                             	|
|    file    	|         GA_criteria        	| CriticalThinking_exceeds = file byte data.../ CriticalThinking_meets = file byte data.../ CriticalThinking_fail = file byte data..../ CriticalThinking_developing = file byte data... 	|
|   boolean  	|        complete_flag       	|                                                                      complete_flag = true/ complete_flag = false                                                                      	|
  
* **Sample Request:**

*When submitting for completion(complete_flag = true)*:

|          	| term 	|                                                                                                   faculty                                                                                                   	|                                              course_name                                              	|        year        	|                                            data[i][grad_attribute]                                            	|                                                      data[i][indicator]                                                      	|                                                                        data[i][questions]                                                                       	|                data[i][answers]                	|                    data[i][exceeds][criteria]                   	|  data[i][exceeds][grade]  	|                                                                                                                                                                                                                                     GA_criteria                                                                                                                                                                                                                                    	|                                                         complete_flag                                                        	|
|:--------:	|:----:	|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:-----------------------------------------------------------------------------------------------------:	|:------------------:	|:-------------------------------------------------------------------------------------------------------------:	|:----------------------------------------------------------------------------------------------------------------------------:	|:---------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:----------------------------------------------:	|:---------------------------------------------------------------:	|:-------------------------:	|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:----------------------------------------------------------------------------------------------------------------------------:	|
| Required 	|   x  	|                                                                                                      x                                                                                                      	|                                                   x                                                   	|          x         	|                                                       x                                                       	|                                                               x                                                              	|                                                                                x                                                                                	|                        x                       	|                                x                                	|             x             	|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    	|                                                               x                                                              	|
| Optional 	|      	|                                                                                                                                                                                                             	|                                                                                                       	|                    	|                                                                                                               	|                                                                                                                              	|                                                                                                                                                                 	|                                                	|                                                                 	|                           	|                                                                                                                                                                                                                                          x                                                                                                                                                                                                                                         	|                                                                                                                              	|
|   Notes  	|      	| Allowed Values: General Engineering, Software Systems Engineering, Electronic Systems Engineering, Environmental Systems Engineering, Industrial Systems Engineering, Petroleum Systems Engineering, Process Systems Engineering 	| Allowed Values:    ENSExxx        ENELxxx        ENEVxxx        ENPExxx        ENINxxx        ENPCxxx        ENGGxxx 	| Year as an integer 	| - data is multidimensional array first dim for the GA slot - second dim for for the graduate attribute value. 	| - data is multidimensional array first dim for the GA slot - second dim for for the corresponding indicator to GA in slot i. 	| - questions is an array of questions for the current ga slot i. - data[i][questions][0] - data[i][questions][1] - data[i][questions][2] - data[i][questions][3] 	| - corresponding answers array to the questions 	| - exceeds criteria for slot i GA. - data[i][exceeds][criteria]  	| - data[i][exceeds][grade] 	| - file field for the current ga slot and criteria. - needs to start with the ga name in slot data[i] and followed by criteria.   for exceeds:  - i.e.:  data[0][grad_attribute] = CriticalThinking + _ + Exceeds - CriticalThinking_Exceeds - file for critical thinking and exceeds criteria.  for meets: data[0][grad_attribute] = CriticalThinking + _ + Meets - CriticalThinking_Meets  - file for critical thinking ga and meets criteria. - will have 4 of these max per GA. 	| - required to mark whether the class is complete and should be processed for final submission.  - pass as hidden form field. 	|

*When saving incomplete(complete_flag = false)*:

|          	| term 	|                                                                                                   faculty                                                                                                   	|                                              course_name                                              	|        year        	|                                             data[i][grad_attribute]                                            	|                                                      data[i][indicator]                                                      	|                                                                        data[i][questions]                                                                       	|                data[i][answers]                	|                    data[i][exceeds][criteria]                   	|  data[i][exceeds][grade]  	|                                                                                                                                                                                                                                     GA_criteria                                                                                                                                                                                                                                    	|                                                         complete_flag                                                        	|
|:--------:	|:----:	|:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:-----------------------------------------------------------------------------------------------------:	|:------------------:	|:--------------------------------------------------------------------------------------------------------------:	|:----------------------------------------------------------------------------------------------------------------------------:	|:---------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:----------------------------------------------:	|:---------------------------------------------------------------:	|:-------------------------:	|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:	|:----------------------------------------------------------------------------------------------------------------------------:	|
| Required 	|      	|                                                                                                      x                                                                                                      	|                                                   x                                                   	|                    	|                                                                                                                	|                                                                                                                              	|                                                                                                                                                                 	|                                                	|                                                                 	|                           	|                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    	|                                                               x                                                              	|
| Optional 	|   x  	|                                                                                                                                                                                                             	|                                                                                                       	|          x         	|                                                        x                                                       	|                                                               x                                                              	|                                                                                x                                                                                	|                        x                       	|                                x                                	|             x             	|                                                                                                                                                                                                                                          x                                                                                                                                                                                                                                         	|                                                                                                                              	|
|   Notes  	|      	| Allowed Values: Software Systems Engineering, Electronic Systems Engineering, Environmental Systems Engineering, Industrial Systems Engineering, Petroleum Systems Engineering, Process Systems Engineering 	| Allowed Values:    ENSExxx        ENELxxx        ENEVxxx        ENPExxx        ENINxxx        ENPCxxx 	| Year as an integer 	| - data is multidimensional array. first dim for the GA slot - second dim for for the graduate attribute value. 	| - data is multidimensional array first dim for the GA slot - second dim for for the corresponding indicator to GA in slot i. 	| - questions is an array of questions for the current ga slot i. - data[i][questions][0] - data[i][questions][1] - data[i][questions][2] - data[i][questions][3] 	| - corresponding answers array to the questions 	| - exceeds criteria for slot i GA. - data[i][exceeds][criteria]  	| - data[i][exceeds][grade] 	| - file field for the current ga slot and criteria. - needs to start with the ga name in slot data[i] and followed by criteria.   for exceeds:  - i.e.:  data[0][grad_attribute] = CriticalThinking + _ + Exceeds - CriticalThinking_Exceeds - file for critical thinking and exceeds criteria.  for meets: data[0][grad_attribute] = CriticalThinking + _ + Meets - CriticalThinking_Meets  - file for critical thinking ga and meets criteria. - will have 4 of these max per GA. 	| - required to mark whether the class is complete and should be processed for final submission.  - pass as hidden form field. 	|
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "_id": "5ddb92f40d3037f9f1a62909",
        "course_id": "5ddb8a4dcf136d5ab0307954",
        "instructor_id": "5dd8ca8b6cc68874201ec5f8",
        "__v": 1,
        "createdAt": "2019-11-04T06:00:56.121Z",
        "updatedAt": "2019-11-04T06:00:56.121Z",
        "data": [
            {
                "evaluation_report": {
                    "exceeds": {
                        "criteria": "criteria text here",
                        "grade": 32,
                        "documents": "uploads\\docs\\bcbe2303c4670b605900e8b22efd26a3"
                    },
                    "meets": {
                        "criteria": "criteria text here",
                        "grade": 31,
                        "documents": ""
                    },
                    "developing": {
                        "criteria": "criteria text here",
                        "grade": 33,
                        "documents": ""
                    },
                    "fail": {
                        "criteria": "criteria text here",
                        "grade": 90,
                        "documents": ""
                    }
                },
                "_id": "5ddb92f480cfea7ef0d502ad",
                "questions_answers": [
                    {
                            "question": "some question",
                            "answer": "some ans"
                    },
                    {
                        "question": "question here",
                        "answer": "answer here"
                    },
                    {
                        "question": "question here",
                        "answer": "answer here"
                    },
                    {
                        "question": "answer here",
                        "answer": "answer here"
                    }
                ],
                "grad_attribute": "CriticalThinking",
                "indicator": "lolz"
            },
            {
                "_id": "5ddb92f480cfea7ef0d502ae",
                "questions_answers": [],
                "grad_attribute": "Listening",
                "indicator": "lulzec"
            }
        ],
        "status": "Incomplete"
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        [
            {
                "message": "\"year\" is required",
                "path": [
                    "year"
                ],
                "type": "any.required",
                "context": {
                    "label": "year",
                    "key": "year"
                }
            }
        ]
    ],
    "result": {}
}
```
*note: error has lots of varations based on invalid input fields and the complete_flag field.*

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
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

Form
============

GetIndicatorByNumber
-----
```bash
  Gets an indicator by a unique identification number.
```

* **Route:** 

  localhost:3000/api/forms/indicator
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**


|          	|                    number                   	|
|:--------:	|:-------------------------------------------:	|
| Required 	|                      x                      	|
| Optional 	|                                             	|
|   Notes  	| unique number that identifies the indicator 	|
  
  
* **Sample Request:**

```json  
{ 
   "indicator":{ 
      "number":1.2
   }
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "_id": "5de1e2cfeb7d2c93644a7b8a",
        "number": 1.2,
        "title": "Create mathematical expressions to describe physical phenomena (or a physical problem).",
        "createdAt": "2019-11-30T03:32:31.927Z",
        "updatedAt": "2019-11-30T03:32:31.927Z",
        "__v": 0
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        "indicator record already exists"
    ],
    "result": {}
}
```

OR


```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

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
  
  
* **Body:**
  
  
* **Sample Request:**

```json  

```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": [
        {
            "_id": "5de1e54559a66c1144b36f3c",
            "number": 1.4,
            "title": "Create mathematical expressions to describe physical phenomena (or a physical problem).",
            "createdAt": "2019-11-30T03:43:01.900Z",
            "updatedAt": "2019-11-30T03:43:01.900Z",
            "__v": 0
        },
        {
            "_id": "5de1e54859a66c1144b36f3d",
            "number": 1.3,
            "title": "Create mathematical expressions to describe physical phenomena (or a physical problem).",
            "createdAt": "2019-11-30T03:43:04.559Z",
            "updatedAt": "2019-11-30T03:43:04.559Z",
            "__v": 0
        },
        {
            "_id": "5de1e54a59a66c1144b36f3e",
            "number": 1.2,
            "title": "Create mathematical expressions to describe physical phenomena (or a physical problem).",
            "createdAt": "2019-11-30T03:43:06.677Z",
            "updatedAt": "2019-11-30T03:43:06.677Z",
            "__v": 0
        },
        {
            "_id": "5de1e54c59a66c1144b36f3f",
            "number": 1.1,
            "title": "Create mathematical expressions to describe physical phenomena (or a physical problem).",
            "createdAt": "2019-11-30T03:43:08.731Z",
            "updatedAt": "2019-11-30T03:43:08.731Z",
            "__v": 0
        }
    ]
}
```

* **Error Response:**

```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

CreateIndicator
-----
```bash
  Creates a UNIQUE indicator.
```

* **Route:** 

  localhost:3000/api/forms/indicators
  
* **Request Type:** 
  
  POST
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

|          	|                    number                   	| title 	|
|:--------:	|:-------------------------------------------:	|:-----:	|
| Required 	|                      x                      	|   x   	|
| Optional 	|                                             	|       	|
|   Notes  	| unique number that identifies the indicator 	|       	|

* **Sample Request:**

```json  
{
	"indicator": {
		"number" : 1.1,
		"title" : "Create mathematical expressions to describe physical phenomena (or a physical problem)."
	}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "_id": "5de1e54c59a66c1144b36f3f",
        "number": 1.1,
        "title": "Create mathematical expressions to describe physical phenomena (or a physical problem).",
        "createdAt": "2019-11-30T03:43:08.731Z",
        "updatedAt": "2019-11-30T03:43:08.731Z",
        "__v": 0
    }
}
```

* **Error Response:**

```json
error:
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        "indicator record already exists"
    ],
    "result": {}
}
```

OR


```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

UpdateIndicator
-----
```bash
  Updates an exisiting indicator.
```

* **Route:** 

  localhost:3000/api/forms/indicators
  
* **Request Type:** 
  
  PUT
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

|          	|                    number                   	| title 	|
|:--------:	|:-------------------------------------------:	|:-----:	|
| Required 	|                      x                      	|   x   	|
| Optional 	|                                             	|       	|
|   Notes  	| unique number that identifies the indicator 	|       	|
  
* **Sample Request:**

```json  
{
	"indicator": {
		"number" : 1.1,
		"title" : "new indicator title."
	}
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "_id": "5de1e54c59a66c1144b36f3f",
        "number": 1.1,
        "title": "new indicator title.",
        "createdAt": "2019-11-30T03:43:08.731Z",
        "updatedAt": "2019-11-30T05:05:01.039Z",
        "__v": 0
    }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        "cannot find exisiting indicator to update."
    ],
    "result": {}
}
```


OR


```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

GetGraduateAttributeByNumber
-----
```bash
  Get graduate attribute by a unique identification number.
```

* **Route:** 

  localhost:3000/api/forms/grad_attribute
  
* **Request Type:** 
  
  GET
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

|          	|                    number                   	|
|:--------:	|:-------------------------------------------:	|
| Required 	|                      x                      	|
| Optional 	|                                             	|
|   Notes  	| unique number that identifies the GA 		|
  
* **Sample Request:**

```json  
{ 
   "graduate_attribute":{ 
      "number":1
   }
}
```
  
* **Success Response:**

```json
{ 
   "status":"200 (OK)",
   "errors":[ 

   ],
   "result":{ 
      "_id":"5de1e780ff5dee3d544e1b68",
      "sub_gas":[ 
         "5de1e54559a66c1144b36f3c",
         "5de1e54a59a66c1144b36f3e"
      ],
      "number":1,
      "title":"new title",
      "description":" new description",
      "createdAt":"2019-11-30T03:52:33.052Z",
      "updatedAt":"2019-11-30T04:03:16.754Z",
      "__v":1
   }
}
```

* **Error Response:**

```json
{
    "status": "422 (Unprocessable Entity)",
    "errors": [
        "could not find graduate attribute by given number"
    ],
    "result": {}
}
```

OR


```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
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
  
  
* **Body:**

  
* **Sample Request:**

```json  

```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": [
        {
            "_id": "5de1e780ff5dee3d544e1b68",
            "sub_gas": [
                "5de1e54559a66c1144b36f3c",
                "5de1e54a59a66c1144b36f3e"
            ],
            "number": 1,
            "title": "new title",
            "description": " new description",
            "createdAt": "2019-11-30T03:52:33.052Z",
            "updatedAt": "2019-11-30T04:03:16.754Z",
            "__v": 1
        },
        {
            "_id": "5de1ea6764038795a037f7e2",
            "sub_gas": [
                "5de1e54559a66c1144b36f3c"
            ],
            "number": 2,
            "title": "Problem Analysis",
            "description": "An ability to use appropriate knowledge and skills to identify, formulate, analyze, and solve complex engineering problems in order to reach substantiated conclusions.",
            "createdAt": "2019-11-30T04:04:55.922Z",
            "updatedAt": "2019-11-30T04:04:55.922Z",
            "__v": 0
        }
    ]
}
```

* **Error Response:**

```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

CreateGraduateAttribute
-----
```bash
  Creates a UNIQUE graduate attribute.
```

* **Route:** 

  localhost:3000/api/forms/grad_attribute
  
* **Request Type:** 
  
  POST
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

|          	|                    number                   	| title 	| description 	|                                    sub_gas                                    	|
|:--------:	|:-------------------------------------------:	|:-----:	|:-----------:	|:-----------------------------------------------------------------------------:	|
| Required 	|                      x                      	|   x   	|      x      	|                                       x                                       	|
| Optional 	|                                             	|       	|             	|                                                                               	|
|   Notes  	| unique number that identifies the GA 	|       	|             	| Array of mongoose object Id's of indicators that are going to be used for the GA	|
  
  
* **Sample Request:**

```json  
{ 
   "graduate_attribute":{ 
      "number":2,
      "title":"Problem Analysis",
      "description":"An ability to use appropriate knowledge and skills to identify, formulate, analyze, and solve complex engineering problems in order to reach substantiated conclusions.",
      "sub_gas":[ 
         "5de1e54559a66c1144b36f3c"
      ]
   }
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "sub_gas": [
            "5de1e54559a66c1144b36f3c"
        ],
        "_id": "5de1ea6764038795a037f7e2",
        "number": 2,
        "title": "Problem Analysis",
        "description": "An ability to use appropriate knowledge and skills to identify, formulate, analyze, and solve complex engineering problems in order to reach substantiated conclusions.",
        "createdAt": "2019-11-30T04:04:55.922Z",
        "updatedAt": "2019-11-30T04:04:55.922Z",
        "__v": 0
    }
}
```

* **Error Response:**
```json
{ 
   "status":"422 (Unprocessable Entity)",
   "errors":[ 
      "graduate attribute record already exists"
   ],
   "result":{ 

   }
}
```

OR


```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```

UpdateGraduateAttribute
-----
```bash
  Updates an existing graduate attribute.
```

* **Route:** 

  localhost:3000/api/forms/grad_attribute
  
* **Request Type:** 
  
  PUT
  
* **Auth Required:**

  **Yes**
  
  
* **Body:**

|          	|                    number                   	| title 	| description 	|                                    sub_gas                                    	|
|:--------:	|:-------------------------------------------:	|:-----:	|:-----------:	|:-----------------------------------------------------------------------------:	|
| Required 	|                      x                      	|       	|             	|                                                                               	|
| Optional 	|                                             	|   x   	|      x      	|                                       x                                       	|
|   Notes  	| unique number that identifies the indicator 	|       	|             	| Array of mongoose object Id's of indicators that are used for the current GA. 	|
  
  
* **Sample Request:**

```json  
{ 
   "graduate_attribute":{ 
      "number":1,
      "title":"new title",
      "description":" new description",
      "sub_gas":[ 
         "5de1e54559a66c1144b36f3c",
         "5de1e54a59a66c1144b36f3e"
      ]
   }
}
```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
    "result": {
        "sub_gas": [
            "5de1e54559a66c1144b36f3c",
            "5de1e54a59a66c1144b36f3e"
        ],
        "_id": "5de1e780ff5dee3d544e1b68",
        "number": 1,
        "title": "new title",
        "description": " new description",
        "createdAt": "2019-11-30T03:52:33.052Z",
        "updatedAt": "2019-11-30T04:03:16.754Z",
        "__v": 1
    }
}
```

* **Error Response:**

```json
{ 
   "status":"422 (Unprocessable Entity)",
   "errors":[ 
      "cannot find exisiting graduate attribute to update."
   ],
   "result":{ 

   }
}
```

OR


```json
{
    "status": "401 (Unauthorized)",
    "errors": [
        "Unauthorized access to protected route."
    ],
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
  
  
* **Body:**
  
  
* **Sample Request:**

```json  

```
  
* **Success Response:**

```json
{
    "status": "200 (OK)",
    "errors": [],
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
    "errors": [
        "Unauthorized access to protected route."
    ],
    "result": {}
}
```
