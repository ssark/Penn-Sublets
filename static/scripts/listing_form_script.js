$(document).ready(function () {
	console.log("in listing form script")
    // We want to preview images, so we need to register the Image Preview plugin
    FilePond.registerPlugin(
      
      // encodes the file as base64 data
      FilePondPluginFileEncode,
      
      // validates the size of the file
      FilePondPluginFileValidateSize,
      
      // corrects mobile image orientation
      FilePondPluginImageExifOrientation,
      
      // previews dropped images
      FilePondPluginImagePreview
    );


    FilePond.create(document.querySelector('.filepond'));

    var s3 = new AWS.S3({
        accessKeyId: "xx",
      secretAccessKey: "xx",
      region: 'us-east-1'
    });

    FilePond.setOptions({
        server: {
            process: function(fieldName, file, metadata, load, error, progress, abort) {
                s3.upload({
                    Bucket: 'pennsublet-listing-pictures',
                    Key: "bro" + file.name,
                    Body: file,
                    ContentType: file.type,
                    ACL: 'public-read'
                }, function(err, data) {
                    if (err) {
                        error('Something went wrong');
                        console.log(err); 
                        return;
                    }
                    //console.log("after the callback"); 
                    //addImageToFamFriend(); 
                    // pass file unique id back to filepond
                    load(data.Key);
                    console.log("added image " + data.Key);
                });
	        }
        }
    });






});