require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

const app = express();
console.log("SERVER FILE LOADED");
const PORT = process.env.PORT || 3000;

// Database Connection
const db = require("./config/db");
const ADMIN_EMAIL = "admin@nayepankh.com";
const ADMIN_PASSWORD = "admin123";

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
        secret: "nayepankhsecretkey",
        resave: false,
        saveUninitialized: false
    })
);

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes

// Home Page
app.get("/", (req, res) => {
    res.render("index");
});

// About Page
app.get("/about", (req, res) => {
    res.render("about");
});

// Programs Page
app.get("/programs", (req, res) => {
    res.render("programs");
});

// Events Page
app.get("/events", (req, res) => {
    res.render("events");
});

// Volunteer Page
app.get("/volunteer", (req, res) => {
    res.render("volunteer");
});
app.post("/volunteer", (req, res) => {

    const { name, email, phone, city } = req.body;

    const sql =
    "INSERT INTO volunteers(name,email,phone,city) VALUES(?,?,?,?)";

    db.query(sql, [name, email, phone, city], (err, result) => {

        if(err){
            console.log(err);
            return res.send("Error registering volunteer");
        }

        res.send("Volunteer Registered Successfully!");
    });

});

// Donate Page
app.get("/donate", (req, res) => {
    res.render("donate");
});
app.post("/donate", (req, res) => {

    const {
        fullname,
        whatsapp,
        email,
        city,
        donation_type
    } = req.body;

    const sql = `
    INSERT INTO donors
    (fullname, whatsapp, email, city, donation_type)
    VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [fullname, whatsapp, email, city, donation_type],
        (err, result) => {

            if(err){
                console.log(err);
                return res.send("Error submitting donation form");
            }

            res.send(
                "Thank you! We will contact you on WhatsApp soon."
            );
        }
    );
});

// Gallery Page
app.get("/gallery", (req, res) => {
    res.render("gallery");
});

// Contact Page
app.get("/contact", (req, res) => {
    res.render("contact");
});

// Admin Login Page
// Admin Login Page
app.get("/admin/login", (req, res) => {
    res.render("admin/login");
});

// Admin Login Authentication
app.post("/admin/login", (req, res) => {

    const { email, password } = req.body;

    console.log(email, password);

    if (
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
    ) {
        req.session.admin = true;

        return res.redirect("/admin/dashboard");
    }

    res.send("Invalid Email or Password");

});

// Admin Dashboard
app.get("/admin/dashboard", (req, res) => {

    if (!req.session.admin) {
        return res.redirect("/admin/login");
    }

    const volunteerQuery = "SELECT * FROM volunteers";
    const donorQuery = "SELECT * FROM donors";

    db.query(volunteerQuery, (err, volunteers) => {

        if (err) {
            console.log(err);
            return res.send("Error fetching volunteers");
        }

        db.query(donorQuery, (err, donors) => {

            if (err) {
                console.log(err);
                return res.send("Error fetching donors");
            }

            res.render("admin/dashboard", {
                volunteers,
                donors
            });

        });

    });

});



// Test Route
app.get("/test", (req, res) => {
    res.send("Naye Pankh Foundation Server Running Successfully!");
});
// Admin Logout
app.get("/admin/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/admin/login");
    });

});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});