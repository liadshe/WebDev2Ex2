import {Request, Response} from "express";

class baseController{
    model: any;

    constructor(model: any) {
        this.model = model;
    }
    async getAll(req: Request, res: Response) {
  try {
    if (req.query) {
      const filterdata = await this.model.find(req.query);
      return res.json(filterdata);
    } else {
      const data = await this.model.find();
      res.json(data);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data");
  }
};

async getById(req: Request, res: Response){
  const id = req.params.id;
  try {
    const data = await this.model.findById(id);

    if (!data) {
      return res.status(404).send("Data not found");
    }
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data by ID");
  }
};

async create(req: Request, res: Response){
  const data = req.body;
  try {
    const newData = await this.model.create(data);
    res.status(201).json(newData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating data");
  }
};

async del(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const deletedData = await this.model.findByIdAndDelete(id);
    if (!deletedData) {
      return res.status(404).send("Data not found");
    }
    res.status(200).json(deletedData._id);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting data");
  }
};

async update(req: Request, res: Response) {
  const id = req.params.id;
  const updatedData = req.body;
  try {
    const data = await this.model.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating data");
  }
};
};

export default baseController;

