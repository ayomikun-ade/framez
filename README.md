# Framez App

## Overview

This project provides a serverless backend for a mobile-first social media application, built with TypeScript on Convex. It offers robust data management and real-time capabilities for posts, user profiles, and interactions. User authentication is seamlessly integrated and handled via Clerk. The client application is developed using React Native with Expo.

## Features

- **Convex**: Real-time database and serverless functions for efficient data operations.
- **Clerk**: Comprehensive user authentication and management, including sign-up, sign-in, and password reset functionalities.
- **Post Management**: Users can create, view, like, comment on, and delete their own posts.
- **User Profiles**: Fetch and display user-specific data, including posts authored by them.
- **Image Uploads**: Support for image attachments in posts using base64 encoding.
- **TypeScript**: Enhanced code quality, maintainability, and early error detection.
- **Expo**: Streamlined development and deployment for React Native applications across multiple platforms.

## Getting Started

### Installation

To set up and run the Framez API backend and client locally, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/ayomikun-ade/framez.git
    ```
2.  **Navigate to Project Directory**:
    ```bash
    cd framez
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
    or
    ```bash
    yarn install
    ```
4.  **Convex Setup**:
    Initialize your Convex project and set up the development deployment.
    ```bash
    npx convex dev
    ```
5.  **Expo Setup**:
    Start the Expo development server for the client application.
    ```bash
    expo start
    ```

### Environment Variables

The project requires the following environment variables. Create a `.env.local` file in the root directory and populate it with your values. Refer to `.env.example` for guidance.

- `CONVEX_DEPLOYMENT`: Used by `npx convex dev` to specify the Convex deployment.
- `EXPO_PUBLIC_CONVEX_URL`: The public URL for your Convex deployment, used by the client.
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your publishable API key from Clerk for frontend authentication.
- `CLERK_JWT_ISSUER_DOMAIN`: The JWT issuer domain from your Clerk application, used for Convex authentication.

## Usage

The Framez project operates as a mobile application where users can interact with the social feed and their profiles.

### User Authentication

- **Sign Up**: New users can create an account by providing an email, name, username, and password. An email verification step is required.
- **Sign In**: Existing users can log in using their email or username and password.
- **Forgot Password**: Users can initiate a password reset process via email.

### Post Interaction

- **View Feed**: Authenticated users can browse a feed of all public posts, displayed in reverse chronological order.
- **Create Post**: Users can create new posts, including text content and an optional image.
- **Like Posts**: Users can like or unlike posts in the feed. The like count updates in real-time.
- **Comment on Posts**: Users can add comments to any post. All comments, along with the commenter's details, are visible on the post detail screen.
- **Delete Own Posts**: Users can delete posts they have authored from their profile screen.

### Profile Management

- **View Profile**: Users can view their own profile, which displays their name, username, email, and a list of all their authored posts.
- **Sign Out**: A button is available on the profile screen to securely log out of the application.

## API Documentation

The Framez backend is implemented using Convex, a serverless backend framework. API endpoints are exposed as Convex queries (read-only) and mutations (write-operations). These functions are called directly from the client application using the Convex client library.

### Base URL

Convex functions do not use a traditional REST API base URL. Instead, the Convex client connects to a deployment URL (e.g., `https://ceaseless-raven-653.convex.cloud`), and functions are invoked via a strongly typed `api` object (e.g., `api.posts.getAllPosts`).

### Endpoints

#### GET `api.posts.getAllPosts`

Retrieves all posts, ordered by creation date (newest first), enriched with author and comment user information.

**Request**:
No payload.

**Response**:

```json
[
  {
    "_id": "65b219e5-92c1-4328-8777-628d052a9709",
    "_creationTime": 1709292800000,
    "authorId": "65b219e5-92c1-4328-8777-628d052a9709",
    "content": "My first post!",
    "imageUrl": "https://example.com/image1.jpg",
    "likes": ["user_id_string_1", "user_id_string_2"],
    "comments": [
      {
        "userId": "65b219e5-92c1-4328-8777-628d052a9709",
        "content": "Great post!",
        "createdAt": 1709292900000,
        "userName": "John Doe",
        "userImageUrl": "https://example.com/user1.jpg"
      }
    ],
    "createdAt": 1709292800000,
    "updatedAt": 1709292800000,
    "authorName": "Jane Doe",
    "authorUsername": "janedoe",
    "authorImageUrl": "https://example.com/user2.jpg"
  }
]
```

**Errors**:

- No specific errors from the Convex function. Network or data fetching errors may occur client-side.

