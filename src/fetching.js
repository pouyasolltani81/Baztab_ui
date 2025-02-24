async function connect_to_server(endpoint, method, header, type, body, route) {

    let header_c = {
        'Content-Type': type,
        "Accept-Version": 1,
        'Accept': "application/json",
        "Access-Control-Allow-Origin": "*",
        header

    }

    // header_c.push(header)

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
