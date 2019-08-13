const express = require("express");
const userRouter = express.Router();
const Controller = require("../controllers/user.controller");

userRouter.get("/", Controller.findAllUser);
userRouter.post("/", Controller.createOneUser);

userRouter.get("/:id", Controller.findOneUser);
userRouter.post("/:id", Controller.createOnePokemon);
userRouter.delete("/:id", Controller.deleteOnePokemon);

module.exports = userRouter;
