/*
 * JavaScript functions for Survey123
 */

function lookup_table(country_name, token) {

    let layerURL = "https://mceweb.esri.local/arcgis/rest/services/Hosted/SRA_IMAGE_TEST/FeatureServer/0";

    // Set up query parameters
	let f = "f=json";
    let where = "where=country='" + country_name + "'"
	let inSR = "inSR=4326";
	let outFields = "outFields=*";
	let returnGeometry = "returnGeometry=false";
	let parameters = [where,f,inSR,outFields,returnGeometry].join("&");
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
					let outValue = JSON.stringify(response.features[0]);
                    return outValue;

				} else {
					// No features found
				}
			}
		}
	}
}