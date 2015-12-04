const {
    AppCanvas,
    AppBar,
    Styles,
    RaisedButton,
    Checkbox,
    DatePicker,
    TextField
    } = mui;

const LoginButtons = BlazeToReact('loginButtons');

// App component - represents the whole app
App = React.createClass({

  // This mixin makes the getMeteorData method work
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      hideCompleted: false
    }
  },

  // Loads items from the Tasks collection and puts them on this.data.tasks
  getMeteorData() {
    let query = {};

    if (this.state.hideCompleted) {
      // If hide completed is checked, filter tasks
      query = {checked: {$ne: true}};
    }

    return {
      tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
      currentUser: Meteor.user()
    };
  },

  renderTasks() {
    // Get tasks from this.data.tasks
    return this.data.tasks.map((task) => {
      //update renderTasks to pass in showPrivateButton
      const currentUserId = this.data.currentUser && this.data.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      return <Task
        key={task._id}
        task={task}
        showPrivateButton={showPrivateButton} />
    });
  },

  handleSubmit(event) {
    event.preventDefault();

    // Find the text field via the React ref
    var text = React.findDOMNode(this.refs.textInput).value.trim();

    Meteor.call("addTask", text);

    // Clear form
    React.findDOMNode(this.refs.textInput).value = "";
  },

  toggleHideCompleted() {
    this.setState({
      hideCompleted: ! this.state.hideCompleted
    });
  },

  render() {
    return (
      <div className="container">
      <LoginButtons />
      { this.data.currentUser ?
        <div className="goal-count">You have ({this.data.incompleteCount}) goals for the day</div> : ''
      }
      <div className="logo"></div>
      <h1 className="title">Yearn</h1>
      <div className="subtitle">Achieve something everyday</div>

        <header>
          {/*Show form only when user logged in*/}


          { this.data.currentUser ?
          <label className="hide-completed">
            <Checkbox
              readOnly={true}
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted} />
            Hide Completed Tasks
          </label> : ''
          }
        </header>

          { this.data.currentUser ?
            <TextField className="new-task" onSubmit={this.handleSubmit} >
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks" />
            </TextField> : ''
          }

          { this.data.currentUser ?
            <ul>
              {this.renderTasks()}
            </ul> : <h3> Sign in above to your account to start achieving </h3>
          }

      </div>
    );
  }
});
