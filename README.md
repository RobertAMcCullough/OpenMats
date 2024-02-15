# OpenMats

[Openmats.org](https://www.openmats.org) is a website that allows users to search for, create, and edit entries for jiujitsu open mats (open training sessions) around the country.

Openmats.org is built on a React frontend and C#/.NET backend. The frontend is statically hosted from AWS (S3) and the backend and database (SQL Server) are hosted on Microsoft Azure.

Other technologies used include Redux, Google's Geocoding and Maps APIs, Bootstrap, JWT authentication (via cookies), Entity Framework and Dapper.

Note that the React front end was written several years ago using class-based components and a refactor to functional components using hooks and Redux Toolkit could be in order.
