export default {
  routes: [
    {
      method: "GET",
      path: "/search",
      handler: "search.find",
      config: { auth: false } // public — read-only, no sensitive data exposed
    }
  ]
};
