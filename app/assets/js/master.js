
// var childGroups = ...
// var groupResult = findGroup("gr32");

// if (groupResult) {
// groupResult.Nodes = childGroups;
// }

window.replaceUrlParam = function (url, paramName, paramValue) {
  var pattern = new RegExp('\\b(' + paramName + '=).*?(&|$)');
  if (url.search(pattern) >= 0) {
    return url.replace(pattern, '$1' + paramValue + '$2');
  }
  return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
};
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

    var productId = $('[data-productId]').attr('data-productId');
    var link = "/Default.aspx?ID=132&productid=" + productId + "#body";

    $.ajax({
      url: link,
      type: 'GET',
      dataType: 'html'
    }).done(function (data) {
      $('#compatibleList').html(data);
    });
  },
  registerPageEvents: function () {

    $('#pageContent').on("click", ".add-to-cart-button", function (f) {
      f.preventDefault();
      var message = $(this).attr("data-message");
      var productId = $(this).attr("data-product-id");
      var orderContext = $(this).attr("data-order-context");
      var quantity = "1";
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
        if (currentValue == value) {
          window.open(value, '_blank');
        }
      });
    });
    $('#pageContent').on('change', '[data-page-size], [data-section]', function () {
      var pageSize = $('[data-page-size]').val();
      var url = $('[data-url]').attr("data-url");
      var section = $('[data-section]').val();
      var newUrl = replaceUrlParam(url, "PageSize", pageSize);
      newUrl = replaceUrlParam(newUrl, "Section", section);
      $.ajax({
        url: newUrl,
        type: 'get'
      }).done(function (newResult) {
        $('#pageContent').html(newResult);
      });
    });
    $('#pageContent').on('click', '[data-sort-by]', function () {
      var sortBy = $(this).attr("data-sort-by");
      var sortOrder = $(this).attr("data-sort-order");

      var pageSize = $('[data-page-size]').val();
      var url = $('[data-url]').attr("data-url");
      var section = $('[data-section]').val();
      var newUrl = replaceUrlParam(url, "PageSize", pageSize);
      newUrl = replaceUrlParam(newUrl, "Section", section);
      newUrl = replaceUrlParam(newUrl, "sortBy", sortBy);
      newUrl = replaceUrlParam(newUrl, "SortOrder", sortOrder);

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
      }
    });

    $('#pageContent').on("click", '.product-list-link', function (e) {
      e.preventDefault();
      var groupId = encodeURIComponent($(this).attr("data-group-id"));
      var productId = $(this).attr("href");
      var link = "/Default.aspx?ID=126&groupId=" + groupId + '&productId=' + productId;

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
  },

  // findGroup: function(groupId) {
  //   return _findGroupNode(data, groupId);
  // },
  _findGroupNode: function (nodes, groupId) {
    if (nodes && nodes.length) {
      for (var i = 0; i < nodes.length; ++i) {
        var node = nodes[i];

        if ((node.Id || "").toLowerCase() == (groupId || "").toLowerCase()) {
          return node;
        }

        if (node.Nodes && node.Nodes.length) {
          var resultNode = h._findGroupNode(node.Nodes, groupId);

          if (resultNode) {
            return resultNode;
          }
        }
      }
    }

    return null;
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
    var link = "";
    var bookmark = _this.props.bookmark === "" ? "" : _this.props.bookmark;
    if (bookmark.length > 0) {
      link = "/Files/WebServices/LazyNavigation.ashx?bookmark=" + _this.props.bookmark + "&action=bookmarkTree";
    } else {
      link = "/Files/WebServices/LazyNavigation.ashx?group=" + _this.props.source;
    }

    _this.serverRequest = $.getJSON(link, function (response) {
      var result = response.Nodes;
      _this.setState({ data: result });
    });

    _this.setState({ selected: _this.props.bookmark });
  },
  componentWillUnmount: function () {
    var _this = this;
    _this.serverRequest.abort();
  },
  openChild: function (e) {
    e.preventDefault();
    var $target = $(e.target);
    var data = this.state.data;
    var id = $target.attr("href");
    var link = "http://floydpepper.dw-demo.com/Files/WebServices/LazyNavigation.ashx?group=" + id;
    var hasChildren = $($target.parent().children()[1]).children().length;
    var data = this.state.data;
    var _this = this;
    if (hasChildren > 0) {
      // show ul
    } else {
        $.getJSON(link, function (response) {
          if (response) {

            var groupResult = h._findGroupNode(data, id);

            if (groupResult) {
              groupResult.Nodes = response.Nodes;
            }
            _this.setState({ data: data });

            // var result = response.Nodes;
            // _this.setState({data: result});
          }
        });
      }
    if ($target.parent("li").hasClass("closed")) {
      $target.parent("li").siblings().addClass("closed");
      $target.parent("li").removeClass("closed");
    } else {
      $target.parent("li").addClass("closed");
      $target.parent("li").siblings().addClass("closed");
    }
  },
  eachItem: function (item, i) {
    var hasBookmark = "";
    if (getQueryVariable("bookmark") === false) {
      hasBookmark = "closed";
    }
    if (item.HasNodes === true) {
      // var that = this;     
      if (item.Nodes === null) {
        return React.createElement(
          'li',
          { key: i,
            index: i,
            className: 'closed'
          },
          React.createElement(
            'a',
            { href: item.Id, onClick: this.openChild },
            item.Name
          ),
          React.createElement('ul', { className: 'hasChildren', 'data-expanded': item.Expanded })
        );
      } else {
        return React.createElement(
          'li',
          { key: i,
            index: i,
            className: hasBookmark
          },
          React.createElement(
            'a',
            { href: item.Id, onClick: this.openChild },
            item.Name
          ),
          React.createElement(
            'ul',
            { className: 'hasChildren' },
            React.createElement(NavigationTree, { data: item.Nodes })
          )
        );
      }
    } else {
      return React.createElement(
        'li',
        { key: i,
          index: i
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
  componentWillMount: function () {
    this.setState({ data: this.props.data });
  },
  openChild: function (e) {
    e.preventDefault();
    var $target = $(e.target);
    var data = this.state.data;
    var id = $target.attr("href");
    var link = "http://floydpepper.dw-demo.com/Files/WebServices/LazyNavigation.ashx?group=" + id;
    var hasChildren = $($target.parent().children()[1]).children().length;

    var data = this.state.data;
    var _this = this;
    if (hasChildren > 0) {
      // show ul
    } else {
        $.getJSON(link, function (response) {
          if (response) {

            var groupResult = h._findGroupNode(data, id);

            if (groupResult) {
              groupResult.Nodes = response.Nodes;
            }
            _this.setState({ data: data });

            // var result = response.Nodes;
            // _this.setState({data: result});
          }
        });
      }

    if ($target.parent("li").hasClass("closed")) {
      $target.parent("li").siblings().addClass("closed");
      $target.parent("li").removeClass("closed");
    } else {
      $target.parent("li").addClass("closed");
      $target.parent("li").siblings().addClass("closed");
    }

    var getGroupImageLink = "/Default.aspx?ID=146&assemblyID=" + id;
    $.ajax({
      url: getGroupImageLink,
      type: 'GET',
      dataType: 'html'
    }).done(function (response) {

      $('#pageContent').html(response);
    }).fail(function () {
      console.log("error");
    });
  },
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

      $('#pageContent').html(response);

      $('#pageContent').find(".zoom-image").wrap('<span style="display:inline-block"></span>').css('display', 'block').parent().zoom();
    });
  },
  registerBookmark: function (e) {
    e.preventDefault();
    var target = $(e.currentTarget);

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
    var hasBookmark = "";
    var dataExpand = "";
    if (getQueryVariable("bookmark") === false) {
      hasBookmark = "closed";
    }
    if (getQueryVariable("bookmark") === item.Id) {
      dataExpand = "selected";
    }
    if (item.HasNodes === true) {
      if (item.Nodes === null) {
        return React.createElement(
          'li',
          { key: i,
            index: i,
            className: 'closed'
          },
          React.createElement(
            'a',
            { href: item.Id, className: item.Selected, ref: 'target', onClick: this.openChild },
            item.Name
          ),
          React.createElement('ul', { className: 'hasChildren', 'data-expanded': item.Expanded })
        );
      } else {
        return React.createElement(
          'li',
          { key: i,
            index: i,
            className: hasBookmark
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
      }
    } else {
      return React.createElement(
        'li',
        { key: i,
          index: i,
          className: 'noIcon'
        },
        React.createElement(
          'a',
          { href: item.Id, onClick: this.update, index: i, 'data-overflow': true, className: dataExpand, 'data-toggle': 'tooltip', 'data-placement': 'right', title: item.Name },
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
  componentDidUpdate: function () {
    h.getCompatibleList();
  },
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
    var groupId = getQueryVariable("bookmark") == false ? "" : getQueryVariable("bookmark");
    var productId = getQueryVariable("favorite") == false ? "" : getQueryVariable("favorite");
    contentSource = "";
    if (productId) {
      contentSource = '/Default.aspx?ID=126&groupid=' + groupId + '&productId=' + productId;
    } else {
      if (groupId) {
        contentSource = '/Default.aspx?ID=126&groupid=' + groupId;
      }
    }
    this.setState({ catalog: catalog, groupId: groupId, productId: productId, contentSource: contentSource });
  },
  onUpdate: function (link) {
    var newUrl = link;
    this.setState({ contentSource: newUrl });
  },
  render: function () {
    var nameCatalog = this.state.catalog;

    switch (nameCatalog) {
      case "Jayco":
        nameCatalog = "Jayco Towables";
        break;
      case "JAYCOMOTORIZED":
        nameCatalog = "Jayco Motorhome";
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
              React.createElement('input', { type: 'hidden', name: 'ID', value: '142' }),
              React.createElement('input', { type: 'hidden', name: 'catalog', value: this.state.catalog }),
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