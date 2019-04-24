$(document).ready(function () {
	console.log("in listing form script")
	// $("#post-button").click(function() {
	// 	var title = $('#title').val()
	// 	var desc = $('#desc').val()

	// 	$.ajax({
	// 			type: "POST",
	// 			url: './newListing',
	// 			data: {
	// 				title: title,
	// 				description: desc
	// 			},
	// 			dataType: 'json'
	// 		})
	// 		.done(function(data) {
	// 			console.log(data)
	// 		})
	// 		.fail(function(data) {
	// 			alert("Error: " + data.responseJSON.msg)
	// 		})
	// });

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
        accessKeyId: "AKIAI2PB7D3PXBP4F55A",
      secretAccessKey: "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",
      region: 'us-east-1'
    });

    FilePond.setOptions({
        server: {
            process: function(fieldName, file, metadata, load, error, progress, abort) {
                console.log("hi we are in s3 upload"); 
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