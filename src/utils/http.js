export function makeCORSHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key, Authorization",
        "Access-Control-Max-Age": "86400"
    };
}

export function jsonError(message, param, code, status = 400) {
    return new Response(JSON.stringify({ 
        error: { message, type: 'invalid_request_error', param, code } 
    }), { 
        status, 
        headers: { 
            'Content-Type': 'application/json', 
            ...makeCORSHeaders() 
        } 
    });
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