#### GET `api.posts.getPostsByAuthor`

Retrieves all posts by a specific author, ordered by creation date (newest first).

**Request**:

```json
{
  "authorId": "string"
}
```

**Response**:

```json
[
  {
    "_id": "65b219e5-92c1-4328-8777-628d052a9709",
    "_creationTime": 1709292800000,
    "authorId": "65b219e5-92c1-4328-8777-628d052a9709",
    "content": "My first post!",
    "imageUrl": "https://example.com/image1.jpg",
    "likes": ["user_id_string_1"],
    "comments": [],
    "createdAt": 1709292800000,
    "updatedAt": 1709292800000,
    "authorName": "Jane Doe",
    "authorUsername": "janedoe",
    "authorImageUrl": "https://example.com/user2.jpg"
  }
]
```

**Errors**:

- No specific errors from the Convex function.

#### GET `api.posts.getPostById`

Retrieves a single post by its ID, enriched with author and comment user information.

**Request**:

```json
{
  "postId": "string"
}
```

**Response**:

```json
{
  "_id": "65b219e5-92c1-4328-8777-628d052a9709",
  "_creationTime": 1709292800000,
  "authorId": "65b219e5-92c1-4328-8777-628d052a9709",
  "content": "My first post!",
  "imageUrl": "https://example.com/image1.jpg",
  "likes": ["user_id_string_1", "user_id_string_2"],
  "comments": [
    {
      "userId": "65b219e5-92c1-4328-8777-628d052a9709",
      "content": "Great post!",
      "createdAt": 1709292900000,
      "userName": "John Doe",
      "userImageUrl": "https://example.com/user1.jpg"
    }
  ],
  "createdAt": 1709292800000,
  "updatedAt": 1709292800000,
  "authorName": "Jane Doe",
  "authorUsername": "janedoe",
  "authorImageUrl": "https://example.com/user2.jpg"
}
```

**Errors**:

- Returns `null` if the post is not found.

#### POST `api.posts.createPost`

Creates a new post with text content and an optional image.

**Request**:

```json
{
  "content": "string",
  "imageUrl": "string"
}
```

**Response**:

```json
"65b219e5-92c1-4328-8777-628d052a9709"
```

**Errors**:

- `Error: Not authenticated`: The user is not signed in via Clerk.
- `Error: User not found`: The authenticated Clerk user does not exist in the Convex `users` table.

#### POST `api.posts.likePost`

Toggles a like on a post. If the user has already liked it, it unlikes; otherwise, it likes the post.

**Request**:

```json
{
  "postId": "string"
}
```

**Response**:

```json
true
```

**Errors**:

- `Error: Not authenticated`: The user is not signed in via Clerk.
- `Error: User not found`: The authenticated Clerk user does not exist in the Convex `users` table.
- `Error: Post not found`: The provided `postId` does not correspond to an existing post.

#### POST `api.posts.addComment`

Adds a new comment to a specified post.

**Request**:

```json
{
  "postId": "string",
  "content": "string"
}
```

**Response**:

```json
{
  "userId": "65b219e5-92c1-4328-8777-628d052a9709",
  "content": "My new comment!",
  "createdAt": 1709293000000,
  "userName": "Current User",
  "userImageUrl": "https://example.com/current_user.jpg"
}
```

**Errors**:

- `Error: Not authenticated`: The user is not signed in via Clerk.
- `Error: User not found`: The authenticated Clerk user does not exist in the Convex `users` table.
- `Error: Post not found`: The provided `postId` does not correspond to an existing post.

#### DELETE `api.posts.deletePost`

Deletes a post. Only the author of the post can delete it.

**Request**:

```json
{
  "postId": "string"
}
```

**Response**:

```json
true
```

**Errors**:

- `Error: Not authenticated`: The user is not signed in via Clerk.
- `Error: User not found`: The authenticated Clerk user does not exist in the Convex `users` table.
- `Error: Post not found`: The provided `postId` does not correspond to an existing post.
- `Error: Unauthorized: Only the author can delete this post`: The authenticated user is not the author of the post.

#### GET `api.users.getCurrentUser`

Retrieves the profile of the currently authenticated user.

**Request**:
No payload.

**Response**:

```json
{
  "_id": "65b219e5-92c1-4328-8777-628d052a9709",
  "_creationTime": 1709292700000,
  "clerkId": "user_clerk_id_123",
  "email": "user@example.com",
  "name": "User Name",
  "username": "username_handle",
  "imageUrl": "https://example.com/profile.jpg",
  "createdAt": 1709292700000,
  "updatedAt": 1709292700000
}
```

