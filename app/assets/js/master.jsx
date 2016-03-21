var Navigation = React.createClass({
	getInitialState: function(){
		return {
			data: []
		}
	},
	componentDidMount: function() {
    $.getJSON(this.props.source, function(result) {     	
	      if (this.isMounted()) {
	        this.setState({
	          data: result[this.props.target]
	        });	        
	      }
	  }.bind(this))
  },  
  openChild: function(e){
    e.preventDefault();    
    var target= e.target;   
    $(target).parent(".dropdown").addClass("opened"); 
    $(target).parent(".dropdown").children(".hasChildren").first().slideToggle("fast");
  },
  eachItem: function(item, i) {       
      if (item.Nodes.length != 0) {        
        return (
          <li key={i}
                  index={i}
                  className={(i === this.props.active - 1) ? 'dropdown active' : 'dropdown'}
                 
              ><a href={item.Id} onClick={this.openChild} data-bookmark={item.Bookmark} >{item.Name}</a>
              <RenderChildren data={item.Nodes}/>
          </li>
        );
      } else {
         return (
              <li key={i}
                  index={i}
                  className={(i === this.props.active - 1) ? 'dropdown active' : 'dropdown'}
                 
              ><a href={item.Id} onClick={this.openChild} data-bookmark={item.Bookmark} >{item.Name}</a>

              </li>
          );

      }   	
     
  },
  render: function() {      
      return (
      		<ul>
      			{this.state.data.map(this.eachItem)}
          </ul>

      );

  }
});
var RenderChildren =  React.createClass({
  getInitialState: function(){
    return {
      data: []
    }
  },
  componentDidMount: function() {   
    this.setState({data: this.props.data });   
  },
  openChild: function(e){
    e.preventDefault();    
    var target= e.target;
    
    $(target).parent(".dropdown").children(".hasChildren").first().addClass("opened").slideToggle("fast");
    console.log($(target).parent(".dropdown").children(".hasChildren").first());

  },
  eachItem: function(item, i) {    
    if (item.Nodes.length != 0) {
        var nodes=item.Nodes;
        return (
          <li key={i}
                  index={i}
                  className={(i === this.props.active - 1) ? 'dropdown active' : 'dropdown'}                 
              ><a href={item.Id} onClick={this.openChild} data-bookmark={item.Bookmark} >{item.Name}</a>
              <RenderChildren data={item.Nodes}/>
          </li>
        );
      } else {
         return (
              <li key={i}
                  index={i}
                  className={(i === this.props.active - 1) ? 'dropdown active' : 'dropdown'}                 
              ><a href={item.Id} onClick={this.openChild} data-bookmark={item.Bookmark} >{item.Name}</a>
              </li>
          );

      }
   
  },
  render: function() {
      return (
          <ul className="hasChildren" >
            {this.state.data.map(this.eachItem)}
          </ul>

      );
  }
});





ReactDOM.render(<Navigation source="http://localhost:3000/resources/navigation.json" target="mainNav" />, document.getElementById('react-navigation'));