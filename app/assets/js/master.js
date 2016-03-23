$(function () {
  var Navigation = React.createClass({
    displayName: "Navigation",

    getInitialState: function () {
      return {
        data: [],
        selected: ""
      };
    },
    componentDidMount: function () {

      function markSelected(node, selected) {
        if (!node) {
          return null;
        }

        node.Selected = node.Id == selected;

        if (node.Selected) {
          node.Selected = true;
          return node;
        }

        if (!node.Nodes || !node.Nodes.length) {
          return null;
        }

        for (var i = 0; i < node.Nodes.length; i++) {
          var nodeChild = node.Nodes[i];
          var nodeFound = markSelected(nodeChild, selected);

          if (nodeFound) {
            node.Expanded = true;
            return nodeFound;
          }
        }

        return null;
      }

      $.getJSON(this.props.source, function (result) {
        if (this.isMounted()) {
          this.setState({
            data: result
          });
          var param = decodeURIComponent(location.search.split('myParam=')[1]);
          var that = this;
          this.setState({ selected: param });
          $.each(this.state.data, function (key, val) {

            var node = markSelected(val, that.state.selected);

            if (node) {
              node.Expanded = true;
            }
            // do something with key and val
          });
          this.setState({ data: this.state.data });
          console.dir(this.state.data);
        }
      }.bind(this));
    },
    openChild: function (e) {
      e.preventDefault();
      var target = e.target;
      console.log($(target).attr("data-expanded"));
      if ($(target).attr("data-expanded") == "true") {
        $(target).attr("data-expanded", "false");
        $(target).children(".hasChildren").hide();
      } else {
        $(target).attr("data-expanded", "true");
        $(target).children(".hasChildren").show();
      }
    },
    // update: function(){   
    //   var newState = "state";
    //   this.props.callbackParent(newState);
    // },
    registerBookmark: function (e) {
      e.preventDefault();
      console.log("Bookmarked");
    },
    onChildChanged: function (newState) {
      console.log(newState);
    },
    eachItem: function (item, i) {
      if (item.Nodes.length != 0) {
        return React.createElement(
          "li",
          { key: i,
            index: i,
            className: i === this.props.active - 1 ? 'dropdown active' : 'dropdown',
            onClick: this.openChild,
            "data-expanded": item.Expanded
          },
          React.createElement(
            "a",
            { href: item.Id, className: item.Selected },
            item.Name
          ),
          React.createElement(
            "ul",
            { className: "hasChildren", "data-expanded": item.Expanded },
            React.createElement(NavigationTree, { data: item.Nodes, callbackParent: this.onChildChanged })
          )
        );
      } else {
        return React.createElement(
          "li",
          { key: i,
            index: i,
            className: i === this.props.active - 1 ? 'dropdown active' : 'dropdown',
            onClick: this.openChild,
            "data-expanded": item.Expanded
          },
          React.createElement(
            "a",
            { href: item.Id, className: item.Selected },
            item.Name
          ),
          React.createElement(
            "a",
            { href: "", "data-bookmark": item.Bookmarked, onClick: this.registerBookmark },
            React.createElement("i", { className: "fa fa-bookmark-o" })
          )
        );
      }
    },
    render: function () {
      return React.createElement(
        "ul",
        { className: "componentWrapper" },
        this.state.data.map(this.eachItem)
      );
    }
  });
  var NavigationTree = React.createClass({
    displayName: "NavigationTree",

    getInitialState: function () {
      return {
        data: [],
        itemId: ""
      };
    },
    update: function (e) {
      e.preventDefault();
      var newState = "state";
      this.setState({ itemId: newState });
    },
    componentDidMount: function () {
      this.setState({ data: this.props.data });
    },
    eachItem: function (item, i) {
      if (item.Nodes.length != 0) {
        var nodes = item.Nodes;
        return React.createElement(
          "li",
          { key: i,
            index: i,
            className: i === this.props.active - 1 ? 'dropdown active' : 'dropdown',
            onClick: this.openChild,
            "data-expanded": item.Expanded
          },
          React.createElement(
            "a",
            { href: item.Id, className: item.Selected },
            item.Name
          ),
          React.createElement(
            "ul",
            { className: "hasChildren", "data-expanded": item.Expanded },
            React.createElement(NavigationTree, { key: i, data: item.Nodes })
          )
        );
      } else {
        return React.createElement(
          "li",
          { key: i,
            index: i,
            className: "noIcon",
            onClick: this.openChild,
            "data-expanded": item.Expanded
          },
          React.createElement(
            "a",
            { href: item.Id, onClick: this.update, className: item.Selected },
            item.Name
          ),
          React.createElement(
            "a",
            { href: "", "data-bookmark": item.Bookmarked, onClick: this.registerBookmark },
            React.createElement("i", { className: "fa fa-bookmark-o" })
          )
        );
      }
    },
    render: function () {
      return React.createElement(
        "div",
        null,
        this.state.data.map(this.eachItem)
      );
    }
  });
  var RenderPage = React.createClass({
    displayName: "RenderPage",

    getInitialState: function () {
      return {
        pageId: ""
      };
    },
    update: function () {
      this.setState({ pageID: "test" });
    },
    //  onChildChanged: function(newState) {
    //       this.setState({ checked: newState });
    // },
    render: function () {
      return React.createElement(
        "div",
        { className: "wrapper" },
        React.createElement(
          "div",
          { className: "col-sm-3" },
          React.createElement(
            "div",
            { id: "catalogNavContainer" },
            React.createElement(
              "section",
              { className: "catalogNavSection topSection" },
              React.createElement(
                "h1",
                null,
                "JAYCO"
              ),
              React.createElement(
                "a",
                { className: "btn btn-sm btn-warning pull-right" },
                "Select Catalog"
              )
            ),
            React.createElement(
              "section",
              { className: "catalogNavSection searchSection" },
              React.createElement(
                "form",
                { action: "/Default.aspx", id: "searchForm" },
                React.createElement("input", { type: "hidden", name: "ID", value: "@resultsPage" }),
                React.createElement("input", { placeholder: "Serial #", id: "searchSubmit", "data-error": "Search for something", type: "text", name: "q", value: "" }),
                React.createElement(
                  "button",
                  { className: "btn btn-sm btn-warning", type: "submit" },
                  React.createElement("i", { className: "fa fa-search" })
                )
              )
            ),
            React.createElement(
              "section",
              { className: "catalogNavSection navSection navigation" },
              React.createElement(Navigation, { source: "/Files/WebServices/Navigation.ashx", onChange: this.update })
            )
          )
        ),
        React.createElement(
          "div",
          { className: "col-sm-9" },
          React.createElement(
            "p",
            null,
            "Loading..."
          )
        )
      );
    }
  });

  ReactDOM.render(React.createElement(RenderPage, null), document.getElementById('react-renderPage'));
  // ReactDOM.render(<Navigation source="http://localhost:3000/resources/navigation.json"  />, document.getElementById('react-navigation'));
});