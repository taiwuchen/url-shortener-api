# URL Shortener API - Take Home Assignment

## Introduction

In this assignment, you will be tasked with building a URL shortener service with user accounts using TypeScript.

- You are free to use any framework or library but using **Typescript** is mandatory.
- You should also strongly consider using **PostgreSQL** as your database as it is used at Scription and will help demonstrate knowledge of RDBMS's. If you chose a different database you should be prepared to defend this choice in the interview.
- Additionally, you will implement analytics features that are only accessible to admin users after logging in.
- You are not required to build a user interface;
- Your task is to create the backend API, document it using the OpenAPI Specification, and include additional analytics metrics.

## Task

Your task is to develop a URL shortener API with user account functionality and extended analytics features. You will need to build the API endpoints and database schema to accomplish this. Specifically:

1. **User Authentication:**
   - Implement user registration and authentication.
   - Users should be able to register for an account and log in using their credentials.

2. **URL Shortening:**
   - Logged-in users should be able to submit a POST request with a long URL and receive a shortened URL in response.
   - Users should be able to access the original URL using the shortened URL.

3. **Admin Analytics Endpoints:**
   - Implement secure endpoints that are accessible only to admin users after logging in.
   - Admin users should be able to retrieve analytics data for each shortened URL, including:
     - Total number of requests.
     - Request counts per week and month.
     - Device type distribution (e.g., mobile, desktop).
     - OS type distribution (e.g., Windows, iOS, Android).
     - Geographical distribution of requests (e.g., country, city).
     - **Additional Metric 1:** Include an extra analytics metric that you think would provide valuable insights.
     - **Additional Metric 2:** Include another extra analytics metric that complements the existing ones.

4. **Database Schema:**
   - Design and implement the necessary database schema to store user accounts, shortened URLs, and request analytics.

5. **API Documentation:**
   - Document your API using the OpenAPI Specification 

## Evaluation Criteria

Your assignment will be evaluated based on the following factors:

- **Functionality:** Does your API meet the specified requirements? Are the URL shortening and extended analytics features implemented correctly?
- **User Authentication:** Is user registration and authentication implemented correctly?
- **Code Quality:** Is your code well-structured, modular, and following best practices for TypeScript development?
- **Database Design:** Is your database schema well-designed to handle user accounts, URL shortening, and analytics data storage?
- **Testing:** Do you have appropriate unit tests and integration tests to validate the functionality of your API?
- **Documentation:** Is your API well-documented using the OpenAPI Specification, providing clear instructions for setup, usage, and testing?

**Special Note**
- You don't need to write 100% of your tests. For instance, you can implement one and use `it.todo()` for any other scenarios you would have wished to cover.
- You don't need to implement more than what is being asked.
- If time is a strong constraint for you, focus on the parts you deem important. Leave some indication of what has not been implemented, with high-level details about how you would have done it. Be prepared to delve deeper into this during your technical round (if there is one).
- Design the database considering all APIs. For instance, if you lack time to implement the analytics API, please ensure that your database can accommodate it.
- Feel free to use any relevant libraries that would help you. For example with authentication, hashing, unique string ID generator, etc. If you do so, please make sure you understand how those work. Be prepared to delve deeper into this during your technical round (if there is one).
- If you produce any documents such as Database design, System Design, whiteboard breakdown or anything relevant. Do not hesitate to share them with us.
  
## Submission

- Please submit your assignment by providing a link to your version-controlled repository (e.g., GitHub) containing all relevant code and documentation that you think are worth sharing with us.
- Add `takehome@scription.ai` as a collaborator to your repository.
- Please DO NOT submit until you are satisfied with your solution. If you decide to push further commits after submission we may or may not see them in our review process.

Feel free to reach out if you have any questions during the assignment period. Good luck, and we look forward to reviewing your submission!
