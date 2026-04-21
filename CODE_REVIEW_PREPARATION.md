# Code Review Preparation Guide

Based on the rubric provided for your Software Development Project, here is a comprehensive breakdown of how you can ensure your project meets the criteria for the "Excellent" (9-10) bracket across all categories.

## 1. Code Readability & Style (10%)
**Goal:** Your code should be easy to scan and read by anyone exactly as if reading a book.
* **Consistent Indentation & Whitespace:** Ensure all files (JS, JSX, CSS, Backend code) use consistent indentation (usually 2 or 4 spaces). Use blank lines to separate logical blocks of code within functions.
* **Formatting Tools:** If you haven't already, run a code formatter like **Prettier** or **ESLint** across your frontend and backend directories.
* **Meaningful Comments:** Don't comment on *what* the code is doing if it's obvious. Comment on *why* a specific approach was taken, especially for complex logic (e.g., date validations in `GNAvailability.jsx`). Include Docstrings at the top of complex functions explaining parameters and return values.

## 2. Coding Standards (10%)
**Goal:** Adhere strictly to industry-standard naming conventions.
* **Variables & Functions:** Use **camelCase** for variable names and function names (e.g., `handleDateChange`, `isAvailable`). Avoid single-letter variables except in short loops (like `i`, `j`).
* **Classes & Components:** Use **PascalCase** for React components and Class names (e.g., `HouseholdRegistration.jsx`, `PostNotice.jsx`, `CitizenModel`).
* **Constants:** Use **UPPER_SNAKE_CASE** for global constants (e.g., `MAX_RETRY_COUNT`, `API_BASE_URL`).
* **Descriptive Naming:** Ensure names describe the value or action (e.g., use `fetchCitizenData()` instead of `getData()`).

## 3. Code Structure & Design (20%) - *Highest Weight*
**Goal:** Your code should be modular, reusable, and free of unnecessary repetition (DRY concept - Don't Repeat Yourself).
* **Modularity:** Ensure your large React pages (like `HouseholdRegistration.jsx` or `GNAvailability.jsx`) are broken down into smaller, reusable components. If a file is over 200-300 lines, it's a good candidate for splitting.
* **De-Duplication:** Look for repeated API calls or UI elements. 
    * Extract repetitive API logic into a separate `services/` or `api.js` directory.
    * Move duplicated UI components (like custom buttons, inputs, or modal popups) into a shared `components/` folder.
* **Separation of Concerns:** Keep your business logic (state management, API calls) separate from your presentation logic (UI rendering) where possible (e.g., using Custom Hooks).

## 4. Error Handling and Logging (15%)
**Goal:** The system should gracefully handle failures without crashing, and developers should be able to trace errors easily.
* **Try/Catch Blocks:** Ensure all asynchronous operations (API calls, database queries) are wrapped in `try/catch` blocks.
* **User Feedback:** Never leave the screen loading infinitely if an API fails. Show clear, localized error messages to the user (e.g., using toast notifications). You can showcase your `VALIDATION_ERROR_HANDLING.md`.
* **Logging:** Avoid relying purely on `console.log()` for everything. Differentiate logs using `console.error()`, `console.warn()`, and `console.info()`. If you have a backend, ensure backend errors are logged cleanly indicating the route, time, and error trace. 

## 5. Data Model (15%)
**Goal:** The database schema and front-end data structures should be efficient, normalized, and highly relevant to the problem domain.
* **Database Design:** Be prepared to explain your schemas (e.g., how a Citizen relates to a Household, or how Grama Niladhari connects to Divisions).
* **Validation:** Show that data models validate incoming data at the database level (e.g., required fields, unique constraints, specific string formats for NIC numbers).
* **Relationship mapping:** If using MongoDB, be able to explain why you used embedded documents vs. referencing. If SQL, be able to explain foreign keys.

## 6. Ability to Maintain & Manage Code (15%)
**Goal:** Prove that another developer could easily take over your codebase.
* **Folder Structure:** Clean up your directory. Ensure there isn't any "dead code" (unused variables, commented-out old code blocks, unused files). 
* **Git Management:** While you can't change history easily, be prepared to show a clean Git commit history (using meaningful commit messages).
* **Configuration:** Ensure sensitive data (API keys, DB credentials) is kept in `.env` files and **not** hardcoded into your source code.
* **README:** Ensure your `README.md` clearly outlines how to set up, run, and build both the frontend and backend locally.

## 7. Quality Assurance (5%)
**Goal:** Prove the system works properly through organized testing.
* To get "Excellent", you need to cover:
    * **Unit Testing:** Individual functions/components are tested (e.g., using Jest for frontend or backend utilities).
    * **Functional Testing:** Ensuring that user flows like "Registering a Household" or "Setting GN Availability" work identically to the requirements.
    * **Non-Functional Testing:** Showing that the app handles edge cases, loads reasonably fast, and is responsive across devices.
* **Action Item for Today:** Review your QA documents (you recently worked on `Documenting Quality Assurance Methods`). Be ready to talk about how you tested the application, even if many tests were manual.

## 8. Design Documents (10%)
**Goal:** Code implementation must closely match the planned architecture.
* **Required Documents:** To get top marks, you need updated versions of:
    1. **Activity Diagrams** (Flow of logic like requesting a certificate)
    2. **Use Case Diagrams** (Actors like Citizen, Grama Niladhari, Admin, and what they can do)
    3. **Sequence Diagrams** (Tracing the interaction from UI -> API -> Database -> API -> UI)
    4. **Context Diagrams** (High-level system view)
* **Action Item for Today:** Review these diagrams. If your code recently changed (like the auto-fill certificate feature or GN scheduling), update the corresponding diagrams so they are synchronous with the current state of your code. Your Interface Class diagram should also be clearly represented here!

---

### Pro Tips for Tomorrow's Review:
1. **Be Ready to Navigate:** Have your IDE (VS Code) open, with different terminal windows ready for backend and frontend. Know exactly where key files are.
2. **Defend Your Choices:** If a reviewer asks "Why did you use this structure?", answer based on logical trade-offs (e.g., "We extracted this into a custom hook to avoid code duplication across 4 different pages").
3. **Acknowledge Flaws Gracefully:** If they point out a bug or poor structure, acknowledge it professionally ("That's a great point, extracting that into its own service would improve modularity. I will add that to the refactoring backlog."). You actually already created a document for System Limitations, which shows maturity! Explain that you are aware of those exact trade-offs.
