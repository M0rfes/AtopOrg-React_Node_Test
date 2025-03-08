const MeetingHistory = require("../../model/schema/meeting");
const mongoose = require("mongoose");

const add = async (req, res) => {
  try {
    const metting = new MeetingHistory(req.body);
    await metting.save();
    res.status(200).json(metting);
  } catch (err) {
    console.error("Failed to create Lead:", err);
    res.status(400).json({ error: "Failed to create Lead" });
  }
};

const index = async (req, res) => {
  try {
    const query = req.query;
    query.deleted = false;

    let allData = await MeetingHistory.find(query)
      .populate(
        {
          path: "createBy",
          match: { deleted: false },
        },
        {
          path: "attendes",
          match: { deleted: false },
        },
        {
          path: "attendesLead",
          match: { deleted: false },
        }
      )
      .exec();

    const result = allData.filter((item) => item.createBy !== null);
    res.send(result);
  } catch {
    res.status(404).json({ message: "error", err });
  }
};

const view = async (req, res) => {
  try {
    const metting = await MeetingHistory.findOne({ _id: req.params.id })
      .populate(
        {
          path: "createBy",
          match: { deleted: false },
        },
        {
          path: "attendes",
          match: { deleted: false },
        },
        {
          path: "attendesLead",
          match: { deleted: false },
        }
      )
      .exec();
    if (!metting && metting.createBy !== null)
      return res.status(404).json({ message: "no Data Found." });
    res.send(metting);
  } catch {
    res.status(404).json({ message: "error", err });
  }
};

const deleteData = async (req, res) => {
  try {
    const metting = await MeetingHistory.findByIdAndUpdate(req.params.id, {
      deleted: true,
    });
    res.status(200).json({ message: "done", lead: metting });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const metting = await MeetingHistory.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", lead: metting });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
