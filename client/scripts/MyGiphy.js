
var MyGiphy = React.createClass({

  addGiphToDatabase: function (giph) {
    this.state.queue.push(giph);
    //saveGiph (giph);

      console.log(giph.images.original.url);
        $.ajax({
          url: 'http://127.0.0.1:3000'+'/api/save',
          type: 'POST',
          data: JSON.stringify({ design : giph.images.original.url }),
          headers: {"Content-Type": 'application/json'},
          success: function(res) {
            console.log(res);
 
          }
        })

    if (this.state.queue.length === 1){
      this.state.currentGiph = giph;

    }

    //this.forceUpdate();
  },

  getInitialState: function() {
    return {
      search: '',
      giphs: [],
      queue: [],
      currentGiph: undefined
    };
  },

  // onPlayerFinish: function () {
  //   this.setState ({
  //     queue: this.state.queue.slice(1),
  //     currentTrack: this.state.queue[1]
  //   });
  // },

  search: function (keyword) {
    console.log(keyword);

    var that = this;
    var giphyAPI = "http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=dc6zaTOxFJmzC";
  $.getJSON( giphyAPI, {
    //tags: "mount rainier",
    // tagmode: "any",
    // format: "json"
    // SC.get('/tracks', {
    //   q: keyword
    }, function(giphs) {
      console.log(giphs);

    // $.each(tracks.data, function(index) 
    //   { console.log(tracks.data[index].bitly_gif_url) })

      that.setState({
        search: keyword,
        giphs: giphs,
      });

    });
  },

  componentDidMount: function () {
    this.search('');
  },

  render: function () {
    return <div>
      <Search onSearch={this.search} />
      <Grid addGiphToDatabase={this.addGiphToDatabase} giphs={this.state.giphs}/>
    </div>
  }
});

      // <div className="player">
      //   <Player onFinish={this.onPlayerFinish} track={this.state.currentTrack}/>
      //   <SongQueue tracks={this.state.queue}/>
      // </div>

