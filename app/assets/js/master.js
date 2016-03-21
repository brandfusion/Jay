var Navigation = React.createClass({
  displayName: "Navigation",

  getInitialState: function () {
    return {
      data: []
    };
  },
  componentDidMount: function () {
    $.getJSON(this.props.source, function (result) {
      if (this.isMounted()) {
        this.setState({
          data: result[this.props.target]
        });
      }
    }.bind(this));
  },
  openChild: function (e) {
    e.preventDefault();
    var target = e.target;
    $(target).parent(".dropdown").addClass("opened");
    $(target).parent(".dropdown").children(".hasChildren").first().slideToggle("fast");
  },
  eachItem: function (item, i) {
    console.log(item);
    React.createElement(NavigationTree, { key: i, data: item });
  },
  render: function () {

    return React.createElement(
      "ul",
      null,
      this.state.data.map(this.eachItem)
    );
  }
});
var NavigationTree = React.createClass({
  displayName: "NavigationTree",

  getInitialState: function () {
    return {
      data: []
    };
  },
  componentDidMount: function () {
    this.setState({ data: this.props.data });
  },
  openChild: function (e) {
    e.preventDefault();
    var target = e.target;
    $(target).parent(".dropdown").addClass("opened");
    $(target).parent(".dropdown").children(".hasChildren").first().addClass("opened").slideToggle("fast");
  },
  eachItem: function (item, i) {
    if (item.Nodes.length != 0) {
      var nodes = item.Nodes;
      return React.createElement(
        "li",
        { key: i,
          index: i,
          className: i === this.props.active - 1 ? 'dropdown active' : 'dropdown'
        },
        React.createElement(
          "a",
          { href: item.Id, onClick: this.openChild, "data-bookmark": item.Bookmark },
          item.Name
        ),
        React.createElement(NavigationTree, { key: i, data: item.Nodes })
      );
    } else {
      return React.createElement(
        "li",
        { key: i,
          index: i,
          className: i === this.props.active - 1 ? 'dropdown active' : 'dropdown'
        },
        React.createElement(
          "a",
          { href: item.Id, onClick: this.openChild, "data-bookmark": item.Bookmark },
          item.Name
        )
      );
    }
  },
  render: function () {
    return React.createElement(
      "ul",
      { className: "hasChildren" },
      this.state.data.map(this.eachItem)
    );
  }
});

ReactDOM.render(React.createElement(Navigation, { source: "http://localhost:3000/resources/navigation.json", target: "mainNav" }), document.getElementById('react-navigation'));