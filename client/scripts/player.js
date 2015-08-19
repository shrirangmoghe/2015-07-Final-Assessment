var Player = React.createClass({
  getInitialState: function() {
    return {
      playing: false
    };
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return !this.state.playing;
  },

  componentDidUpdate: function () {
    var track = this.props.track;
    if(track === undefined){
      return;
    }
    var src = track.uri;
    var node = this.getDOMNode();
    node.src="https://w.soundcloud.com/player/?";

    var widget = SC.Widget(node);
    widget.load(src, {
      auto_play: true
    });

    var that = this;

    widget.bind(SC.Widget.Events.FINISH, function(){
      that.state.playing = false;
      that.props.onFinish();
    });

    widget.bind(SC.Widget.Events.PLAY, function(){
      that.state.playing = true;
      that.props.onFinish();
    });
  },

  render: function () {
    return <iframe ></iframe>
  }
});