**Errors**:

- Returns `null` if no user is currently authenticated.

#### POST `api.users.createOrUpdateUser`

Creates a new user in the Convex database if they do not exist, or updates an existing user's details based on Clerk authentication.

**Request**:

```json
{
  "email": "string",
  "name": "string",
  "username": "string",
  "imageUrl": "string"
}
```

**Response**:

```json
"65b219e5-92c1-4328-8777-628d052a9709"
```

**Errors**:

- `Error: Not authenticated. ...`: Indicates an authentication issue with Clerk JWT setup or domain mismatch.

#### GET `api.users.getUserById`

Retrieves a user's profile by their Convex user ID.

**Request**:

```json
{
  "userId": "string"
}
```

**Response**:

```json
{
  "_id": "65b219e5-92c1-4328-8777-628d052a9709",
  "_creationTime": 1709292700000,
  "clerkId": "user_clerk_id_123",
  "email": "user@example.com",
  "name": "User Name",
  "username": "username_handle",
  "imageUrl": "https://example.com/profile.jpg",
  "createdAt": 1709292700000,
  "updatedAt": 1709292700000
}
```

**Errors**:

- Returns `null` if the user is not found.

#### GET `api.users.getUserByUsername`

Retrieves a user's profile by their username.

**Request**:

```json
{
  "username": "string"
}
```

**Response**:

```json
{
  "_id": "65b219e5-92c1-4328-8777-628d052a9709",
  "_creationTime": 1709292700000,
  "clerkId": "user_clerk_id_123",
  "email": "user@example.com",
  "name": "User Name",
  "username": "username_handle",
  "imageUrl": "https://example.com/profile.jpg",
  "createdAt": 1709292700000,
  "updatedAt": 1709292700000
}
```

**Errors**:

- Returns `null` if the user is not found.

#### PATCH `api.users.updateUserProfile`

Updates specific fields of the currently authenticated user's profile.

**Request**:

```json
{
  "name": "string",
  "username": "string",
  "bio": "string",
  "imageUrl": "string",
  "profileCompleted": "boolean"
}
```

**Response**:

```json
"65b219e5-92c1-4328-8777-628d052a9709"
```

**Errors**:

- `Error: Not authenticated`: The user is not signed in via Clerk.
- `Error: User not found`: The authenticated Clerk user does not exist in the Convex `users` table.

## Technologies Used

| Technology                  | Description                                        | Link                                                                       |
| :-------------------------- | :------------------------------------------------- | :------------------------------------------------------------------------- |
| **Convex**                  | Backend as a Service, Database, Realtime Functions | [Convex.dev](https://www.convex.dev/)                                      |
| **Clerk**                   | User Authentication and Management                 | [Clerk.com](https://clerk.com/)                                            |
| **TypeScript**              | Superset of JavaScript with Static Type Checking   | [TypeScriptLang.org](https://www.typescriptlang.org/)                      |
| **Node.js**                 | JavaScript Runtime for Server-side Development     | [Nodejs.org](https://nodejs.org/)                                          |
| **React Native**            | Framework for Building Native Mobile Apps          | [React Native](https://reactnative.dev/)                                   |
| **Expo**                    | Toolchain for React Native Development             | [Expo.dev](https://expo.dev/)                                              |
| **Expo Router**             | File-based routing for React Native and Web        | [Expo Router](https://docs.expo.dev/router/overview/)                      |
| **Expo Image Picker**       | Accessing the device's image library               | [Expo ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) |
| **React Native Reanimated** | Powerful Animations for React Native Apps          | [Reanimated](https://docs.swmansion.com/react-native-reanimated/)          |

## Contributing

Contributions to the Framez project are welcome. Please adhere to the following guidelines:

- **Fork the repository** and create your branch from `main`.
- **Ensure code quality** by following existing coding standards.
- **Test your changes** thoroughly.
- **Commit messages** should be clear and descriptive.
- **Open a pull request** with a detailed description of your changes.

## Author Info

**Ayomikun Adeyeye**

- LinkedIn: [https://linkedin.com/in/ayoadeosun10](https://linkedin.com/in/ayoadeosun10)
- Twitter: [https://twitter.com/ayoadeosun10](https://twitter.com/ayoadeosun10)

---

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![Convex](https://img.shields.io/badge/Convex-05051D?style=for-the-badge&logo=convex&logoColor=white)](https://www.convex.dev/)
[![Clerk](https://img.shields.io/badge/Clerk-010101?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://www.npmjs.com/package/dokugen)
