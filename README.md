# WhatsApp Service

This Project provides merchants to signUp and connect their whatsapp business account and send messages to their customers.

---

## Local Requirements

For development, you will need Node.js, npm, and postgres installed in your environment.

    $ node --version
    v16.16.0.

    $ npm --version
    8.11.0

---

## Cloud Requirements

For development, you will need Google Cloud project set up that has access to cloud run, bigquery, firestore, pub/sub and cloud storage.

create a bigquery table and link it with pub/sub so we can
store the app activity logs in bigquery.

---

## Install

    $ git clone https://github.com/tars47/meta-whatsapp-service
    $ cd meta-whatsapp-service

## Configure app

Open `/.env` replace all the variables with your account specific
variables.

place your firestore credential file in the cretificates folder.

## Running the project

    $ npm i
    $ npm run start
