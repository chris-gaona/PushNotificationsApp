const schedule = require("node-schedule");
const Question = require("../models/Question");
const PushNotifications = require("../models/PushNotification");

const createNewQuestionJob = () => {
  // Run at the top of every hour
  const scheduleRule = "0 * * * *";
  const job = schedule.scheduleJob(scheduleRule, () =>
    Question.setNewQuestion().then(questions => {
      return PushNotifications.sendNewNotificationToAll({
        questions,
        nextQuestionTime: job.nextInvocation()
      });
    })
  );

  return job;
};

const job = schedule.scheduleJob("0 * * * *", () => null);
Question.setNewQuestion().then(questions => {
  return PushNotifications.sendNewNotificationToAll({
    questions,
    nextQuestionTime: job.nextInvocation()
  });
});

module.exports = {
  createNewQuestionJob
};
