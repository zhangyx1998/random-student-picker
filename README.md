# Random Student Picker

> Author: [Yuxuan Zhang](mailto:admin@yuxuanzhang.net)

## Core Concepts - _A Quick Guide_

+ We have two tables: **_student_** table and **_record_** table.

+ Each **_record_** is linked to a **_student_**. You can credit or comment each **_record_** separately.

+ Clicking the `RANDOM` button will create a new **_record_**.

+ Records can also be added, modified or deleted manually (here is [how](docs/feature-record-management.md)).

+ List of all students' participation history can be viewed in "students" page.

+ Random picker **prefers** those who were picked less.

    > In a future version, you will have a switch in "settings" to get unbiased random picks.

## Features

1. Requires password to log in (only in Server Mode).
1. Upload student list from `CSV` files ([details](docs/feature-batch-upload.md)).
1. Generate random picks uniformly or based on weights. Students picked less can have a greater chance.
1. Tracking and commenting each random pick record. You can use these features to quickly mark how the student answered your question.
1. Exporting the entire history as `CSV` (planned).

## Setup and deploy

### Server Mode

+ #### Serving a Demo

    The following command will quickly walk you through a local demo.

    ```sh
    make demo
    ```

    When you run this command for the first time, it will ask you for a new password. You can either type in your desired password or press enter to let the script generate a random password for you.

    > To run the server on a specific port, you can run the following command instead.
    > ```sh
    > # Replace $YOUR_PORT with your desired port number.
    > SRV_PORT=$YOUR_PORT make demo
    > ```

+ #### Deployment

    Details will be available after dependent features ([batch upload](docs/feature-batch-upload.md) and [student managenent](docs/feature-student-management.md)) are implemented.

### WebAPP Mode <spu>\*</sup>

> `*` Coming soon

In this mode, the app runs entirely in your browser. Your data will be stored locally in your browser and **never leaves your computer**.

A **blue shield icon** will show on the upper left corner (desktop) or at the navigation menu (mobile).

**NOTICE**: Since all data are stored in your browser locally, using different browsers will create different instances of the same app. It's your responsibility to keep track of your data which is tied to your browser.
