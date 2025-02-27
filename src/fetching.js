const log = console.log
async function connect_to_server(endpoint, method, user_token, type, body, route) {

    let header_c = {
        // 'Content-Type': type,
        "Accept-Version": 1,
        'Accept': "application/json",
        // "Access-Control-Allow-Origin": "*",
        'authorization': user_token,

    }

    // header_c.push(header)
    log(header_c)
    log(body)

    try {


        return await fetch(endpoint, {
            method: method,
            headers: header_c,
            body: body
        });


    }

    catch (e) {
        console.log('error from :', route, 'it says :', e)
    }

} 

async function connect_to_server_a(endpoint, method, user_token, type, body, route) {
    // Define headers
    let headers = {
        'Accept-Version': 1,
        'Accept': 'application/json',
        'authorization': user_token,
    };

    // Add Content-Type header if type is provided
    if (type) {
        headers['Content-Type'] = type;
    }

    log('Headers:', headers);
    log('Body:', body);

    try {
        // Make the request using Axios
        const response = await axios({
            method: method, // HTTP method (GET, POST, etc.)
            url: endpoint, // API endpoint
            headers: headers, // Request headers
            data: body, // Request body (for POST, PUT, etc.)
        });

        // Return the response data
        return response.data;
    } catch (error) {
        // Handle errors
        console.error(`Error from ${route}:`, error.message || error);
        throw error; // Re-throw the error if needed
    }
}
