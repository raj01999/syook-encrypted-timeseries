const Mesaage = require("../database/models/message");

// Get rounded time wiht interval of @params {minutes}
const getRoundedDate = (minutes, d = new Date()) => {
  let ms = 1000 * 60 * minutes;
  let roundedDate = new Date(Math.round(d.getTime() / ms) * ms);

  return roundedDate;
};

// get index with interval of @params {second}
const getSegmentIndex = (d = new Date(), second) => {
  return parseInt(d.getSeconds() / second);
};

// add time stamp & insert data to mongodb
const insertData = async (data, time) => {
  const minuteDate = getRoundedDate(1, time);
  const segmentIndex = getSegmentIndex(time, 10);

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
