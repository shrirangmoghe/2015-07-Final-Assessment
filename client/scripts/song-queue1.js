var SongQueue = React.createClass({
  render: function () {
    var tracks = this.props.tracks.map(function(track){
      return <div>
        <p>{track.title}</p>
        <p>{track.user.username}</p>
      </div>
    });

    return <div>{tracks}</div>;
  }
});
