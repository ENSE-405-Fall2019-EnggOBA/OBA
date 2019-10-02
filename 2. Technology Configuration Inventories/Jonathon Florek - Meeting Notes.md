# Items submitted to Canadian Engineering Accrediation Board (CEAB):

1. Questionnaire
2. Exhibit 1 (would like to automate)
3. Exhibit 2
4. 6A
5. 6B
6. 6C (would like to automate)
7. Graduate Attributes Dossier

This document focuses on Exhibit 1 and 6C as David would like producing these artefacts to be automated.

## Exhibit 1

A word document with questions relating to the 12 accreditation attributes. Somewhat open-ended within each question.

A minimum of 2 data points (courses, co-op reports, surveys, final year project presentations) are required for each attribute. Currently all but one attribute uses courses as a data source. Courses are Introducing (I), Developing (D), or Applying (A) these attributes. For each attribute, professors submit how many students fall into 1 of 4 levels of competency in these attributes and how they graded students on these categories.

### Present Solution

The Course Content Sheet is a faculty-defined file that provides a standard template for describing the contents of a course. This file includes a section on what attributes are reported on by this course.

Graduate Attribute Data: a file for each instance of each course is submitted by the professors.

Limitations of GAD files:

- every professor tends to use the final exam grade or final course grade as the judgement criteria; CEAB wants more variety. Defining assessment criteria for each course ahead of time would ensure variety before classes start.
- some professors don't fill out the sheets correctly and the OBA chair doesn't find out until far too late

## 6C

An excel document relating to the accreditation units. Many spreadsheets within this document.

5 categories of accreditation units (AU) considered; accreditation requires a minimum number of AUs present in each program for each category and certain combinations of multiple categories. Additionally, the 'Engineering Design' category AUs are only awarded if the course is taught by a professor who is a P. Engg.

1 lecture hour = 1 AU
1 lab hour = 0.5 AU
1 seminar hour = 0.5 AU

The number of AUs in an elective is the number of AUs from a course accepted for that elective that provides the least number of AUs. In practice, this means that only lecture AUs are used if a student can pick a class without labs or seminars. This is the 'minimum path' concept. This concept does not apply to compulsory courses.

A course's content may be split between multiple AU categories.

### Present Solution

A single faculty-owned excel file with macros with a single spreadsheet (table) manages accreditation units in all courses in all programs.
