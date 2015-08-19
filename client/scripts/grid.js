var Grid = React.createClass({
  render: function () {
    var that = this;

    //var rows = this.props.tracks;
    if ((this.props !== undefined) && (this.props.giphs.length !== 0)) {
	    var giphs = this.props.giphs.data.map(function(giph){
	      var addGiphToDatabase = that.props.addGiphToDatabase;

	      return <Giph addGiphToDatabase={addGiphToDatabase} giph={giph} />
	    });
	}
    return <div className="mdl-grid">{giphs}</div>
  }
});

