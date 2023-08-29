const Mesaage = require("../database/models/message");

// Get rounded time wiht interval of 1 minute
const getRoundedDate = (date = new Date()) => {
  return new Date(
    date.getTime() - date.getSeconds() * 1000 - date.getMilliseconds()
  );
};

// get index with interval of 10 second
const getSegmentIndex = (date = new Date()) => {
  return parseInt(date.getSeconds() / 10);
};

// add time stamp & insert data to mongodb
const insertData = async (data, time) => {
  const minuteDate = getRoundedDate(time);
  const segmentIndex = getSegmentIndex(time);

  try {
    const findRes = await Mesaage.find({ time_stamp: minuteDate });
    if (findRes.length === 0) {
      const message = new Mesaage({
        time_stamp: minuteDate,
        segments: { [segmentIndex]: data },
      });

      const insertRes = await message.save();
      return insertRes;
    } else {
      const updateRes = await Mesaage.findByIdAndUpdate(
        { _id: findRes[0]._id },
        {
          time_stamp: findRes[0].time_stamp,
          segments: {
            ...findRes[0].segments,
            [segmentIndex]: data,
          },
        },
        {
          new: true,
        }
      );
      return updateRes;
    }
  } catch (err) {
    throw err;
  }
};

module.exports = { insertData };
