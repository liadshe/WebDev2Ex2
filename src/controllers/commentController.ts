    import commentModel from "../models/commentModel";
    import baseController from "./baseController";

    const commentsController = new baseController(commentModel);

    export default commentsController