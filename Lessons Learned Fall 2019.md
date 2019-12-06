# Lessons Learned Fall 2019

This document contains reflections from the Fall 2019 ENSE 496 AB developers on the project following the presentation of MVP 1. The ideas presented here may be used as a guide by future developers or disregarded as convenient. These notes are opinions by multiple developers and may conflict with each other.

notes:
- given the lack of a frontend framework (React, Angular, Vue) I would have built it using a web page templating technology (eg. PHP). Maybe a rest api was the wrong move.
- I would remove the 'courses' endpoint and database collection as it doesn't really add anything; 'classes' are good enough
- I would merge 'indicators' and 'graduate attributes' endpoints and collections; just make grad attr's contain many indicators like how classes contain multiple 'data' entries.
- Craig Gelowitz suggests a move to a structured database eg mariadb or mysql (for node, TypeORM is a good relational db intermediary but that also requires doing the backend in Typescript)
