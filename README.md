I have implemented the idea of sending the notification using mailchain whenever a user goes live. 

## User Story
User can sign in using their lens profile, then then can start their live session that uses Livepeer. Once the user gets live, it will send email to all the followers of the user using mailchain.

## Current Status
Currently, I am having trouble with the Lens API. I am not getting the `profileId` due to some issue, have contacted the team for the same. Also, I am yet to initialize the mailchain sdk due to time constraint, just spent all the time on fixing the lens and livepeer integration.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```


