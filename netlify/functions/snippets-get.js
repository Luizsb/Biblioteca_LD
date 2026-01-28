import { getStore } from "@netlify/blobs";

export default async () => {
    try {
        const store = getStore("snippets");
        const data = await store.get("data", { type: "json" });
        if (!data || !Array.isArray(data.snippets)) {
            return new Response(JSON.stringify({ snippets: [] }), {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-store",
                },
            });
        }
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        return new Response(JSON.stringify({ snippets: [], error: "failed_to_load" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
