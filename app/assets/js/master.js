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
      if ($(target).hasClass("opened")) {
        $(target).removeClass("opened");
        $(target).children(".hasChildren").slideUp("fast");
      } else {
        $(target).addClass("opened");
        $(target).children(".hasChildren").slideDown("fast");
      }
    },
    registerBookmark: function (e) {
      e.preventDefault();
      console.log("Bookmarked");
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
            { href: item.Id, onCLick: "", className: item.Selected },
            item.Name
          ),
          React.createElement(
            "ul",
            { className: "hasChildren", "data-expanded": item.Expanded },
            React.createElement(NavigationTree, { data: item.Nodes })
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
        data: []
      };
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
        "div",
        null,
        this.state.data.map(this.eachItem)
      );
    }
  });
  // var RenderTreeLink = React.createClass({
  //   getInitialState: function(){
  //     return {
  //       i: 0,
  //       bookmark: false,
  //       name: ""
  //     }
  //   },
  //   render: function() {     
  //       return (
  //         <li key={i}
  //                   index={i}
  //                   className={(i === this.props.active - 1) ? 'dropdown active' : 'dropdown'}                
  //               ><a href={item.Id} onClick={this.openChild} data-bookmark={item.Bookmarked} >{item.Name}</a>
  //               <NavigationTree key={i} data={item.Nodes}/>
  //          </li>

  //       );
  //   }
  // });

  ReactDOM.render(React.createElement(Navigation, { source: "/Files/WebServices/Navigation.ashx" }), document.getElementById('react-navigation'));
});