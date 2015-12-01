// Define a collection to hold our tasks
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  // This code is executed on the client only
  //Use usernames instead of email addresses
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  //Uses publish/subscribe model subscribe to tasks
  Meteor.subscribe("tasks");

  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<App />, document.getElementById("render-target"));
  });
}

//Without autopublish package we need to specify exactly what server sends to client
if (Meteor.isServer) {
  //Only publish tasks that are public or belong to current user
  Meteor.publish("tasks", function () {
    return Tasks.find({
      $or: [
        { private: {$ne: true} },
        { owner: this.userId }
      ]
    });
  });
}

//Define methods for each db operation
Meteor.methods({
  addTask(text) {
    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
 
    Tasks.insert({
      text: text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
 
  removeTask(taskId) {
    const task = Tasks.findOne(taskId);
    if (tasks.private && task.owner !== Meteor.userId()){
      // If task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    Tasks.remove(taskId);
  },
 
  setChecked(taskId, setChecked) {
    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }
    
    Tasks.update(taskId, { $set: { checked: setChecked} });
  },

  //A Button that only shows up for owners of task to make private
  setPrivate(taskId, setToPrivate) {
    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(taskId, {$set: { private: setToPrivate } });
  }
});