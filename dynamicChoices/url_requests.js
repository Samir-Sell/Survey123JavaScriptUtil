// echo provides a basic check that JavaScript is working correctly
function echo(input) {
	return input.toString();
}


// Query a feature layer and returns the feature that intersects the location
function featureByLocation(layerURL, location, token) {
	// Output value.  Initially set to an empty string (XLSForm null)
	let outValue = "";

	// Check to make sure both layerURL and location are provided
	if (layerURL == null || layerURL === "" || location == null || location === "") {
		// The function can't go forward; exit with the empty value
		return location;
	}

	// The coordinates will come in as `<lat> <lon> <alt> <acc>`.  
	// We need <lon>,<lat> for the query
	// Note that I'm using the relatively new ` ` string that lets me place variables ${var}
	let coordsArray = location.split(" ");
	let coords = `${coordsArray[1]},${coordsArray[0]}`;
	
	
	// Set up query parameters
	let f = "f=json";
	let geometry = `geometry=${coords}`; 
	let geometryType = "geometryType=esriGeometryPoint";
	let inSR = "inSR=4326";
	let spatialRel = "spatialRel=esriSpatialRelIntersects";
	let outFields = "outFields=*";
	let returnGeometry = "returnGeometry=false";
	let returnCount = "returnCount=1";
	let parameters = [f,geometry,geometryType,inSR,spatialRel,outFields,returnGeometry,returnCount].join("&");
	if (token) {
		parameters = parameters + `&token=${token}`;
	}
	let url = `${layerURL}/query?${parameters}`;

	// Create the request object
	let xhr = new XMLHttpRequest();
	// Make the request.  Note the 3rd parameter, which makes this a synchronous request
	xhr.open("GET", url, false);
	xhr.send();
	
	
	// Process the result
	if (xhr.readyState === xhr.DONE) {
		if (xhr.status !== 200) {
			// The http request did not succeed
			return "bad request: " + url
		} else {
				// Parse the response into an object
			let response = JSON.parse(xhr.responseText);
			if (response.error) {
				// There was a problem with the query
			} else {
				if (response.features[0]) {
					outValue = JSON.stringify(response.features[0]);
				} else {
					// No features found
				}
			}
		}
	}
	return outValue;
}

// Query a feature layer and returns a specific field value from 
// the feature that intersects the location
function fieldValueByLocation(layerURL, location, field, token) {
	// Output value.  Initially set to an empty string (XLSForm null)
	let outValue = "";

	// Check to make sure both layerURL and location are provided
	if (layerURL == null || layerURL === "" || location == null || location === "") {
		// The function can't go forward; exit with the empty value
		return outValue;
	}

	// The coordinates will come in as `<lat> <lon> <alt> <acc>`.  
	// We need <lon>,<lat> for the query
	// Note that I'm using the relatively new ` ` string that lets me place variables ${var}
	let coordsArray = location.split(" ");
	let coords = `${coordsArray[1]},${coordsArray[0]}`;
	
	
	// Set up query parameters
	let f = "f=pjson";
	let geometry = `geometry=${coords}`; 
	let geometryType = "geometryType=esriGeometryPoint";
	let inSR = "inSR=4326";
	let spatialRel = "spatialRel=esriSpatialRelIntersects";
	let outFields = `outFields=${field}`;
	let returnGeometry = "returnGeometry=false";
	let returnCount = "returnCount=1";
	let parameters = [f,geometry,geometryType,inSR,spatialRel,outFields,returnGeometry,returnCount].join("&");
	if (token) {
		parameters = parameters + `&token=${token}`;
	}
	let url = `${layerURL}/query?${parameters}`;
	
	/*
	https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Administrative_Divisions/FeatureServer/0/query?
	f=pjson
	&geometry=-122.32759252280006,47.59698828035203
	&geometryType=esriGeometryPoint
	&inSR=4326
	&spatialRel=esriSpatialRelIntersects
	&outFields=NAME
	&returnGeometry=false
	&returnCount=1
	https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Administrative_Divisions/FeatureServer/0/query?where=&objectIds=&time=&geometry=-117.19605707130171%2C34.0675386635019&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=NAME&returnGeometry=false&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=html&token=
	*/
// 	return url;
	// Create the request object
	let xhr = new XMLHttpRequest();
	// Make the request.  Note the 3rd parameter, which makes this a synchronous request
	xhr.open("GET", url, false);
	xhr.send();
	
	// Process the result
	// This an abbreviated version without being able to distinguish different types of errors
	if (xhr.status === 200) {
		let response = JSON.parse(xhr.responseText);
		if (!response.error) {
			if (response.features[0]) {
				outValue = response.features[0].attributes[field];
			}
		}
	}
	return outValue;
}

// Query the NHTSA to return information about a vehicle based on it's VIN
// Refer to https://vpic.nhtsa.dot.gov/api/ for more information
function decodeVIN (VIN){
	// Output value.  Initially set to an empty string (XLSForm null)
	let outValue = "";
	
	// Check the length to make sure a full VIN is provided
    if (VIN.length<11){
       return outValue;
    }
 
 	// Add the VIN to the decode VIN API request
    let url =  `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${VIN}?format=json`;

	// Create the request object
	let xhr = new XMLHttpRequest();
	// Make the request.  Note the 3rd parameter, which makes this a synchronous request
	xhr.open("GET", url, false);
	xhr.send();
	
	//Process the result
	if (xhr.status !== 200) {
		// The http request did not succeed
	} else {
		outValue = xhr.responseText;
	}
	
	return outValue;	
}