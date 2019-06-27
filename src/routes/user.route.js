const express = require("express");
const userRouter = express.Router();
const Controller = require("../controllers/user.controller");

userRouter.get("/", Controller.findAllUser);

userRouter.post("/:id", Controller.createOnePokemon);
userRouter.get("/:id", Controller.findOneUser);
userRouter.delete("/:id", Controller.deleteOnePokemon);

module.exports = userRouter;
