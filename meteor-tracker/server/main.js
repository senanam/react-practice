// main.js

import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import { Task } from "../imports/api/collections";

Meteor.methods({
  "task.insert"(text) {
    check(text, String);

    // if (!this.userId) {
    //   throw new Meteor.Error("Not authorized.");
    // }

    Task.insert({
      text,
      createdAt: new Date(),
      // userId: this.userId,
      isChecked: false, // 추가된 부분
    });
  },

  "task.remove"(taskId) {
    check(taskId, String);

    // if (!this.userId) {
    //   throw new Meteor.Error("Not authorized.");
    // }

    Task.remove(taskId);
  },

  "task.setChecked"(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error("Not authorized.");
    }

    Task.update(taskId, {
      $set: {
        isChecked,
      },
    });
  },
});

if (Meteor.isServer) {
  Meteor.publish("task", function () {
    return Task.find({ userId: this.userId });
  });
}
