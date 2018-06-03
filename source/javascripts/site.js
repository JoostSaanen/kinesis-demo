// Configure Credentials to use Cognito
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	IdentityPoolId: myIdentityPoolId
});

AWS.config.region = region;

AWS.config.credentials.get(function(err) {
	if (err) {
		alert('Error retrieving credentials.');
		console.error(err);
		return;
	}
    // create kinesis client once
    var kinesis = new AWS.Kinesis({
    	apiVersion: '2013-12-02'
    });


    var x = 0, y = 0, vx = 0, vy = 0, ax = 0, ay = 0;

    var sphere = document.getElementById("sphere");

    var recordData = [];

    if (window.DeviceMotionEvent != undefined) {
    	window.ondevicemotion = function(e) {
    		ax = event.accelerationIncludingGravity.x * 5;
    		ay = event.accelerationIncludingGravity.y * 5;

    		document.getElementById("positionX").innerHTML = sphere.offsetLeft;
    		document.getElementById("positionY").innerHTML = sphere.offsetTop;
    		document.getElementById("quadrant").innerHTML  = getQuadrant(sphere.offsetLeft, sphere.offsetTop);

		// Create the kinesis record
		var record = {
			Data: JSON.stringify({
				POSITIONX: sphere.offsetLeft,
				POSITIONY: sphere.offsetTop,
				QUADRANT: getQuadrant(sphere.offsetLeft, sphere.offsetTop),
				GUID: guid(),
				TIME: new Date()
			}), PartitionKey: 'quadrant'
		};

		recordData.push(record);

	}

	function getQuadrant(positionX, positionY) {
		var quadrantWidth = document.documentElement.clientWidth / 2;
		var quadrantHeight = document.documentElement.clientHeight / 2;

		if ((positionX < quadrantWidth) && (positionY < quadrantHeight)) { return "A"; }
		if ((positionX > quadrantWidth) && (positionY < quadrantHeight)) { return "B"; }
		if ((positionX > quadrantWidth) && (positionY > quadrantHeight)) { return "C"; }
		if ((positionX < quadrantWidth) && (positionY > quadrantHeight)) { return "D"; }
	}


	setInterval( function() {
		var landscapeOrientation = window.innerWidth/window.innerHeight > 1;
		if ( landscapeOrientation) {
			vx = vx + ay;
			vy = vy + ax;
		} else {
			vy = vy - ay;
			vx = vx + ax;
		}
		vx = vx * 0.98;
		vy = vy * 0.98;
		y = parseInt(y + vy / 50);
		x = parseInt(x + vx / 50);
		
		boundingBoxCheck();
		
		sphere.style.top = y + "px";
		sphere.style.left = x + "px";
		
	}, 25);

	// upload data to kinesis every second if data exists
	setInterval(function() {
		if (!recordData.length) {
			return;
		}
        // upload data to kinesis
        kinesis.putRecords({
        	Records: recordData,
        	StreamName: 'kinesis-demo'
        }, function(err, data) {
        	if (err) {
        		console.error(err);
        	}
        });
        	// clear record data
        	recordData = [];
    	}, 1000);
	} 

	function boundingBoxCheck(){
		if (x<0) { x = 0; vx = -vx; }
		if (y<0) { y = 0; vy = -vy; }
		if (x>document.documentElement.clientWidth-20) { x = document.documentElement.clientWidth-20; vx = -vx; }
		if (y>document.documentElement.clientHeight-20) { y = document.documentElement.clientHeight-20; vy = -vy; }
	}
});

var guid = function() {

    var nav = window.navigator;
    var screen = window.screen;
    var guid = nav.mimeTypes.length;
    guid += nav.userAgent.replace(/\D+/g, '');
    guid += nav.plugins.length;
    guid += screen.height || '';
    guid += screen.width || '';
    guid += screen.pixelDepth || '';

    return guid;
};
