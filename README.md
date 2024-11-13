# App

Gym Check in APP

## Functional Requirements
- [ ] User must be able to register
- [ ] User must be able to authenticate
- [ ] Must be able to get the logged user profile data
- [ ] Must be able to get the logged user previous check-ins number
- [ ] User must be able to see the history of the check-ins
- [ ] User must be able to search for near gyms
- [ ] User must be able to search for gyms by name 
- [ ] User must be able to check-in on gyms 
- [ ] User must be able to check in
- [ ] Must be able to register gym

## Business Rules
- User must not be registered with duplicate email;
- User cannot make two check-ins on the same day;
- User cannot make check-in if is in a distance higher than (100m from the gym);
- Check-in validation must be done within 20 minutes after creation;
- Check-in must only be validated by admins
- Check-in can only be registered by admins

## Non-Functional Requirements
- [ ] Password must be encrypted;
- [ ] Data must be stored in the database PostgreSQL;
- [ ] Every data must be listed at maximum with 20 items per page;
- [ ] The user must be identified by JWT