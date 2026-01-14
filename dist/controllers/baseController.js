"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class baseController {
    constructor(model) {
        this.model = model;
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query) {
                    const filterdata = yield this.model.find(req.query);
                    return res.json(filterdata);
                }
                else {
                    const data = yield this.model.find();
                    res.json(data);
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Error retrieving data");
            }
        });
    }
    ;
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const data = yield this.model.findById(id);
                if (!data) {
                    return res.status(404).send("Data not found");
                }
                res.json(data);
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Error retrieving data by ID");
            }
        });
    }
    ;
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            try {
                const newData = yield this.model.create(data);
                res.status(201).json(newData);
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Error creating data");
            }
        });
    }
    ;
    del(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const deletedData = yield this.model.findByIdAndDelete(id);
                if (!deletedData) {
                    return res.status(404).send("Data not found");
                }
                res.status(200).json(deletedData._id);
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Error deleting data");
            }
        });
    }
    ;
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const updatedData = req.body;
            try {
                const data = yield this.model.findByIdAndUpdate(id, updatedData, {
                    new: true,
                });
                res.json(data);
            }
            catch (err) {
                console.error(err);
                res.status(500).send("Error updating data");
            }
        });
    }
    ;
}
;
exports.default = baseController;
//# sourceMappingURL=baseController.js.map