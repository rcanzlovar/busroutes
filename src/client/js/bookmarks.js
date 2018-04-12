// Listen for form submit
//document.getElementById('myForm').addEventListener('submit', saveBookmark);

var stash = 'router'//this should nedver be used 

// Save Bookmark
// saveThing({id:'15145',name:'main and 17th',stash:'mystops'})
function isThingSaved(e){
  if ( typeof e == 'object' && typeof e.id == 'string') { id = e.id }
  if ( typeof e == 'object' && typeof e.stash == 'string') { stash = e.stash }

  if(localStorage.getItem(stash) === null){
    return 0;
  }

  var things = JSON.parse(localStorage.getItem(stash));
  // Loop through the bookmarks
  for(var i =0;i < things.length;i++){
    if(things[i].id == id){
      // Remove from array
      return 1;
    }
  }
  return 0;
}

function saveThing(e){
  if ( typeof e == 'object' && typeof e.id == 'string') { id = e.id }
  if ( typeof e == 'object' && typeof e.name == 'string') { name = e.name }
  if ( typeof e == 'object' && typeof e.stash == 'string') { stash = e.stash }
  if ( typeof e == 'object' && typeof e.result == 'string') { result = e.result }

//  if(!validateForm(siteName, siteUrl)){
//    return false;
//  }

  var thing = {
    'id': id,
    'name': name
  }

  /*
    // Local Storage Test
    localStorage.setItem('test', 'Hello World');
    console.log(localStorage.getItem('test'));
    localStorage.removeItem('test');
    console.log(localStorage.getItem('test'));
  */

  // Test if stashplace is null
  if(localStorage.getItem(stash) === null){
    // Init array
    var things = [];
    // Add to array
    things.push(thing);
    // Set to localStorage
    localStorage.setItem(stash, JSON.stringify(things));
  } else {
    // Get stashplace from localStorage
    var things = JSON.parse(localStorage.getItem(stash));
    // Add stashplace to array
    things.push(thing);
    // Re-set back to localStorage
    localStorage.setItem(stash, JSON.stringify(things));
  }

  // Clear form
//  document.getElementById('myForm').reset();

  // Re-fetch bookmarks
  fetchThings({'stash':stash,'result':result});
}

// Delete bookmark
function deleteThing(e){
  if ( typeof e == 'object' && typeof e.id == 'string') { id = e.id }
  if ( typeof e == 'object' && typeof e.stash == 'string') { stash = e.stash }
  if ( typeof e == 'object' && typeof e.stash == 'result') { result = e.result }
  // Get bookmarks from localStorage
  var things = JSON.parse(localStorage.getItem(stash));
  // Loop through the bookmarks
  for(var i =0;i < things.length;i++){
    if(things[i].id == id){
      // Remove from array
      things.splice(i, 1);
    }
  }
  // Re-set back to localStorage
  localStorage.setItem(stash, JSON.stringify(things));

  // Re-fetch bookmarks
  fetchThings({'stash':stash,'result':result});
}

// Fetch bookmarks
//fetchBookmarks({stash:'stops',results:'heading'})
function fetchThings(e){
  if ( typeof e == 'object' && typeof e.stash == 'string') { stash = e.stash }
  if ( typeof e == 'object' && typeof e.result == 'string') { result = e.result }

  // init it if it isnt there 
  if(localStorage.getItem(stash) === null){
    // Init array
    var things = [];
    // Add to array
    things.push(thing);
    // Set to localStorage
    localStorage.setItem(stash, JSON.stringify(things));
  } 
  // Get bookmarks from localStorage
  var things = JSON.parse(localStorage.getItem(stash));
  // Get output id
  var thingsResult = document.getElementById(result);

  // Build output
  thingsResult.innerHTML = '';
  for(var i = 0; i < things.length; i++){
    var name = things[i].name;
    var id = things[i].id;
/*
    thingsResults.innerHTML += "<div class='well'>"+
                                  "<h3>"+name+
                                  " <a class='btn btn-default' target="_blank" href="'+url+'">Visit</a> ' +
                                  " <a onclick=\"deleteThing({'id':'"+id+'\'})" class="btn btn-danger" href="#">Delete</a> ' +
                                  "</h3>"+
                                  "</div>";
*/
        thingsResult.innerHTML +=    "<div class='well'>"
        +"<a class='btn btn-sm btn-secondary' href='#'  " ;

        /*
    if (stash == 'routes') {
       thingsResult.innerHTML += "onclick=\"apitrips('"+id+"');\">"+id+"&nbsp;"+name+"</a>";
    }
    if (stash == 'stops') {
        thingsResult.innerHTML += "onclick=\"apitrips({'stop':'"+id+"'});\">"+name+"</a>";
    }
      */
       thingsResult.innerHTML += " onclick=\"apitrips('"+id+"');\">"+id+"&nbsp;"+name+"</a>";
    thingsResult.innerHTML +=         "</div";
  }
}

// Validate Form
function validateForm(siteName, siteUrl){
  if(!siteName || !siteUrl){
    alert('Please fill in the form');
    return false;
  }

  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if(!siteUrl.match(regex)){
    alert('Please use a valid URL');
    return false;
  }

  return true;
}
