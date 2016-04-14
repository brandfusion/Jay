window.downloadPdf = function () {
  $('.download-pdf').on("click", function (f) {
    f.preventDefault();
    var value = $(this).parents(".form-group").find('[data-selected-value]').attr("data-selected-value");
    $(this).parents(".form-group").find("a").each(function () {
      var currentValue = $(this).attr("data-option-value");
      if (currentValue == value) {
        $('#pdfDownloadFrame').attr("src", value);
      }
    });
  });
};
window.markSelected = function (node, selected) {
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
};
window.addToFavorites = function (arg) {
  var addToFavorites = arg.attr("data-add-favorites");
  $.ajax({
    url: addToFavorites,
    type: 'POST'
  }).done(function (response) {
    alert("sent");
    arg.find(".fa-heart").removeClass("fa-heart-o");
    arg.attr("data-favorite", "true");
  });
};
window.removeFromFavorites = function (arg) {
  var removeFromFavorites = arg.attr("data-remove-favorites");
  $.ajax({
    url: removeFromFavorites,
    type: 'POST'
  }).done(function (response) {
    // console.log("success");
    alert("sent");
    arg.find(".fa-heart").addClass("fa-heart-o");
    arg.attr("data-favorite", "false");
  });
};
window.getQueryVariable = function (variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
};
window.replaceUrlParam = function (url, paramName, paramValue) {
  var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)');
  if (url.search(pattern) >= 0) {
    return url.replace(pattern, '$1' + paramValue + '$2');
  }
  return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
};

