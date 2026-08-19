// FR-056/057: site-wide search across projects, services, articles and pages,
// implemented on PostgreSQL's built-in full-text search — no external search
// service required at this content volume.
//
// Uses `to_tsvector` / `plainto_tsquery` with `ts_headline` for highlighted
// excerpts, and `ts_rank` for relevance ordering.

export default {
  async find(ctx: any) {
    const q = (ctx.query.q as string || "").trim();
    const page = Math.max(1, parseInt((ctx.query.page as string) || "1", 10));
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    if (!q) {
      ctx.body = { data: [], meta: { pagination: { page, pageSize, total: 0 } } };
      return;
    }

    const knex = strapi.db.connection;

    // Union across the four searchable content types. Each subquery selects a
    // common shape (type, title, slug, excerpt) so results can be ranked and
    // paginated together.
    const searchQuery = `
      (
        SELECT 'project' AS type, title, slug,
          ts_headline('english', coalesce(summary, ''), plainto_tsquery('english', ?), 'MaxFragments=1,MaxWords=30') AS excerpt_highlighted,
          ts_rank(to_tsvector('english', title || ' ' || coalesce(summary, '')), plainto_tsquery('english', ?)) AS rank
        FROM projects
        WHERE published_at IS NOT NULL
          AND to_tsvector('english', title || ' ' || coalesce(summary, '')) @@ plainto_tsquery('english', ?)
      )
      UNION ALL
      (
        SELECT 'service' AS type, title, slug,
          ts_headline('english', coalesce(summary, ''), plainto_tsquery('english', ?), 'MaxFragments=1,MaxWords=30') AS excerpt_highlighted,
          ts_rank(to_tsvector('english', title || ' ' || coalesce(summary, '')), plainto_tsquery('english', ?)) AS rank
        FROM services
        WHERE published_at IS NOT NULL
          AND to_tsvector('english', title || ' ' || coalesce(summary, '')) @@ plainto_tsquery('english', ?)
      )
      UNION ALL
      (
        SELECT 'news-article' AS type, title, slug,
          ts_headline('english', coalesce(excerpt, ''), plainto_tsquery('english', ?), 'MaxFragments=1,MaxWords=30') AS excerpt_highlighted,
          ts_rank(to_tsvector('english', title || ' ' || coalesce(excerpt, '')), plainto_tsquery('english', ?)) AS rank
        FROM news_articles
        WHERE published_at IS NOT NULL
          AND to_tsvector('english', title || ' ' || coalesce(excerpt, '')) @@ plainto_tsquery('english', ?)
      )
      UNION ALL
      (
        SELECT 'page' AS type, title, slug,
          '' AS excerpt_highlighted,
          ts_rank(to_tsvector('english', title), plainto_tsquery('english', ?)) AS rank
        FROM pages
        WHERE published_at IS NOT NULL
          AND to_tsvector('english', title) @@ plainto_tsquery('english', ?)
      )
      ORDER BY rank DESC
      LIMIT ? OFFSET ?
    `;

    const params = [q, q, q, q, q, q, q, q, q, q, q, pageSize, offset];
    const rows = await knex.raw(searchQuery, params);

    const typeToPath: Record<string, string> = {
      project: "/projects/",
      service: "/services/",
      "news-article": "/news/",
      page: "/"
    };

    const data = rows.rows.map((r: any) => ({
      type: r.type,
      title: r.title,
      url: `${typeToPath[r.type]}${r.type === "page" ? "" : r.slug}`,
      excerptHighlighted: r.excerpt_highlighted
    }));

    ctx.body = {
      data,
      meta: { pagination: { page, pageSize, total: data.length } }
    };
  }
};
