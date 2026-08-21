export default {

    async fetch(request, env) {

        const url = new URL(request.url);

        // ================================================
        // ROBOTS.TXT
        // ================================================

        if (url.pathname === "/robots.txt") {

            const contenido =
                "User-agent: *\n" +
                "Allow: /\n" +
                "Sitemap: " + url.origin + "/sitemap.xml\n";

            return new Response(contenido, {
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8",
                    "Cache-Control": "public, max-age=3600"
                }
            });

        }

        // ================================================
        // SITEMAP.XML
        // ================================================

        if (url.pathname === "/sitemap.xml") {

            const paginaPrincipal = url.origin + "/";

            const contenido =
                '<?xml version="1.0" encoding="UTF-8"?>' +
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
                '<url>' +
                '<loc>' + paginaPrincipal + '</loc>' +
                '</url>' +
                '</urlset>';

            return new Response(contenido, {
                headers: {
                    "Content-Type": "application/xml; charset=UTF-8",
                    "Cache-Control": "public, max-age=3600"
                }
            });

        }

        // ================================================
        // RESTO DE LOS RECURSOS
        // ================================================

        return env.ASSETS.fetch(request);

    }

};
