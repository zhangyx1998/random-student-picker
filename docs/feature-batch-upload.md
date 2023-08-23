# [FEATURE] Batch upload student list (`CSV`)

> Status: pending implementation
>
> Scope: frontend, backend, api

## Description

This feature enables user to batch modify the student list on the server.

## Procedure

### Step 1: select file

1. Frontend receives `CSV` content via either drag-and-drop or file selection.

1. Frontend cleans up the data and removes empty rows/columns (a checkbox is provided for auto removal, and will be checked by default).

1. Frontend checks for duplicate rows and merge them into one row (another checkbox is provided and checked by default)

### Step 2: inspect data

1. Frontend asks for the column to be used for `primary name`.

1. Frontend asks for the **columns** and **rows** to be _excluded_, the **column titles** can be _edited_ in this step.

1. Frontend asks for the **columns** to be collision-checked. These fields should be tied with the student's identity.
`primary name` will always be used in collision check so the corresponding column will be automatically selected and will not allow user manipulation.

### Step 3: summary

1. Frontend sends the list to backend (dry-run).

1. Backend scans existing student list for collision. Each new entry will be checked against all existing entries with following rules:

    + If all collision-checked fields are equal, the new entry will be labeled `unchanged`.

    + If some (but not all) of the collision-checked fields are equal, existing entry will be labeled `modified`.

    + Specially, if a new entry modifies more than one existing entry, or labeled as `unchanged` and `modified` at the same time, an error will be thrown and collision check will fail.

    + Otherwise, the new entry will be considered an "addition" to the original list, labeled `new`.

    + If an existing entry does not correspond to any new entry, it will be appended to the response and labeled `deleted`.

1. Frontend will show a summary using the four labels above:

    + `new`
        Checked by default, can be unchecked by user.

    + `modified`
        Checked by default, can be unchecked by user.

    + `deleted`
        Unchecked by default, can be checked by user.

    + `unchanged`
        No action required, display only.

### Step 4: checkout

1. Frontend will provide a "save changes" button that finalizes the upload session.

## API specifications

> TODO: create specifications.

## Additional Comments

+ Before (step 4) "checkout", nothing should be written to the backend.

+ The frontend is responsible to store the intermediate data of an update session until the session was checked out or deleted.

+ The frontend will provide "back" and optionally "next" button to navigate among steps.

+ The frontend will utilize router paths to recover its states when user refreshes the page (or restarts browser).

+ Any existing upload session have to be cleared (checked out or deleted) before a new session starts. The frontend should provide an option to continue with the existing upload session when user attempts to start a new session.

## Potential Data Race (Server mode)

If student list on the server was modified by other clients (or the same client by other approaches), the checkout summary will be outdated. This issue is addressed by attaching a version token to the backend response for 'summary'. The token will be re-calculated upon any modification to the student database.

In the final checkout process, client will cite the version token in its request. If the database has been altered during the session, server will reject the checkout request. In this case, the frontend will prompt an alert to the user and return to the summary step. User must review the summary again in order to checkout.
