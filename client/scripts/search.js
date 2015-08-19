
var Search = React.createClass({

  changeHandler: function(){
    this.onSearch(event.target.value);
  },

  render: function () {
    return <input onChange={ this.changeHandler } type="text" placeholder="Search for a song" />;
  },

  componentDidMount: function () {
    this.onSearch = _.debounce(this.props.onSearch, 300);
  }

});

