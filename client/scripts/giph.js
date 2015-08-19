var Giph = React.createClass({
  addHandler: function () {
    this.props.addGiphToDatabase(this.props.giph);
  },

  render: function () {
    var giph = this.props.giph;
    var artwork_url = giph.images.original.url || '/assets/default.jpg' || giph.url; // artwork_url || '/assets/default.jpg';
    var divStyle = {
      background: 'url(' + artwork_url + ') center / cover',
      'max-height': 200,
      height: 200,
      color: 'white'
    };
    console.log(giph.username);
    console.log(giph.caption);

    return <div className="giph mdl-cell mdl-cell--2-col mdl-card mdl-shadow--2dp">
      <div style={divStyle} className="mdl-card__title mdl-card--expand" >
        <h6 className="userTitle mdl-card__title-text">{giph.username}</h6>
      </div>

      <div className="mdl-card__supporting-actions">
        <span >{giph.rating}</span>
      </div>

      <span onClick={this.addHandler} >Save!</span>
    </div>;
  }
});
