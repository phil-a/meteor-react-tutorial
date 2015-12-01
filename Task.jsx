// Task component - this represents a single todo item
Task = React.createClass({
  propTypes: {
    // This component gets the task to display through a React prop.
    // We can use propTypes to indicate it is required
    task: React.PropTypes.object.isRequired,
    showPrivateButton: React.PropTypes.bool.isRequired //add new prop type for Task component
  },

  toggleChecked() {
    // Set the checked property to the opposite of its current value
    Meteor.call("setChecked", this.props.task._id, ! this.props.task.checked);
  },

  deleteThisTask() {
    Meteor.call("removeTask", this.props.task._id);
  },

  //Add private button event handler to Task
  togglePrivate() {
    Meteor.call("setPrivate", this.props.task._id, ! this.props.task.private);
  },

  render() {
    //Change className of task (for css styling)
    //Add "checked" and/or "private" to className when needed
    const taskClassName = (this.props.task.checked ? "checked" : "") + " " + 
      (this.props.task.private ? "private" : "");

    return (
      <li className={taskClassName}>
        <button className="delete" onClick={this.deleteThisTask}>
          &times;
        </button>
        
        <input
          type="checkbox"
          readOnly={true}
          checked={this.props.task.checked}
          onClick={this.toggleChecked} />

        {/*Add private button, shown only to owner*/}
        { this.props.showPrivateButton ? (
          <button className="toggle-private" onClick={this.togglePrivate}>
            { this.props.task.private ? "Private" : "Public" }
          </button>  
          ) : '' }

        <span className="text">
          <strong>{this.props.task.username}</strong>: {this.props.task.text}
        </span>
      </li>
    );
  }
});