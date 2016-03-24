$(function(){

var Navigation = React.createClass({
	getInitialState: function(){
		return {
			data: [],
      selected: ""
		}
	},
	componentDidMount: function() {

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

    $.getJSON(this.props.source, function(result) {     	
	      if (this.isMounted()) {
	        this.setState({
	          data: result
	        });	        
          var param = decodeURIComponent(location.search.split('myParam=')[1]); 
          var that = this;
          this.setState({selected: param});  
          $.each(this.state.data, function(key,val){

              var node = markSelected(val, that.state.selected);

              if (node) {
                node.Expanded = true;
              }
              // do something with key and val
          });
        this.setState({data: this.state.data}); 
        
        
       

      }
	     
	  }.bind(this))
  },  
  openChild: function(e){
    e.preventDefault();    
    var target= e.target;     
    if ($(target).attr("data-expanded") == "true") {
      $(target).attr("data-expanded","false"); 
      $(target).children(".hasChildren").hide();
    } else { 
      $(target).attr("data-expanded","true"); 
      $(target).children(".hasChildren").show();
    }
  },  
  // updateBookmark: function(){
  //   this.props.updateBookmark;
  // },   
  eachItem: function(item, i) {       
    if (item.Nodes.length != 0) {        
      return (
        <li key={i}
                index={i}
                className={(i === this.props.active - 1) ? 'dropdown active' : 'dropdown'}
                onClick={this.openChild}
                data-expanded={item.Expanded}
            ><a href={item.Id} className={item.Selected}>{item.Name}</a>
             <ul className="hasChildren" data-expanded={item.Expanded}>
                 <NavigationTree data={item.Nodes} />
            </ul>
        </li>
      );
    } else {
       return (
            <li key={i}
                index={i}
                className={(i === this.props.active - 1) ? 'dropdown active' : 'dropdown'}
                onClick={this.openChild}
                data-expanded={item.Expanded}
            ><a href={item.Id}  className={item.Selected}>{item.Name}</a><a href="" data-bookmark={item.Bookmarked} onClick={this.registerBookmark}><i className="fa fa-bookmark-o"></i></a>

            </li>
        );

    }
  },  
  render: function() { 
      return (
      		<ul className="componentWrapper">
      			{this.state.data.map(this.eachItem)}
          </ul>

      );

  }
});
var NavigationTree =  React.createClass({
  getInitialState: function(){
    return {
      data: [],
      bookmark: ""
    }
  },
  update: function(arg){     
    var target = $(arg.target)
    var id = target.attr("href");
    var encodedId = encodeURIComponent(id); 
    var link = "/Default.aspx?ID=126&groupId=" +  encodedId
    $.ajax({
      url: link,
      type: 'get'
    })
    .done(function(data) {
      console.log(data);
      $('#pageContent').html(data);
    })
    .fail(function() {
      // console.log("error");
    })
    .always(function() {
      // console.log("complete");
    });
  }, 
  registerBookmark: function(arg){
    var target = $(arg.target).parent("a");
    var bookmark =  target[0].attributes["data-bookmark"].value;
    var groupName = target[0].attributes["data-group"].value;
    var id = target[0].attributes["href"].value;
    var index = target[0].attributes["data-index"].value;
    console.log(bookmark);
   
    var that = this;
    if(bookmark == "true") {    
      var requestUrl = "/Files/WebServices/Bookmarks.ashx?action=delete&group=" + encodeURIComponent(id);
      $.ajax({
        method: "GET",
        url: requestUrl,
        contentType: "application/json",
        cache: false
      })
      .done(function (msg) {
        for (var i = 0; i < that.state.data.length; i++) {
            var item = that.state.data[i];
            var itemId= item.Id;
            if (id == itemId) {
              item.Bookmarked = false;
              break;
            }
        }         
        that.setState(that.state);
      })
      .fail(function (e) {
      });
    } else {
      $.ajax({
        method: "POST",
        url: "/Files/WebServices/Bookmarks.ashx",
        data: JSON.stringify({ Group: id, Name: groupName}),
        contentType: "application/json"
      })
      .done(function (msg) {
         for (var i = 0; i < that.state.data.length; i++) {
            var item = that.state.data[i];
            var itemId= item.Id;
            if (id == itemId) {
              item.Bookmarked = true;
              break;
            }
         }         
         that.setState(that.state);
      })
      .fail(function (e) {
      });
    }
   
   
   
  },  
  componentDidMount: function() {   
    this.setState({data: this.props.data }); 
  },  
  
  eachItem: function(item, i) {    
    if (item.Nodes.length != 0) {
        var nodes=item.Nodes;
        return (
          <li key={i}
                  index={i}
                  className={(i === this.props.active - 1) ? 'dropdown active' : 'dropdown'} 
                  onClick={this.openChild}
                  data-expanded={item.Expanded}
              ><a href={item.Id} className={item.Selected}>{item.Name}</a>
               <ul className="hasChildren" data-expanded={item.Expanded}>
                <NavigationTree key={i} data={item.Nodes}  />
              </ul>
          </li>
        );
      } else {
         return (
              <li key={i}
                  index={i}
                  className="noIcon"  
                  onClick={this.openChild} 
                  data-expanded={item.Expanded}
              ><a href={item.Id}  onClick={this.update} index={i} data-overflow className={item.Selected} data-toggle="tooltip" data-placement="right" title={item.Name}>{item.Name}</a><a href={item.Id} data-index={i} data-group={item.Name} data-bookmark={item.Bookmarked} onClick={this.registerBookmark}><i className="fa fa-bookmark-o"></i></a>
              </li>
          );

      }
   
  },
  render: function() { 
      return (
        <div>  
          {this.state.data.map(this.eachItem)}
        </div>  

      );
  }
});
var RenderPage = React.createClass({
  getInitialState: function(){
    return {     
      pageId: "",
      catalog: ""
    }
  },
  componentDidMount: function(){

    var param = decodeURIComponent(location.search.split('catalog=')[1]);        
    var link = "/Files/WebServices/Navigation.ashx?catalog=" + param;
    this.setState({catalog: link });   

   
   
   
  },
  
  //  onChildChanged: function(newState) {
  //       this.setState({ checked: newState });
  // },
  render: function() { 
      return (
        <div className="wrapper">
        <div className="col-sm-3">
          <div id="catalogNavContainer">
            
            <section className="catalogNavSection topSection">
              <h1>JAYCO</h1><a className="btn btn-sm btn-warning pull-right">Select Catalog</a>
            </section>
            
            <section className="catalogNavSection searchSection">
              <form action="/Default.aspx" id="searchForm">
                <input type="hidden" name="ID" value="@resultsPage" />
                  <input placeholder='Serial #' id="searchSubmit" data-error='Search for something' type="text" name="q" value="" />
                  <button className="btn btn-sm btn-warning" type="submit">
                  <i className="fa fa-search"></i>
                </button>
              </form>    
            </section>
            
            <section className="catalogNavSection navSection navigation">
              <Navigation source='/Files/WebServices/Navigation.ashx?catalog=jayco' onChange={this.update} />
            </section>
              
          </div>
        </div>

          <div className="col-sm-9">
            <div id="pageContent">
              <p>Loading...</p>
            </div>
            
          </div>
        </div>  

      );
  }
});





  ReactDOM.render(<RenderPage  />, document.getElementById('react-renderPage'));
  // ReactDOM.render(<Navigation source="http://localhost:3000/resources/navigation.json"  />, document.getElementById('react-navigation'));
});
