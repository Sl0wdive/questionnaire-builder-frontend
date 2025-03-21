# Questionnaire Builder App

## Overview
The **Questionnaire Builder App** is a web application that allows users to create, manage, and complete questionnaires interactively. It includes features for sorting, pagination, and user authentication.

## Live Demo [Questionnaire Builder](https://questionnaire-builder-frontend-li8d90ud6-sl0wdives-projects.vercel.app/)

## Accomplished Features

### ✅ Base Level
- **Questionnaire Catalog Page**:
  - Displays a paginated list of available questionnaires.
  - Each questionnaire card consists of:
    - Questionnaire name
    - Description
    - Number of questions
    - Number of completions
    - Actions: Edit, Run, Delete
  - The "Edit" action opens a page similar to the creation page.

- **Questionnaire Builder Page**:
  - Users can create questionnaires by adding multiple questions.
  - Supported question types:
    - Text (free-form user input)
    - Single choice (radio buttons)
    - Multiple choices (checkbox buttons)
  - Once submitted, the questionnaire is stored in the database.

- **Interactive Questionnaire Page**:
  - Users can complete a questionnaire.
  - At the end, the user sees all their answers and the time taken.
  - Responses are stored in the database.
  - Accessible via the "Run" action.

### ✅ Middle Level
- **Everything from the Base Level**.
- **Questionnaire Catalog Page**:
  - Ability to sort questionnaires by:
    - Name
    - Number of questions
    - Number of completions
- **Interactive Questionnaire Page**:
  - Saves intermediate completion state so users can continue after a page refresh.

### ❌ Not Yet Implemented
- **Drag and Drop Functionality** in the Questionnaire Builder Page for reordering questions/answers.

### 🔒 User Authorization System
- Only **authenticated users** can:
  - Create questionnaires
  - Edit questionnaires
  - Delete questionnaires
- Non-authenticated users **cannot** perform these actions.

## Technologies Used
- **Frontend**: React, Vite, Material UI, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Hosting**: Railway, Vercel



# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
