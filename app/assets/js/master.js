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
window.popupMessageAutoClose = function (arg) {
  $('#popup-messages').bPopup({
    autoClose: 2000,
    onOpen: function () {
      $('#popup-messages .content').html(arg);
    },
    onClose: function () {
      $('#popup-messages .content').empty();
    }
  });
};
window.popupMessageManualClose = function (arg) {
  $('#popup-messages').bPopup({
    onOpen: function () {
      $('#popup-messages .content').html(arg);
    },
    onClose: function () {
      $('#popup-messages .content').empty();
    }
  });
};
window.addToFavorites = function (arg) {
  var addToFavorites = arg.attr("data-add-favorites");
  $.ajax({
    url: addToFavorites,
    type: 'POST'
  }).done(function (response) {

    $('#popup-messages').bPopup({
      autoClose: 2000,
      onOpen: function () {
        $('#popup-messages .content').html(arg.attr("data-message-add"));
      },
      onClose: function () {
        $('#popup-messages .content').empty();
      }
    });
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
    $('#popup-messages').bPopup({
      autoClose: 2000,
      onOpen: function () {
        $('#popup-messages .content').html(arg.attr("data-message-remove"));
      },
      onClose: function () {
        $('#popup-messages .content').empty();
      }
    });
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
  getCompatibleList: function () {
    console.log("getCompatibleList");
    var productId = $('[data-productId]').attr('data-productId');
    var link = "/Default.aspx?ID=132&productid=" + productId + "#body";
    console.log("compatibleList:" + link);
    $.ajax({
      url: link,
      type: 'GET',
      dataType: 'html'
    }).done(function (data) {
      // var $response = $(data);
      // console.log($response)
      // var dataToAdd = $response.find('#body').html();
      // console.log(dataToAdd);
      $('#compatibleList').html(data);
    });
  },
  registerPageEvents: function () {
    console.log("registered");
    // $(document).ajaxComplete(function(){
    // fire when any Ajax requests complete 
    $('#pageContent').on("click", ".add-to-cart-button", function (f) {

      f.preventDefault();
      var message = $(this).attr("data-message");
      var productId = $(this).attr("data-product-id");
      var orderContext = $(this).attr("data-order-context");
      var quantity = "1";
      var unit = $(this).attr("data-unit");
      var catalog = $(this).attr("data-catalog");

      var linkAdd = "/Default.aspx?productid=" + productId + "&variantID&OrderContext=" + orderContext + "&cartcmd=add" + "&EcomOrderLineFieldInput_CatalogId=" + catalog + "&EcomOrderLineFieldInput_UnitOfMeasure=" + unit + "&Unit=" + unit + "&quantity=" + quantity;
      console.log(linkAdd);
      $.ajax({
        url: linkAdd,
        type: 'post'
      }).done(function (response) {

        popupMessageAutoClose(message);
        minicart();
        // alert(message);
      });
    });
    $('#pageContent').on("click", ".btn-print", function (e) {
      e.preventDefault();
      window.print();
    });
    $('#pageContent').on("click", '[data-popup="bPopup-link"]', function (e) {
      e.preventDefault();
      var href = $(this).attr("href");
      var output = '<img src="' + href + '" />';
      $('#popup-image .content').html(output);
      setTimeout(function () {
        $('#popup-image').bPopup({ positionStyle: 'fixed', closeClass: 'close-modal' });
      }, 400);
    });
    $('#pageContent').on("click", "#addToCartSubmit", function (f) {
      f.preventDefault();
      var message = $(this).attr("data-message");
      var productId = $(this).attr("data-product-id");
      var orderContext = $(this).attr("data-order-context");
      var quantity = $(".product-page-quantity").val();
      var unit = $(this).attr("data-unit");
      var catalog = $(this).attr("data-catalog");
      var linkAdd = "/Default.aspx?productid=" + productId + "&variantID&OrderContext=" + orderContext + "&cartcmd=add" + "&EcomOrderLineFieldInput_CatalogId=" + catalog + "&EcomOrderLineFieldInput_UnitOfMeasure=" + unit + "&Unit=" + unit + "&quantity=" + quantity;
      $.ajax({
        url: linkAdd,
        type: 'post'
      }).done(function (response) {
        popupMessageAutoClose(message);
        minicart();
      });
    });
    $('#pageContent').find(".thumbs-slider").slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      swipe: false,
      touchMove: false,
      arrows: true,
      nextArrow: "<i class='fa fa-chevron-right' aria-hidden='true'></i>",
      prevArrow: "<i class='fa fa-chevron-left' aria-hidden='true'></i>"
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
    $('#pageContent').on("click", '.view-pdf', function (d) {
      d.preventDefault();
      var value = $(this).parents(".form-group").find('[data-selected-link]').attr("data-selected-link");
      $(this).parents(".form-group").find("a").each(function () {
        var currentValue = $(this).attr("href");
        // console.log(value);
        if (currentValue == value) {
          window.open(value, '_blank');
        }
      });
    });
    $('#pageContent').on('change', '[data-page-size], [data-section]', function () {
      var pageSize = $('[data-page-size]').val();
      var url = $('[data-url]').attr("data-url");
      // var pageNumber = $('[data-current-page]').attr("data-current-page")
      var section = $('[data-section]').val();
      var newUrl = replaceUrlParam(url, "PageSize", pageSize);
      newUrl = replaceUrlParam(newUrl, "Section", section);
      // newUrl = replaceUrlParam(newUrl,"PageNum", pageNumber);
      // console.log(newUrl);
      $.ajax({
        url: newUrl,
        type: 'get'
      }).done(function (newResult) {
        $('#pageContent').html(newResult);
      });
    });
    $('#pageContent').on('click', '[data-pagination-number]', function (e) {
      e.preventDefault();
      var pageSize = $('[data-page-size]').val();
      var url = $('[data-url]').attr("data-url");
      var pageNumber = $(this).attr("data-pagination-number");
      var section = $('[data-section]').val();
      var newUrl = replaceUrlParam(url, "PageSize", pageSize);
      newUrl = replaceUrlParam(newUrl, "Section", section);
      newUrl = replaceUrlParam(newUrl, "PageNum", pageNumber);
      console.log(newUrl);
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
      var href = $(this).attr("href");
      $(this).parents(".btn-group").find("[data-selected-value]").attr("data-selected-value", value);
      $(this).parents(".btn-group").find("[data-selected-name]").html(name);
      $(this).parents(".btn-group").find("[data-selected-link]").attr("data-selected-link", href);
    });
    $('[data-tooltip]').tooltip();
    $('#pageContent').on("click", '[data-favorite]', function (f) {
      f.preventDefault();
      // console.log("click");
      var dataFavorite = $(this).attr("data-favorite");
      if (dataFavorite == "true") {
        removeFromFavorites($(this));
      } else {
        addToFavorites($(this));
      }
    });
    $('#pageContent').on('click', '.show-compatible-list', function () {
      var productId = $('[compatible-productId]').attr("compatible-productId");
      var url = "/Default.aspx?ID=132&productId=" + productId;
      var options = "";
      var exit = false;
      $("[compatible-list-option]").each(function () {
        if (!exit) {
          if ($(this).val() == "" || $(this).val() == null) {
            var message = $(this).attr("data-message");
            popupMessageManualClose(message);
            exit = true;
          }
        }

        var name = $(this).attr("name");
        var value = $(this).val();
        options += "&" + name + "=" + value;
      });
      if (!exit) {
        url = url + options;
        $.ajax({
          url: url,
          type: 'GET',
          dataType: 'html'
        }).done(function (data) {
          $('#compatibleList').html(data);
        });

        console.log(url);
      }
    });

    // console.log("click on product link event");
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
        // h.registerPageEvents();
        // $.noty.closeAll();  
        h.getCompatibleList();
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
      // $.each(result, function(key,val){

      //     var node = markSelected(val, _this.state.selected);

      //     if (node) {
      //       node.Expanded = true;
      //     }

      // });
      // _this.setState({data: _this.state.data});
      _this.setState({
        data: result
      });
    }.bind(this));
    _this.setState({
      selected: _this.props.bookmark
    });
  },
  componentDidMount: function () {
    var _this = this;
    console.log("mounted");
    // console.log(_this.state.data);
    // console.log(_this.state.selected);

    setTimeout(function () {
      console.log("entermarkbookmark");
      $.each(_this.state.data, function (key, val) {

        var node = markSelected(val, _this.state.selected);

        if (node) {
          node.Expanded = true;
        }
      });
      _this.setState({ data: _this.state.data });
    }, 500);

    // setTimeout(function(){
    //   // console.log(this.state.data);
    //   //   $.each(this.state.data, function(key,val){

    //   //     var node = markSelected(val, that.state.selected);

    //   //     if (node) {
    //   //       node.Expanded = true;
    //   //     }
    //       // do something with key and val
    //   // });
    //   console.log(this.state.selected);
    //   console.log(this.state.data);

    // }, 100);
    // setTimeout(function(){

    //  console.log(this.state.data);

    // },200);
  },
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
  // }, 
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
    console.log(this.state.data);
    // console.log(this.state.selected);
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
    // console.log(target);   
    if ($(target).parent().attr("data-expanded") == "true") {
      $(target).parents(".hasChildren").eq(0).find(".hasChildren").hide();
      $(target).parents(".hasChildren").eq(0).find("li").attr("data-expanded", "false");
      $(target).parent().find("li").attr("data-expanded", "false");
      $(target).parent().attr("data-expanded", "false");
      $(target).parent().children(".hasChildren").hide();
      $(target).removeClass("opened");
    } else {
      $(".componentWrapper").find(".opened").removeClass("opened");
      // $(".componentWrapper").find("[data-expanded]").attr("data-expanded","false");_
      $(target).parents(".hasChildren").eq(0).find(".hasChildren").hide();
      $(target).parents(".hasChildren").eq(0).find("li").attr("data-expanded", "false");
      $(target).parent().find("li").attr("data-expanded", "false");
      console.log($(target).parents(".hasChildren")[0]);
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
      console.log("loadedevents");
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

  registerBookmark: function (e) {
    e.preventDefault();
    var target = $(e.currentTarget);
    // console.log(e);
    // console.log(target);

    // var bookmark =  target[0].attributes["data-bookmark"].value;
    // var groupName = target[0].attributes["data-group"].value;
    // var id = target[0].attributes["href"].value;
    // var index = target[0].attributes["data-index"].value;

    var bookmark = target.attr("data-bookmark");
    var groupName = target.attr("data-group");
    var id = target.attr("href");
    var index = target.attr("data-index");

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
      });
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
          { href: item.Id, className: item.Selected, ref: 'target', onClick: this.openChild },
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
    // setTimeout(function(){
    //   h.getCompatibleList();
    // }, 500);

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
  componentDidUpdate: function () {
    h.getCompatibleList();
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
    var nameCatalog = this.state.catalog;
    console.log(nameCatalog);
    switch (nameCatalog) {
      case "Jayco":
        nameCatalog = "Jayco";
        break;
      case "JaycoMotorized":
        nameCatalog = "Jayco Motorized";
        break;
      case "Entegra":
        nameCatalog = "Entegra";
        break;
      case "Starcraft-RV":
        nameCatalog = "Starcraft";
        break;
      default:
        nameCatalog = "";
    }

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
              nameCatalog
            )
          ),
          React.createElement(
            'section',
            { className: 'catalogNavSection searchSection' },
            React.createElement(
              'form',
              { action: '/Default.aspx', id: 'searchForm' },
              React.createElement('input', { type: 'hidden', name: 'ID', value: '127' }),
              React.createElement('input', { placeholder: 'Search', id: 'searchSubmit', 'data-error': 'Search for something', type: 'text', name: 'q', value: this.props.children }),
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
            React.createElement(Navigation, { source: this.state.catalog, onUpdate: this.onUpdate, bookmark: this.state.groupId })
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'col-sm-9', id: 'mainContainerAjax' },
        React.createElement(
          'div',
          { className: 'row' },
          React.createElement(
            'div',
            { classname: 'col-sm-12' },
            React.createElement(
              'div',
              { className: 'heading-page-wrapper modifier' },
              React.createElement(
                'h1',
                { className: 'heading-page' },
                'Catalog'
              )
            )
          )
        ),
        React.createElement(MainContent, { source: this.state.contentSource })
      )
    );
  }
});

if (document.getElementById('react-renderPage') !== null) {
  ReactDOM.render(React.createElement(RenderPage, null), document.getElementById('react-renderPage'));
}