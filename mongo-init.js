// mongo-init.js
db.createUser({
    user: "tailor_admin",
    pwd: "tailor_password",
    roles: [
        {
            role: "readWrite",
            db: "tailoring_db"
        }
    ]
});

db.createCollection("users");
db.createCollection("clients");
db.createCollection("calendarevents");
db.createCollection("payments");
db.createCollection("feedback");