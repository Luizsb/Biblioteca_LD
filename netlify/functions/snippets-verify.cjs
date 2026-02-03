const TOKEN_HEADER = "authorization";

/** Apenas valida o token (ADMIN_TOKEN). Nao altera dados. */
exports.handler = async (event) => {
    if (event.httpMethod !== "POST" && event.httpMethod !== "GET") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    const expectedToken = process.env.ADMIN_TOKEN;
    const authHeader = event.headers?.[TOKEN_HEADER] || event.headers?.Authorization || "";
    const incomingToken = authHeader.replace(/^Bearer\s+/i, "");

    if (!expectedToken || incomingToken !== expectedToken) {
        return { statusCode: 401, body: "Unauthorized" };
    }

    return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true }),
    };
};
