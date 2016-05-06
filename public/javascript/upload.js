var dropbox = document.getElementById('preview');

dropbox.addEventListener('dragenter', noopHandler, false);
dropbox.addEventListener('dragexit', noopHandler, false);
dropbox.addEventListener('dragover', noopHandler, false);
dropbox.addEventListener('drop', drop, false);

function noopHandler(event) {
    event.preventDefault();
}

function drop(event) {
    event.stopPropagation();
    event.preventDefault();

    var dataValue;

    try {
      dataValue = event.dataTransfer.getData('text/uri-list');
    } catch (e) {
      dataValue = event.dataTransfer.getData('URL');
    }


    if (dataValue) {
      dropbox.src = dataValue;
      var test = new FormData();
      test.append('url', dataValue);

      var myRequest = new XMLHttpRequest();
      myRequest.open('POST', 'http://localhost:3000/web-image-upload', true);
      myRequest.send(test);


    } else {
      var dataFiles = event.dataTransfer.files;

      var dataFile = dataFiles[0];

      var test = new FormData();
      test.append('image', dataFile);

      var myRequest = new XMLHttpRequest();
      myRequest.open('POST', 'http://localhost:3000/file-image-upload', true);
      myRequest.send(test);

      var reader = new FileReader();

      reader.onload = function (dataValue) {
        // get loaded data and render thumbnail.
        document.getElementById("preview").src = dataValue.target.result;
      };

      // read the image file as a data URL.
      reader.readAsDataURL(dataFile);
    }
}
