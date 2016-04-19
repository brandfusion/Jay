window.replaceUrlParam = function (url, paramName, paramValue) {
  var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)');
  if (url.search(pattern) >= 0) {
    return url.replace(pattern, '$1' + paramValue + '$2');
  }
  return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
};
// window.changePageSize = function(size) {   
//     var url= window.location.href;
//     var paramExists = getQueryVariable("PageSize");
//     var newUrl = replaceUrlParam(url, "PageSize", size);
// }
window.downloadPdf = function () {
  $('#pageContent').on("click", '.download-pdf', function (f) {
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
window.updateContent = function (link) {
  var newUrl = link;
};
var loadedContent = "";
var h = {
  loadedMainContent: function (newLink) {
    loadedContent = newLink;
    return loadedContent;
  },
  registerPageEvents: function () {
    console.log("registered");
    // $(document).ajaxComplete(function(){
    // fire when any Ajax requests complete
    $('#pageContent').find(".thumbs-slider").slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      swipe: false,
      touchMove: false
    });
    $('#pageContent').on("click", ".thumbs-slider img", function () {
      var value = $(this).attr("data-big-src");
      $("#pageContent .zoom-image").attr("src", value);
      $("#pageContent .zoomImg").attr("src", value);
    });
    $('#pageContent').find(".zoom-image").wrap('<span style="display:inline-block"></span>').css('display', 'block').parent().zoom();
    $('#pageContent').on("click", '.download-pdf', function (f) {
      f.preventDefault();
      var value = $(this).parents(".form-group").find('[data-selected-value]').attr("data-selected-value");
      $(this).parents(".form-group").find("a").each(function () {
        var currentValue = $(this).attr("data-option-value");
        if (currentValue == value) {
          $('#pdfDownloadFrame').attr("src", value);
        }
      });
    });
    $('#pageContent').on('change', '[data-page-size]', function () {
      var value = $(this).val();
      var url = $(this).attr("data-url");
      // var paramExists = getQueryVariable("PageSize");
      var newUrl = replaceUrlParam(url, "PageSize", value);
      // console.log(newUrl);
      $.ajax({
        url: newUrl,
        type: 'get'
      }).done(function (newResult) {
        $('#pageContent').html(newResult);
      });
    });
    $('#pageContent').on("click", '[data-select-downloadable] a', function (e) {
      e.preventDefault();
      var value = $(this).attr("data-option-value");
      var name = $(this).attr("data-option-name");
      $(this).parents(".btn-group").find("[data-selected-value]").attr("data-selected-value", value);
      $(this).parents(".btn-group").find("[data-selected-name]").html(name);
    });
    $('[data-tooltip]').tooltip();
    $('#pageContent').on("click", '[data-favorite]', function (f) {
      f.preventDefault();
      console.log("click");
      var dataFavorite = $(this).attr("data-favorite");
      if (dataFavorite == "true") {
        removeFromFavorites($(this));
      } else {
        addToFavorites($(this));
      }
    });
    console.log("click on product link event");
    $('#pageContent').on("click", '.product-list-link', function (e) {
      e.preventDefault();
      var groupId = encodeURIComponent($(this).attr("data-group-id"));
      var productId = $(this).attr("href");
      var link = "/Default.aspx?ID=126&groupId=" + groupId + '&productId=' + productId;
      // var n = noty({
      //     text: 'Loading content...',
      //     layout: 'center',
      //     theme: 'relax',
      //     animation: {
      //         open: {height: 'toggle'}, // jQuery animate function property object
      //         close: {height: 'toggle'}, // jQuery animate function property object
      //         easing: 'swing', // easing
      //         speed: 500 // opening & closing animation speed
      //     },
      //     type: 'information',
      //     timeout: false,

      // });
      $.ajax({
        url: link,
        type: 'get'
      }).done(function (newResult) {
        $('#pageContent').html(newResult);
        h.registerPageEvents();
        // $.noty.closeAll(); 
      });
    });

    // });   
  }
};

var Navigation = React.createClass({
  displayName: 'Navigation',

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
  // componentDidMount: function() {
  //   console.log("mounted");
  //   setTimeout(function(){
  //       $.each(this.state.data, function(key,val){

  //         var node = markSelected(val, that.state.selected);

  //         if (node) {
  //           node.Expanded = true;
  //         }
  //         // do something with key and val
  //     });

  //   }, 100);
  //    setTimeout(function(){

  //     this.setState({data: this.state.data});

  //    },200);

  // },
  componentWillUnmount: function () {
    var _this = this;
    _this.serverRequest.abort();
    // }, 
    // componentDidMount: function() {
    //    var _this = this;
    //    setTimeout(function(){ 
    //     console.log("mounted");
    //   },100);   
    // // },
    // componentDidUpdate: function() {
    //   console.log("updated");
  },
  openChild: function (e) {
    e.preventDefault();
    var target = e.target;
    if ($(target).parent().attr("data-expanded") == "true") {
      $(target).parent().attr("data-expanded", "false");
      $(target).parent().children(".hasChildren").hide();
      $(target).removeClass("opened");
    } else {
      $(target).parent().attr("data-expanded", "true");
      $(target).parent().children(".hasChildren").show();
      $(target).addClass("opened");
    }
  },
  // updateBookmark: function(){
  //   this.props.updateBookmark;
  // },
  // onUpdate: function(){
  //   // this.props.onUpdate(link);
  //   console.log("updated");
  // }, 
  eachItem: function (item, i) {
    // var items = item;  
    if (item.Nodes.length != 0) {
      var that = this;
      return React.createElement(
        'li',
        { key: i,
          index: i,
          'data-expanded': item.Expanded
        },
        React.createElement(
          'a',
          { href: item.Id, className: item.Selected, onClick: this.openChild },
          item.Name
        ),
        React.createElement(
          'ul',
          { className: 'hasChildren', 'data-expanded': item.Expanded },
          React.createElement(NavigationTree, { data: item.Nodes })
        )
      );
    } else {
      return React.createElement(
        'li',
        { key: i,
          index: i,
          'data-expanded': item.Expanded
        },
        React.createElement(
          'a',
          { href: item.Id, className: item.Selected },
          item.Name
        ),
        React.createElement(
          'a',
          { href: '', 'data-bookmark': item.Bookmarked, onClick: this.registerBookmark },
          React.createElement('i', { className: 'fa fa-bookmark-o' })
        )
      );
    }
  },
  render: function () {
    // console.log(this.state.data);
    return React.createElement(
      'ul',
      { className: 'componentWrapper' },
      this.state.data.map(this.eachItem)
    );
  }
});
var NavigationTree = React.createClass({
  displayName: 'NavigationTree',

  getInitialState: function () {
    return {
      data: [],
      bookmark: "",
      updated: false
    };
  },
  componentDidMount: function () {
    this.setState({ data: this.props.data });
  },
  openChild: function (e) {
    e.preventDefault();
    var target = e.target;
    if ($(target).parent().attr("data-expanded") == "true") {
      $(target).parent().attr("data-expanded", "false");
      $(target).parent().children(".hasChildren").hide();
      $(target).removeClass("opened");
    } else {
      $(target).addClass("opened");
      // $(target).parents(".hasChildren").find(".branch-opened").removeClass('collapsed').removeClass('branch-opened');
      // console.log($(target).parents(".hasChildren").find("li.branch-opened"));
      $(target).parent().attr("data-expanded", "true");
      // $(target).parents(".hasChildren").find("li .hasChildren").hide();
      // $(target).parents(".hasChildren").find('li').not(".branch-opened").addClass("collapsed");     
      $(target).parent().children(".hasChildren").show();
    }
  },
  // onUpdate: function(){
  //   that.props.onUpdate();
  // },
  update: function (e) {
    e.preventDefault();
    var id = $(e.currentTarget)[0].attributes.href.value;
    var encodedId = encodeURIComponent(id);
    var link = "/Default.aspx?ID=126&groupId=" + encodedId;
    $('.navigation').find('a').removeClass("selected");
    $('.navigation').find('li').removeAttr('data-expanded');
    $(e.currentTarget).parents("li").attr("data-expanded", "true");
    $(e.currentTarget).addClass("selected");
    $.ajax({
      url: link,
      type: 'GET',
      dataType: 'html'
    }).done(function (response) {
      console.log("loading");
      $('#pageContent').html(response);
      h.registerPageEvents();
    });
  },

  // $.ajax({
  //   url: link,
  //   type: 'get'
  // })
  // .done(function(data) {   
  //   $('#pageContent').html(data);
  //   // $('[data-page-size]').on("change", function(){
  //   //   var value = $(this).val();
  //   //   var url= $(this).attr("data-url");
  //   //   // var paramExists = getQueryVariable("PageSize");
  //   //   var newUrl = replaceUrlParam(url, "PageSize", value);
  //   //   // console.log(newUrl);
  //   //   $.ajax({
  //   //     url: newUrl,
  //   //     type: 'get'
  //   //   })
  //   //   .done(function(newResult) {        
  //   //     $('#pageContent').html(newResult);

  //   //   });
  //   // });
  //   $('#pageContent').on("click", '.download-pdf', function(f){
  //     f.preventDefault();
  //     var value = $(this).parents(".form-group").find('[data-selected-value]').attr("data-selected-value");  
  //      $(this).parents(".form-group").find("a").each(function(){   
  //      var currentValue = $(this).attr("data-option-value");  
  //      if (currentValue == value) {
  //         $('#pdfDownloadFrame').attr("src", value);      
  //      }
  //    });
  //   });
  //   $('#pageContent').on('change','[data-page-size]', function(){
  //     var value = $(this).val();
  //     var url= $(this).attr("data-url");
  //     // var paramExists = getQueryVariable("PageSize");
  //     var newUrl = replaceUrlParam(url, "PageSize", value);
  //     // console.log(newUrl);
  //     $.ajax({
  //       url: newUrl,
  //       type: 'get'
  //     })
  //     .done(function(newResult) {        
  //       $('#pageContent').html(newResult);

  //     });
  //   });
  //   $('#pageContent').on("click", '[data-select-downloadable] a', function(e){
  //     e.preventDefault();
  //     var value= $(this).attr("data-option-value");
  //     var name= $(this).attr("data-option-name");             
  //     $(this).parents(".btn-group").find("[data-selected-value]").attr("data-selected-value", value);
  //     $(this).parents(".btn-group").find("[data-selected-name]").html(name);
  //   });
  //   $('[data-tooltip]').tooltip();
  //   $('#pageContent').on("click", '[data-favorite]', function(f){
  //     f.preventDefault();
  //     var dataFavorite = $(this).attr("data-favorite");
  //     if(dataFavorite == "true") {
  //       removeFromFavorites($(this));
  //     } else {
  //       addToFavorites($(this));              
  //     }

  //   }); 
  //   $(document).ajaxComplete(function(){
  //       // fire when any Ajax requests complete
  //       $(".zoom-image")
  //         .wrap('<span style="display:inline-block"></span>')
  //         .css('display', 'block')
  //         .parent()
  //         .zoom();
  //   })    

  //   downloadPdf(); 
  //         $('#pageContent').on("click", '.product-list-link', function(e){
  //           e.preventDefault();
  //           var groupId = encodeURIComponent($(this).attr("data-group-id"));
  //           var productId =$(this).attr("href");
  //           var link = "/Default.aspx?ID=126&groupId=" +  groupId + '&productId=' + productId;

  //           var n = noty({
  //               text: 'Loading content...',
  //               layout: 'center',
  //               theme: 'relax',
  //               animation: {
  //                   open: {height: 'toggle'}, // jQuery animate function property object
  //                   close: {height: 'toggle'}, // jQuery animate function property object
  //                   easing: 'swing', // easing
  //                   speed: 500 // opening & closing animation speed
  //               },
  //               type: 'information',
  //               timeout: false,

  //           });
  //           $.ajax({
  //             url: link,
  //             type: 'get'
  //           })
  //           .done(function(newResult) {

  //             $('#pageContent').html(newResult);
  //             $.noty.closeAll();
  //             //EVENT LISTENERS
  //             // $('[data-page-size]').on("change", function(){
  //             //   var value = $(this).val();
  //             //   var url= $(this).attr("data-url");
  //             //   // var paramExists = getQueryVariable("PageSize");
  //             //   var newUrl = replaceUrlParam(url, "PageSize", value);
  //             //   console.log(newUrl);
  //             // });
  //             $('[data-select-downloadable] a').on("click", function(e){
  //                 e.preventDefault();
  //                 var value= $(this).attr("data-option-value");
  //                 var name= $(this).attr("data-option-name");             
  //                 $(this).parents(".btn-group").find("[data-selected-value]").attr("data-selected-value", value);
  //                 $(this).parents(".btn-group").find("[data-selected-name]").html(name);

  //               });
  //               $('[data-tooltip]').tooltip();
  //               $('[data-favorite]').on("click", function(f){
  //                 f.preventDefault();
  //                 var dataFavorite = $(this).attr("data-favorite");
  //                 if(dataFavorite == "true") {
  //                   removeFromFavorites($(this));
  //                 } else {
  //                   addToFavorites($(this));              
  //                 }

  //               });    
  //               downloadPdf();    
  //               $('.product-list-link').on("click", function(e){
  //                 e.preventDefault();
  //                 var groupId = encodeURIComponent($(this).attr("data-group-id"));
  //                 var productId =$(this).attr("href");
  //                 var link = "/Default.aspx?ID=126&groupId=" +  groupId + '&productId=' + productId;
  //                 // console.log(link);

  //                 var n = noty({
  //                     text: 'Loading content...',
  //                     layout: 'center',
  //                     theme: 'relax',
  //                     animation: {
  //                         open: {height: 'toggle'}, // jQuery animate function property object
  //                         close: {height: 'toggle'}, // jQuery animate function property object
  //                         easing: 'swing', // easing
  //                         speed: 500 // opening & closing animation speed
  //                     },
  //                     type: 'information',
  //                     timeout: false,

  //                 });
  //                 $.ajax({
  //                   url: link,
  //                   type: 'get'
  //                 })
  //                 .done(function(newResult) {

  //                   $('#pageContent').html(newResult);
  //                   $.noty.closeAll();

  //                 });        
  //               });               
  //               downloadPdf();
  //             //EVENT LISTENERS
  //           });          
  //         });
  // });

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
        'li',
        { key: i,
          index: i,
          className: i === this.props.active - 1 ? 'dropdown active' : 'dropdown',
          'data-expanded': item.Expanded
        },
        React.createElement(
          'a',
          { href: item.Id, className: item.Selected, onClick: this.openChild },
          item.Name
        ),
        React.createElement(
          'ul',
          { className: 'hasChildren', 'data-expanded': item.Expanded },
          React.createElement(NavigationTree, { key: i, data: item.Nodes })
        )
      );
    } else {
      return React.createElement(
        'li',
        { key: i,
          index: i,
          className: 'noIcon',
          'data-expanded': item.Expanded
        },
        React.createElement(
          'a',
          { href: item.Id, onClick: this.update, index: i, 'data-overflow': true, className: item.Selected, 'data-toggle': 'tooltip', 'data-placement': 'right', title: item.Name },
          item.Name
        ),
        React.createElement(
          'a',
          { href: item.Id, 'data-index': i, 'data-group': item.Name, 'data-bookmark': item.Bookmarked, onClick: this.registerBookmark, ref: 'link' },
          React.createElement('i', { className: 'fa fa-bookmark-o' })
        )
      )
      // <NavigationLink key={i} index={i} expanded={item.Expanded} itemId={item.Id} name={item.Name} bookmark={item.Bookmarked} />
      ;
    }
  },
  render: function () {
    return React.createElement(
      'div',
      null,
      this.state.data.map(this.eachItem)
    );
  }
});

