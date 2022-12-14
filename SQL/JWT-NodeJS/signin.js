import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

export const signIn = (req, res) => {
  console.info(req.headers);
  const { userName, password } = req.body;

  const expiresIn = 60; //turi buti .env
  const issuedAt = new Date().getTime();

  const users = {
    Jonas: "kaledos",
    Alex: "velykos",
  };

  if (typeof userName !== "string" || typeof password !== "string") {
    return res.status(400).send({ error: `Data is incorrect` }).end();
  }

  if (!userName && !password) {
    return res
      .status(400)
      .send({ error: `Please provide ${userName} and ${password}` })
      .end();
  }

  if (password !== users[userName]) {
    return res.status(400).send({ error: `Incorrect login data` });
  }

  const token = jwt.sign({ userName, issuedAt }, jwtSecret, {
    //acces token
    algorithm: "HS256",
    expiresIn, //turi buti enve
  });
  res.cookie("token", token, { maxAge: expiresIn * 1_000 });

  res.status(201).send({ message: `Signed in succefuly` }).end();
};
