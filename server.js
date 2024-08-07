// ###############################################################################
// Web Technology at VU University Amsterdam
// Assignment 3
//
// The assignment description is available on Canvas.
// Please read it carefully before you proceed.
//
// This is a template for you to quickly get started with Assignment 3.
// Read through the code and try to understand it.
//
// Have you read the zyBook chapter on Node.js?
// Have you looked at the documentation of sqlite?
// https://www.sqlitetutorial.net/sqlite-nodejs/
//
// Once you are familiar with Node.js and the assignment, start implementing
// an API according to your design by adding routes.

// ###############################################################################
//
// Database setup:
// First: Our code will open a sqlite database file for you, and create one if it not exists already.
// We are going to use the variable "db' to communicate to the database:
// If you want to start with a clean sheet, delete the file 'media.db'.
// It will be automatically re-created and filled with one example item.

const sqlite = require("sqlite3").verbose();
let db = my_database("./media.db");

// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");

const app = express();
app.use(express.json());
// Enable CORS
var cors = require("cors");
app.use(cors());
// We need some middleware to parse JSON data in the body of our HTTP requests:

// ###############################################################################
// Routes
//
// TODO: Add your routes here and remove the example routes once you know how
//       everything works.
// ###############################################################################

// This example route responds to http://localhost:3000/hello with an example JSON object.
// Please test if this works on your own device before you make any changes.
// Do not remove this endpoint as it is used for codegrade evaluation.
app.get("/hello", function (req, res) {
  response_body = { Hello: "Deneme" };

  // This example returns valid JSON in the response, but does not yet set the
  // associated HTTP response header.  This you should do yourself in your
  // own routes!
  res.json(response_body);
});

// This route responds to http://localhost:3000/db-example by selecting some data from the
// database and return it as JSON object.
// Please test if this works on your own device before you make any changes.
app.get("/db-example", function (req, res) {
  // Example SQL statement to select the name of all products from a specific brand
  db.all(`SELECT * FROM media WHERE name=?`, ["Celeste"], function (err, rows) {
    // TODO: add code that checks for errors so you know what went wrong if anything went wrong
    // TODO: set the appropriate HTTP response headers and HTTP response codes here.

    // # Return db response as JSON
    return res.json(rows);
  });
});

app.post("/post-example", function (req, res) {
  // This is just to check if there is any data posted in the body of the HTTP request:
  console.log(req.body);
  return res.json(req.body);
});

// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000, '0.0.0.0', () => {
  console.log('Your Web server should be up and running, waiting for requests to come in. Try http://localhost:3000/hello');
});

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
  // Conncect to db by opening filename, create filename if it does not exist:
  var db = new sqlite.Database(filename, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the media database.");
  });
  // Create our media table if it does not exist already:
  db.serialize(() => {
    db.run(`
        	CREATE TABLE IF NOT EXISTS media
        	 (
                    id INTEGER PRIMARY KEY,
                    name CHAR(100) NOT NULL,
                    year CHAR(100) NOT NULL,
                    genre CHAR(256) NOT NULL,
                    poster char(2048) NOT NULL,
                    description CHAR(1024) NOT NULL
		 )
		`);
    db.all(`select count(*) as count from media`, function (err, result) {
      if (result[0].count == 0) {
        db.run(
          `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)`,
          [
            "Arcane",
            "2021",
            "animation, action, adventure, tv-show",
            "https://www.nerdpool.it/wp-content/uploads/2021/11/poster-arcane.jpg",
            "Set in Utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League Of Legends champions and the power that will tear them apart.",
          ]
        );
        db.run(
          `INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)`,
          [
            "Celeste",
            "2018",
            "platformer, video-game",
            "https://upload.wikimedia.org/wikipedia/commons/0/0f/Celeste_box_art_full.png",
            "Celeste is a critically acclaimed two-dimensional platform game developed by Maddy Makes Games. The player controls Madeline, a young woman who sets out to climb Celeste Mountain. The game features tight controls, challenging levels, and a touching story about overcoming personal demons.",
          ]
        );
        console.log("Inserted dummy photo entry into empty database");
      } else {
        console.log(
          "Database already contains",
          result[0].count,
          " item(s) at startup."
        );
      }
    });
  });
  return db;
}

// Example route for retrieving all media
app.get("/api/media", (req, res) => {
  // nothing required so its not used
  db.all("SELECT * FROM media", (err, rows) => {
    if (err) {
      console.error(
        "Error retrieving images media from database:",
        err.message
      );
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(rows);
    }
  });
});

// Example route for adding a new photo
app.post("/api/media", (req, res) => {
  const { name, year, genre, poster, description } = req.body;
  db.run(
    "INSERT INTO media (name, year, genre, poster, description) VALUES (?, ?, ?, ?, ?)",
    [name, year, genre, poster, description],
    function (err) {
      if (err) {
        console.error("Error adding photo to database:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(201).json({ message: "Photo added successfully" });
      }
    }
  );
});
// Example route for retrieving a specific media by ID
app.get("/api/media/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM media WHERE id=?", [id], (err, row) => {
    if (err) {
      console.error("Error retrieving media from database:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (!row) {
      res.status(404).json({ error: "Media not found" });
    } else {
      res.json(row);
    }
  });
});

// Example route for updating a photo
app.put("/api/media/:id", (req, res) => {
  const { name, year, genre, poster, description } = req.body;
  const id = req.params.id;
  db.run(
    "UPDATE media SET name=?, year=?, genre=?, poster=?, description=? WHERE id=?",
    [name, year, genre, poster, description, id],
    function (err) {
      if (err) {
        console.error("Error updating photo in database:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json({ message: "Photo updated successfully" });
      }
    }
  );
});

// Example route for deleting a photo
app.delete("/api/media/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM media WHERE id=?", [id], function (err) {
    if (err) {
      console.error("Error deleting photo from database:", err.message);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json({ message: "Photo deleted successfully" });
    }
  });
});

// Example route for reseting the database
 app.delete("/api/reset", (req, res) => {
   db.serialize(() => {
     db.run("DELETE FROM media", (err) => {
       if (err) {
         console.error("Error resetting database:", err.message);
         res.status(500).json({ error: "Internal Server Error" });
       } else {
         res.json({ message: "Database reset successful" });
       }
     });
   });
 });