var MainContent = React.createClass({
  displayName: 'MainContent',

  getInitialState: function () {
    return {
      data: "",
      url: ""
    };
  },
  componentWillMount: function () {
    // var _this = this;
    // var source = _this.props.source;
    // var groupId = getQueryVariable("bookmark");
    // var productId = getQueryVariable("favorite");
    // contentSource = "";
    // console.log(groupId);
    // console.log(productId);
    // if(productId) {
    //   contentSource = '/Default.aspx?ID=126&groupid=' + groupId + '&productId=' + productId;
    // } else {
    //   if(groupId) {
    //     contentSource = '/Default.aspx?ID=126&groupid=' + groupId
    //   }
    // }
    // this.state.url = contentSource;
    // console.log(this.state.url);
    var _this = this;
    var url = this.props.source;
    _this.setState({ url: url });
    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'html'
    }).done(function (response) {
      var data = response;
      _this.setState({ data: data });
      h.registerPageEvents();
    });
  },
  componentDidMount: function () {
    // console.log("enter");
    // setTimeout(function(){
    //   h.registerPageEvents();
    // }, 0);

    // setTimeout(function(){
    // var _this = this;  
    // // var source = _this.props.source;
    // var groupId = getQueryVariable("bookmark");
    // var productId = getQueryVariable("favorite");
    // contentSource = "";
    // // console.log(groupId);
    // // console.log(productId);
    // if(productId) {
    //   contentSource = '/Default.aspx?ID=126&groupid=' + groupId + '&productId=' + productId;
    // } else {
    //   if(groupId) {
    //     contentSource = '/Default.aspx?ID=126&groupid=' + groupId
    //   }
    // }
    // },0); 
  },
  componentdidUpdated: function () {
    // console.log("updated");
    // setTimeout(function(){
    //   h.registerPageEvents();
    // }, 250);
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
    return React.createElement('div', { id: 'pageContent', dangerouslySetInnerHTML: { __html: this.state.data } });
  },
  renderEmptyContent: function () {
    return React.createElement(
      'div',
      { id: 'pageContent' },
      React.createElement('div', { className: 'loading-image' })
    );
  },
  render: function () {
    // console.log(this.props.source);
    if (this.props.source == "") {
      return this.renderEmptyContent();
    } else {
      return this.renderLoadedContent();
    }
  }
});
var RenderPage = React.createClass({
  displayName: 'RenderPage',

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
    this.setState({ catalog: catalog, groupId: groupId, productId: productId, contentSource: contentSource });

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
  onUpdate: function (link) {
    var newUrl = link;
    this.setState({ contentSource: newUrl });
  },
  //  onChildChanged: function(newState) {
  //       this.setState({ checked: newState });
  // },
  render: function () {
    return React.createElement(
      'div',
      { className: 'wrapper' },
      React.createElement(
        'div',
        { className: 'col-sm-3' },
        React.createElement(
          'div',
          { id: 'catalogNavContainer' },
          React.createElement(
            'section',
            { className: 'catalogNavSection topSection' },
            React.createElement(
              'h1',
              null,
              this.state.catalog
            ),
            React.createElement(
              'a',
              { href: '/Default.aspx?ID=1', className: 'btn btn-sm btn-warning pull-right' },
              'Select Catalog'
            )
          ),
          React.createElement(
            'section',
            { className: 'catalogNavSection searchSection' },
            React.createElement(
              'form',
              { action: '/Default.aspx', id: 'searchForm' },
              React.createElement('input', { type: 'hidden', name: 'ID', value: '127' }),
              React.createElement('input', { placeholder: 'Serial #', id: 'searchSubmit', 'data-error': 'Search for something', type: 'text', name: 'q', value: this.props.children }),
              React.createElement(
                'button',
                { className: 'btn btn-sm btn-warning', type: 'submit' },
                React.createElement('i', { className: 'fa fa-search' })
              )
            )
          ),
          React.createElement(
            'section',
            { className: 'catalogNavSection navSection navigation' },
            React.createElement(Navigation, { source: this.state.catalog, onUpdate: this.onUpdate })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9' },
        React.createElement(MainContent, { source: this.state.contentSource })
      )
    );
  }
});

if (document.getElementById('react-renderPage') !== null) {
  ReactDOM.render(React.createElement(RenderPage, null), document.getElementById('react-renderPage'));
}