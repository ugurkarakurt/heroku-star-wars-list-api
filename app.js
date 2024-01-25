const app = require("express")();
const db = require("./db.json");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/list", (req, res) => {
  res.send(200, db);
});

app.get("/list/characters", (req, res) => {
  res.send(200, db.characters);
});

app.get("/list/characters/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.send(400, {
      error_code: "not_found_101",
      message: "Invalid parameter.",
    });
  } else {
    const character = db.characters.find((character) => character.id == req.params.id);
    if (character) {
      res.send(200, character);
    } else {
      res.send(404, {
        error_code: "not_found_100",
        message: "Character not found.",
      });
    }
  }
});

app.get("/list/homeworlds", (req, res) => {
  res.send(200, db.homeworlds);
});

app.get("/list/homeworlds/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.send(400, {
      error_code: "not_found_101",
      message: "Invalid parameter.",
    });
  } else {
    const homeworld = db.homeworlds.find((homeworld) => homeworld.id == req.params.id);
    if (homeworld) {
      res.send(200, homeworld);
    } else {
      res.send(404, {
        error_code: "not_found_100",
        message: "Homeworld not found.",
      });
    }
  }
});

app.post("/list/characters", (req, res) => {
  console.log(req.body.homeworld.toLowerCase());
  console.log(req);
  const homeworld = db.homeworlds.find((homeworld) => homeworld.worldname.toLowerCase() == req.body.homeworld.toLowerCase());

  if (homeworld) {
    const willSaveData = {
      id: new Date().getTime(),
      name: req.body.name,
      height: req.body.height,
      mass: req.body.mass,
      hair_color: req.body.hair_color,
      skin_color: req.body.skin_color,
      eye_color: req.body.eye_color,
      birth_year: req.body.birth_year,
      gender: req.body.gender,
      homeworld: homeworld.id,
    };

    db.characters.push(willSaveData);
    res.send(willSaveData);

  } else {
    res.send(400, {
      error_code: "not_found_102",
      message: "Please enter a valid homeworld."
    })
  }
});

app.patch("/list/characters/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.send(400, {
      error_code: "not_found_101",
      message: "Invalid parameter.",
    });
  } else {
    const character = db.characters.find((character) => character.id == req.params.id);
    console.log(character);
    if (character) {
      Object.keys(req.body).forEach((key) => {
        character[key] = req.body[key];
      });
      res.send(200, character);
    } else {
      res.send(404, {
        error_code: "not_found_100",
        message: "Character not found.",
      });
    }
  }
});

app.delete("/list/characters/:id", (req, res) => {
  if (isNaN(req.params.id)) {
    res.send(400, {
      message: "İşlenemeyen veri..",
    });
  } else {
    const characterIndex = db.characters.findIndex((character) => character.id == req.params.id);
    if (characterIndex > -1) {
      db.characters.splice(characterIndex, 1);
      res.send(201, {
        error_code: "not_found_101",
        message: "Invalid parameter.",
      });
    } else {
      res.send(404, {
        error_code: "not_found_100",
        message: "Character not found.",
      });
    }
  }
});

app.listen(process.env.PORT || "3000", () => {
  console.log("Sunucu ayaktadır.");
});
