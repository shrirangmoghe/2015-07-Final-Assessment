
var hostname = "http://bootcamp1.autodesk.com";
//var hostname = "http://morning-stream-3036.herokuapp.com";
var defaultUrn = '';
var token;


$(document).ready(function () {
  //Creates the item
  /*
  var itemval = $('<option value="dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Ym9vdGNhbXAxdGVhbTEvc2FtMi5mM2Q=">file1</option>');
  var itemvale = $('<option value="dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Ym9vdGNhbXAxdGVhbTEvYk5YcGFydDF2Mi5mM2Q=">file2</option>');
  var itemvalt = $('<option value="dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6Ym9vdGNhbXAxdGVhbTEvYk5YcGFydDF2MS5wcnQ=">file3</option>')
  $('#viewsel').append(itemval);
  $('#viewsel').append(itemvale);
  $('#viewsel').append(itemvalt);
*/
	//initViewer();

  saveGiph();
});

function initViewer() {
  getToken(function(t) {
    var options = {

      'document' : 'urn:'+defaultUrn,

      'env':'AutodeskStaging',

      'getAccessToken': function() { return token },

      'refreshToken': function() { return token }  

    };

    var viewerElement = document.getElementById('viewer');

    viewer = new Autodesk.Viewing.Viewer3D(viewerElement, {});
    loadComments(token);

    Autodesk.Viewing.Initializer(options,function() {

      viewer.initialize();
      loadComments(token);
      pubnub.subscribe({
        channel: defaultUrn,
        message: function(m){console.log(m);loadComments(token)},
        error: function (error) {
          // Handle error here
          console.log(JSON.stringify(error));
        }
      });
      loadDocument(viewer, options.document);

    });
  });
}

function onError(error) {
    console.log('Error: ' + error);
};

function loadUrns() {
  $('#viewsel').empty();
  $.ajax({
      url: hostname+'/api/geturns',
      type: 'GET',
      contentType: 'application/json',
      headers: {"Access-Control-Allow-Origin" : "*"},
      success: function(data) {
        data = JSON.parse(data);  
        if(data.length) {
          for(var i = 0; i<data.length;i++) {
            console.log(data[i]);
             var itemval = $('<option value="'+data[i]+'">file'+i+'</option>');
              $('#viewsel').append(itemval);
          }
          changeModel(data[i]);
        }
      },
      error: function(err) {
        console.error('errpr:', err);
      },
      complete: function() {
      }
  });

function saveGiph(giphUrl) {
  console.log(giphUrl);
        $.ajax({
          url: 'https://127.0.0.1:3000',
          type: 'POST',
          data: JSON.stringify({ design : giphUrl }),
          headers: {"Content-Type": 'application/json'},
          success: function(res) {
            console.log(res);
 
          }
        })
}


function getToken(callback) {
  if (token)
  {
    callback(token);
  } else {
    $.ajax({
      url: hostname+'/api/readtoken',
      type: 'GET',
      contentType: 'application/json',
      headers: {"Access-Control-Allow-Origin" : "*"},
      success: function(data) {
        console.log('data is:', data);
      	token = data.access_token;
        callback(token);
      },
      error: function(err) {
        console.error('errpr:', err);
      },
      complete: function() {
      }
    });
  }
}

function postComment() {
	var text = $('#commentText')[0].value;
	getToken(function(token) {
		$.ajax({
		    url: hostname+'/api/comment',
		    type: 'POST',
		    data: JSON.stringify({
          token: token,
		    	text: text,
          urn: defaultUrn
		    }),
		    contentType: 'application/json',
		    headers: {"Access-Control-Allow-Origin": '*'},
		    success: function(data) {
          console.log('data',data);
          loadComments(token);
		    },
		    error: function(err) {
		      console.error(err);
		    },
		    complete: function() {
		    }
	  });
  });
  $('#commentText')[0].value = '';
}

function loadComments(token) {
  console.log(token);
  $.ajax({
    url: 'https://developer-stg.api.autodesk.com/comments/v2/resources/'+defaultUrn,
    type: 'GET',
    contentType: 'application/json',
    headers: {"Access-Control-Allow-Origin": '*', Authorization: "Bearer "+token },
    success: function(data) {
      console.log('loaded comments');
      // Don't bother if we have nothing to work with

      $('#comments').empty();
      console.log(data);
      for(var i = 0; i<data.length; i++) {
      	console.log('asdasd');
        var elem = $('<div class="comment">'+data[i].body+'</div>');
        $('#comments').append(elem);
      }

    },
    error: function(err) {
      console.error(err);
    },
    complete: function() {
    }
  });
}


function loadDocument(viewer, documentId) {
    // Find the first 3d geometry and load that.
    Autodesk.Viewing.Document.load(documentId, function(doc) {// onLoadCallback
    var geometryItems = [];
    geometryItems = Autodesk.Viewing.Document.getSubItemsWithProperties(doc.getRootItem(), {
        'type' : 'geometry',
        'role' : '3d'
    }, true);

    if (geometryItems.length > 0) {
        viewer.load(doc.getViewablePath(geometryItems[0]));
    }
 }, function(errorMsg) {// onErrorCallback
    console.log("Load Error: " + errorMsg);
    });
}