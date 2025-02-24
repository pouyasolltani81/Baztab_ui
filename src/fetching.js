const log = console.log
async function connect_to_server(endpoint, method, user_token, type, body, route) {

    let header_c = {
        'Content-Type': type,
        "Accept-Version": 1,
        'Accept': "application/json",
        "Access-Control-Allow-Origin": "*",
        'authorization': user_token,

    }

    // header_c.push(header)
    log(header_c)

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