var Navigation = React.createClass({
  displayName: "Navigation",

  getInitialState: function () {
    return {
      data: [],
      selected: ""
    };
  },
  componentWillMount: function () {
    var _this = this;
    var link = "/Files/WebServices/Navigation.ashx?catalog=" + _this.props.source;
    _this.serverRequest = $.getJSON(link, function (response) {
      var result = response[0].Nodes;
      // result =  result[0].Nodes;
      // var resultJSON = JSON.stringify(response);
      // console.log(nodes);
      _this.setState({
        data: result
      });
    }.bind(this));
  },
  componentWillUnmount: function () {
    var _this = this;
    _this.serverRequest.abort();
  },
  componentDidMount: function () {
    var _this = this;
    setTimeout(function () {
      // console.log(_this.state.data);
    }, 100);
  },
  openChild: function (e) {
    e.preventDefault();
    var target = e.target;
    if ($(target).attr("data-expanded") == "true") {
      $(target).attr("data-expanded", "false");
      $(target).children(".hasChildren").hide();
    } else {
      $(target).attr("data-expanded", "true");
      $(target).children(".hasChildren").show();
    }
  },
  // updateBookmark: function(){
  //   this.props.updateBookmark;
  // },  
  eachItem: function (item, i) {
    // var items = item;  
    if (item.Nodes.length != 0) {
      return React.createElement(
        "li",
        { key: i,
          index: i,
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
    // console.log(this.state.data);
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
      bookmark: ""
    };
  },
  componentDidMount: function () {
    this.setState({ data: this.props.data });
  },
  update: function (arg) {
    var target = $(arg.target);
    var id = target.attr("href");
    var encodedId = encodeURIComponent(id);
    var link = "/Default.aspx?ID=126&groupId=" + encodedId;
    $('.navigation').find('a').removeClass("true");
    $('.navigation').find('li').removeAttr('data-expanded');
    $(this).parents("li").attr("data-expanded", "true");
    $(this).addClass("true");
    $.ajax({
      url: link,
      type: 'get'
    }).done(function (data) {
      $('#pageContent').html(data);

      $('[data-select-downloadable] a').on("click", function (e) {
        e.preventDefault();
        var value = $(this).attr("data-option-value");
        var name = $(this).attr("data-option-name");
        $(this).parents(".btn-group").find("[data-selected-value]").attr("data-selected-value", value);
        $(this).parents(".btn-group").find("[data-selected-name]").html(name);
      });
      $('[data-tooltip]').tooltip();
      $('[data-favorite]').on("click", function (f) {
        f.preventDefault();
        var dataFavorite = $(this).attr("data-favorite");
        if (dataFavorite == "true") {
          removeFromFavorites($(this));
        } else {
          addToFavorites($(this));
        }
      });
      downloadPdf();
      $('.product-list-link').on("click", function (e) {
        e.preventDefault();
        var groupId = encodeURIComponent($(this).attr("data-group-id"));
        var productId = $(this).attr("href");
        var link = "/Default.aspx?ID=126&groupId=" + groupId + '&productId=' + productId;

        var n = noty({
          text: 'Loading content...',
          layout: 'center',
          theme: 'relax',
          animation: {
            open: { height: 'toggle' }, // jQuery animate function property object
            close: { height: 'toggle' }, // jQuery animate function property object
            easing: 'swing', // easing
            speed: 500 // opening & closing animation speed
          },
          type: 'information',
          timeout: false

        });
        $.ajax({
          url: link,
          type: 'get'
        }).done(function (newResult) {

          $('#pageContent').html(newResult);
          $.noty.closeAll();
          //EVENT LISTENERS
          $('[data-select-downloadable] a').on("click", function (e) {
            e.preventDefault();
            var value = $(this).attr("data-option-value");
            var name = $(this).attr("data-option-name");
            $(this).parents(".btn-group").find("[data-selected-value]").attr("data-selected-value", value);
            $(this).parents(".btn-group").find("[data-selected-name]").html(name);
          });
          $('[data-tooltip]').tooltip();
          $('[data-favorite]').on("click", function (f) {
            f.preventDefault();
            var dataFavorite = $(this).attr("data-favorite");
            if (dataFavorite == "true") {
              removeFromFavorites($(this));
            } else {
              addToFavorites($(this));
            }
          });
          downloadPdf();
          $('.product-list-link').on("click", function (e) {
            e.preventDefault();
            var groupId = encodeURIComponent($(this).attr("data-group-id"));
            var productId = $(this).attr("href");
            var link = "/Default.aspx?ID=126&groupId=" + groupId + '&productId=' + productId;
            // console.log(link);

            var n = noty({
              text: 'Loading content...',
              layout: 'center',
              theme: 'relax',
              animation: {
                open: { height: 'toggle' }, // jQuery animate function property object
                close: { height: 'toggle' }, // jQuery animate function property object
                easing: 'swing', // easing
                speed: 500 // opening & closing animation speed
              },
              type: 'information',
              timeout: false

            });
            $.ajax({
              url: link,
              type: 'get'
            }).done(function (newResult) {

              $('#pageContent').html(newResult);
              $.noty.closeAll();
            });
          });
          downloadPdf();
          //EVENT LISTENERS
        });
      });
    });
  },
  registerBookmark: function (arg) {
    var target = $(arg.target).parent("a");
    var bookmark = target[0].attributes["data-bookmark"].value;
    var groupName = target[0].attributes["data-group"].value;
    var id = target[0].attributes["href"].value;
    var index = target[0].attributes["data-index"].value;

    var that = this;
    if (bookmark == "true") {
      var requestUrl = "/Files/WebServices/Bookmarks.ashx?action=delete&group=" + encodeURIComponent(id);
      $.ajax({
        method: "GET",
        url: requestUrl,
        contentType: "application/json",
        cache: false
      }).done(function (msg) {
        for (var i = 0; i < that.state.data.length; i++) {
          var item = that.state.data[i];
          var itemId = item.Id;
          if (id == itemId) {
            item.Bookmarked = false;
            break;
          }
        }
        that.setState(that.state);
      }).fail(function (e) {});
    } else {
      $.ajax({
        method: "POST",
        url: "/Files/WebServices/Bookmarks.ashx",
        data: JSON.stringify({ Group: id, Name: groupName }),
        contentType: "application/json"
      }).done(function (msg) {
        for (var i = 0; i < that.state.data.length; i++) {
          var item = that.state.data[i];
          var itemId = item.Id;
          if (id == itemId) {
            item.Bookmarked = true;
            break;
          }
        }
        that.setState(that.state);
      }).fail(function (e) {});
    }
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
          { href: item.Id, onClick: this.update, index: i, "data-overflow": true, className: item.Selected, "data-toggle": "tooltip", "data-placement": "right", title: item.Name },
          item.Name
        ),
        React.createElement(
          "a",
          { href: item.Id, "data-index": i, "data-group": item.Name, "data-bookmark": item.Bookmarked, onClick: this.registerBookmark, ref: "link" },
          React.createElement("i", { className: "fa fa-bookmark-o" })
        )
      )
      // <NavigationLink key={i} index={i} expanded={item.Expanded} itemId={item.Id} name={item.Name} bookmark={item.Bookmarked} />
      ;
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

var NavigationLink = React.createClass({
  displayName: "NavigationLink",

  render: function () {
    return React.createElement(
      "li",
      { className: "noIcon", "data-expanded": this.props.expanded },
      React.createElement(
        "a",
        { href: this.props.href, "data-overflow": true, className: this.props.className, "data-toggle": "tooltip", "data-placement": "right", title: this.props.title },
        this.props.title
      ),
      React.createElement(
        "a",
        { href: item.Id, "data-index": i, "data-group": item.Name, "data-bookmark": item.Bookmarked, onClick: this.registerBookmark, ref: "link" },
        React.createElement("i", { className: "fa fa-bookmark-o" })
      )
    );
  }
});
var MainContent = React.createClass({
  displayName: "MainContent",

  getInitialState: function () {
    return {
      data: "",
      url: ""
    };
  },
  componentWillMount: function () {
    var _this = this;
    // var source = _this.props.source;
    var groupId = getQueryVariable("bookmark");
    var productId = getQueryVariable("favorite");
    contentSource = "";
    // console.log(groupId);
    // console.log(productId);
    if (productId) {
      contentSource = '/Default.aspx?ID=126&groupid=' + groupId + '&productId=' + productId;
    } else {
      if (groupId) {
        contentSource = '/Default.aspx?ID=126&groupid=' + groupId;
      }
    }
    this.state.url = contentSource;
    // console.log(this.state.url);
    this.setState({ url: this.state.url });
  },
  componentDidMount: function () {
    setTimeout(function () {
      var _this = this;
      // var source = _this.props.source;
      var groupId = getQueryVariable("bookmark");
      var productId = getQueryVariable("favorite");
      contentSource = "";
      // console.log(groupId);
      // console.log(productId);
      if (productId) {
        contentSource = '/Default.aspx?ID=126&groupid=' + groupId + '&productId=' + productId;
      } else {
        if (groupId) {
          contentSource = '/Default.aspx?ID=126&groupid=' + groupId;
        }
      }
    }, 0);
  },
  // _this.setState({data: this.props.source === "" ? this.state.data : this.props.source});
  // if(_this.props.source != "") {

  //     _this.serverRequest = $.get(source, function (result) {
  //       console.log("result:" + result[0]);
  //       _this.setState({data: "data"});         
  //     }.bind(_this));

  //     _this.setState({data: "data"});
  //      var serverRequest = $.ajax({
  //         url: source,
  //         type: 'GET'         
  //       })
  //       .done(function(result) {
  //           console.log(result);
  //           _this.setState({data: result});
  //       });

  // }

  // var param = getQueryVariable("bookmark");
  // if(param != false) {

  // var link = '/Default.aspx?ID=126&groupId=' + param;    
  // console.log(contentSource);
  // console.log(this.props.source);
  // var link = contentSource;
  // // console.log(this.state.url);
  // $.ajax({
  //   url: link,
  //   type: 'get'
  //   })
  //   .done(function(result) {
  //     // if (_this.isMounted()) {
  //       // _this.setState({data: this.state.url === "" ? this.state.data : this.state.url});
  //       _this.setState({data: result});

  //       // $('#pageContent').html(result);
  //       // (function(){   

  //         // $('[data-select-downloadable] a').on("click", function(e){
  //         //   e.preventDefault();
  //         //   var value= $(this).attr("data-option-value");
  //         //   var name= $(this).attr("data-option-name");             
  //         //   $(this).parents(".btn-group").find("[data-selected-value]").attr("data-selected-value", value);
  //         //   $(this).parents(".btn-group").find("[data-selected-name]").html(name);
  //         //    console.log("intra-buton3");
  //         // });
  //         // downloadPdf();
  //         // $('[data-tooltip]').tooltip();
  //         // $('[data-favorite]').on("click", function(f){
  //         //   f.preventDefault();
  //         //   var dataFavorite = $(this).attr("data-favorite");
  //         //   if(dataFavorite == "true") {
  //         //     removeFromFavorites($(this));
  //         //   } else {
  //         //     addToFavorites($(this));              
  //         //   }

  //         // }); 

  //         // $('.product-list-link').on("click", function(e){
  //         //   e.preventDefault();
  //         //   var groupId = encodeURIComponent($(this).attr("data-group-id"));
  //         //   var productId =$(this).attr("href");
  //         //   var link = "/Default.aspx?ID=126&groupId=" +  groupId + '&productId=' + productId;
  //         //   console.log(link);
  //         //   $.ajax({
  //         //     url: link,
  //         //     type: 'get'
  //         //   })
  //         //   .done(function(newResult) {
  //         //     console.log("loading");
  //         //     $('#pageContent').html(newResult);

  //         //   })
  //         //   .fail(function() {
  //         //     // console.log("error");
  //         //   })
  //         //   .always(function() {
  //         //     // console.log("complete");
  //         //   });          
  //         // });
  //     // })();
  // })
  // .fail(function() {
  //   // console.log("error");
  // })
  // .always(function() {
  //   // console.log("complete");
  // });
  // } else {     

  //         $('[data-select-downloadable] a').on("click", function(e){
  //           e.preventDefault();
  //           var value= $(this).attr("data-option-value");
  //           var name= $(this).attr("data-option-name");             
  //           $(this).parents(".btn-group").find("[data-selected-value]").attr("data-selected-value", value);
  //           $(this).parents(".btn-group").find("[data-selected-name]").html(name);
  //            console.log("intra-buton4");
  //         });
  //         $('[data-tooltip]').tooltip();
  //         $('[data-favorite]').on("click", function(f){
  //           f.preventDefault();
  //           var dataFavorite = $(this).attr("data-favorite");
  //           if(dataFavorite == "true") {
  //             removeFromFavorites($(this));
  //           } else {
  //             addToFavorites($(this));              
  //           }

  //         });
  //         downloadPdf();         
  //         $('.product-list-link').on("click", function(e){
  //           e.preventDefault();
  //           var groupId = encodeURIComponent($(this).attr("data-group-id"));
  //           var productId =$(this).attr("href");
  //           var link = "/Default.aspx?ID=126&groupId=" +  groupId + '&productId=' + productId;
  //           console.log(link);
  //           $.ajax({
  //             url: link,
  //             type: 'get'
  //           })
  //           .done(function(newResult) {
  //             console.log("loading");
  //             $('#pageContent').html(newResult);

  //           })
  //           .fail(function() {
  //             // console.log("error");
  //           })
  //           .always(function() {
  //             // console.log("complete");
  //           });          
  //         });         
  // }
  // $('[data-select-downloadable] a').on("click", function(e){
  //   e.preventDefault();
  //   alert("click");
  // });  

  // componentWillUnmount: function() {  

  //   this.serverRequest.abort();

  // },
  renderLoadedContent: function () {
    return React.createElement("div", { id: "pageContent", dangerouslySetInnerHTML: { __html: this.state.data } });
  },
  renderEmptyContent: function () {
    return React.createElement(
      "div",
      { id: "pageContent" },
      React.createElement("div", { className: "loading-image" })
    );
  },
  render: function () {
    // console.log(this.props.source);
    if (this.state.data == "") {
      return this.renderEmptyContent();
    } else {
      return this.renderLoadedContent();
    }
  }
});
var RenderPage = React.createClass({
  displayName: "RenderPage",

  getInitialState: function () {
    return {
      catalog: "",
      groupId: "",
      productId: "",
      contentSource: ""
    };
  },
  componentWillMount: function () {

    var catalog = getQueryVariable("catalog");
    var groupId = getQueryVariable("bookmark");
    var productId = getQueryVariable("favorite");
    contentSource = "";
    if (productId) {
      contentSource = '/Default.aspx?ID=126&groupid=' + groupId + '&productId=' + productId;
    } else {
      if (groupId) {
        contentSource = '/Default.aspx?ID=126&groupid=' + groupId;
      }
    }
    this.setState({ catalog: catalog, groupID: groupId, productId: productId, contentSource: contentSource });

    // if(param != false) {
    //   var link = '/Default.aspx?ID=126&groupId=' + param; 
  },
  componentDidMount: function () {
    // var _this = this;
    // setTimeout(function(){
    //   console.log(_this.state.catalog);    
    //   console.log(_this.state.groupId);
    //   console.log(_this.state.productId);
    //   console.log(_this.state.contentSource);
    // },10);

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
              this.state.catalog
            ),
            React.createElement(
              "a",
              { href: "/Default.aspx?ID=1", className: "btn btn-sm btn-warning pull-right" },
              "Select Catalog"
            )
          ),
          React.createElement(
            "section",
            { className: "catalogNavSection searchSection" },
            React.createElement(
              "form",
              { action: "/Default.aspx", id: "searchForm" },
              React.createElement("input", { type: "hidden", name: "ID", value: "127" }),
              React.createElement("input", { placeholder: "Serial #", id: "searchSubmit", "data-error": "Search for something", type: "text", name: "q", value: this.props.children }),
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
            React.createElement(Navigation, { source: this.state.catalog, onChange: this.update })
          )
        )
      ),
      React.createElement(
        "div",
        { className: "col-sm-9" },
        React.createElement(MainContent, null)
      )
    );
  }
});

if (document.getElementById('react-renderPage') !== null) {
  ReactDOM.render(React.createElement(RenderPage, null), document.getElementById('react-renderPage'));
}