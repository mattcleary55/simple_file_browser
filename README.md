# Simple File Browser

## Description

This project allows users to browse and download files from a private AWS S3 bucket through a simple and intuitive interface. The S3 buckets made available to the user are currently hardcoded via environment variables.

A preview deployment can be viewed [here](https://tuza-file-browser-frontend-git-main-mattcleary55s-projects.vercel.app/).

The application will be rebuilt and auto-deployed upon pushing to the `main` branch.

## Getting Started

### Prerequisites

- Git for cloning the repository
- Node.js and npm installed on your machine
- AWS CLI configured for S3 bucket access

### Installation

- Clone the project from GitHub.
- Navigate to both the frontend and backend directories and run `npm install` to install dependencies.

### Configuration

Update AWS credentials and other necessary environment variables in the .env files located in both the frontend and backend directories.

In the frontend, create a file called `env.local` that looks like this:

```
VITE_API_URL=http://localhost:3001
VITE_AVAILABLE_BUCKETS="bucketa, bucketb, bucketc"
```

The buckets will be available for a user to select within the UI.

The backend `.env` file will look like this:

```
AWS_ACCESS_KEY_ID=ABC123
AWS_SECRET_ACCESS_KEY=abc123
S3_BUCKET_NAME=bucketa
AWS_REGION=eu-north-1
PORT=3001
```

The `S3_BUCKET_NAME` will be used as a default in case the frontend does not send through a bucket name as a query parameter.

## Usage

The application is accessible through [this preview link](https://tuza-file-browser-frontend-git-main-mattcleary55s-projects.vercel.app/).

To run this locally, run `npm run dev` in both the `frontend` and `backend` directories. Then visit `http://localhost:5173/` in your browser.

## Testing

A simple test suite has been set up for the backend route and service with Jest and Supertest.

You can run these tests using `npm run test` to ensure everything is working as expected.

## Built With

**Frontend:** React, Vite, TypeScript and TailwindCSS.

**Backend** NodeJS, ExpressJS, TypeScript and the latest AWS SDK.

## Deployment

A simple CD pipeline has been set up: The frontend is automatically deployed to Vercel, and the backend to Railway.app. The application will be rebuilt and auto-deployed upon pushing to the `main` branch.

Production environment variables are managed via their respective consoles.

To deploy manually via the command line, simply run `vercel --prod` from the `frontend` directory, and `railway up` from the `backend` directory.

---

## Notes:

As time was limited, rather than building an overly complex frontend/backend, I opted for building a full end-to-end solution while focusing on developer experience. I had not used Vite, Vercel or Railway.app before but enjoyed how simple they were to set up and deploy the project. They provided hotreloading and simple integration with tools such as TailwindCSS, TS and Github for deployment.

It took me a little while to get to terms with the new AWS SDK. I initially built the backend with the [version 2](https://www.npmjs.com/package/aws-sdk) and had written two separate API endpoint: One for fetching the file info from S3, and one to request a signed download url. When building the frontend, I realised it made more sense to provide a single API endpoints. I refactored the backend and used the new, modularised version of the SDK, [version 3](https://www.npmjs.com/package/@aws-sdk/client-s3). This worked well, though it meant I needed to simplify my tests and so relied heavily on mocking out the s3 client libraries.

The frontend design is nothing fancy. I enjoyed using TailwindCSS for the first time but in hindsight, if I had used something I'm more familiar with (such as Material UI) I might have had more time to enhance the UI with pagination, mobile responsiveness and in general, create a more aesthetically pleasing interface. The `FileList.tsx` file could definitely do with being broken up.

In terms of security and configuration, I kept things simple. There's no user authentication/authorisation set up so the AWS credentials are harcoded in `.env` files. This worked well for both local development and the CD pipeline I set up, but it means the user has no choice to specify which buckets they wish to browse, other than the options hardcoded for them.

Git history has been tided up and all commits have been squashed.
