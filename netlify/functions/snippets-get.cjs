const { getStore } = require("@netlify/blobs");

exports.handler = async () => {
    try {
        const store = getStore({
            name: "snippets",
            siteID: process.env.NETLIFY_SITE_ID,
            token: process.env.NETLIFY_API_TOKEN,
        });
        const raw = await store.get("data");
        let parsed = null;
        if (raw && typeof raw === "string") {
            try {
                parsed = JSON.parse(raw);
            } catch {
                parsed = null;
            }
        } else if (raw && typeof raw === "object") {
            parsed = raw;
        }
        const payload = parsed && Array.isArray(parsed.snippets) ? parsed : { snippets: [] };
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
            body: JSON.stringify(payload),
        };
    } catch (error) {
        console.error("snippets-get failed", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                snippets: [],
                error: "failed_to_load",
                message: error?.message || "unknown_error",
            }),
        };
    }
};
