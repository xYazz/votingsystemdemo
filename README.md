# votingsystemdemo
Web app providing system to create, manage, particate in online elections and live sessions. Currently in development.

App contains frontend with react and backend with django focused on django rest framework. Authentication system created using JWT. Part of the system uses django channels to make live sessions.

App divides into two main parts:
- online elections allow one to create and manage elections. Elections are either public or private, the latter does allow per-request access - the owner has election's code that can be shared, anyone having code can request access to participate in elections. After sending request the owner has option to either accept or decline the request.
- live sessions allow one to create and manage sessions. Each session has list of questions, each question has list of answers. Creator of the session adds users that are able to enter live session. When the session is active, all allowed users are able to join the room and take a part in live voting.

