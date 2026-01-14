import userModel from "../models/userModel";
import baseController from "./baseController";

const userController = new baseController(userModel);

export default userController;
