# Next.js + MongoDB Example

React Form Builder with Next.js and MongoDB integration for form persistence.

## Prerequisites

- Node.js >= 18.0.0
- React >= 18.0.0
- MongoDB instance (local or cloud)

## Installation

```bash
npm install --legacy-peer-deps
# or
yarn install
```

## Setup

1. Configure MongoDB connection in your environment or config file
2. Build the form builder library from root directory

## Development

```bash
# Build the form builder library (from root)
npm run build

# Start Next.js dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the example.

## Features

- Server-side rendering with Next.js
- MongoDB for form data persistence
- React 18 with createRoot API
- Full CRUD operations for forms

## Notes

- Requires MongoDB connection
- Uses `--legacy-peer-deps` for installation
- Form data is persisted in MongoDB collections

For more information, see the [main examples README](../README.md).
