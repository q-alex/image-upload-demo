var dropbox = document.getElementById('preview'); // grab reference to image preview box

// add drag and drop functionality
dropbox.addEventListener('dragenter', noopHandler, false);
dropbox.addEventListener('dragexit', noopHandler, false);
dropbox.addEventListener('dragover', noopHandler, false);
dropbox.addEventListener('drop', drop, false);

// make sure nothing happens
function noopHandler(event) {
    event.preventDefault();
}

// overide default behavior with upload functionality
function drop(event) {
    event.stopPropagation();
    event.preventDefault();

    var dataValue;

    // atempt to get image url for multiple browsers
    try {
      dataValue = event.dataTransfer.getData('text/uri-list');
    } catch (e) {
      dataValue = event.dataTransfer.getData('URL');
    }

    var myRequest = new XMLHttpRequest(); // for sending file to server

    if (dataValue) {
      // set preview to the image
      dropbox.src = dataValue;

      // wrap url for sending
      var imageLink = new FormData(); // package to send
      test.append('url', dataValue);

      // send image url
      myRequest.open('POST', 'http://localhost:3000/web-image-upload', true);
      myRequest.send(imageLink);


    } else {
      // get files to be uploaded
      var dataFiles = event.dataTransfer.files;

      // take the first file
      var dataFile = dataFiles[0];

      // wrap file for sending
      var desktopImage = new FormData(); // package to send
      desktopImage.append('image', dataFile);

      // send file
      myRequest.open('POST', 'http://localhost:3000/file-image-upload', true);
      myRequest.send(desktopImage);

      // load file for preview
      var reader = new FileReader();

      reader.onload = function (dataValue) {
        // get loaded data and render thumbnail.
        document.getElementById("preview").src = dataValue.target.result;
      };

      // read the image file as a data URL.
      reader.readAsDataURL(dataFile);
    }
}
