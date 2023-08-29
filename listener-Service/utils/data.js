const Mesaage = require("../database/models/message");

const getRoundedDate = (minutes, d = new Date()) => {
  let ms = 1000 * 60 * minutes;
  let roundedDate = new Date(Math.round(d.getTime() / ms) * ms);

  return roundedDate;
};

const getSegmentIndex = (d = new Date()) => {
  return parseInt(d.getSeconds() / 10);
};

const insertData = async (data, time) => {
  const minuteDate = getRoundedDate(1, time);
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
