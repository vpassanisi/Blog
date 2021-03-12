<script context="module" lang="ts">
  export async function preload({ params }) {
    try {
      var res = await this.fetch(`/gql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
					query Input(\$slug: String) {
						posts(slug: \$slug) {
							id
							slug
							markdown
							created
							updated
						}
					}
					`,
          variables: {
            slug: params.slug,
          },
        }),
      });

      const { data, errors } = await res.json();

      if (errors) throw Error(errors[0].message);

      const post = data.posts[0];

      return { post };
    } catch (error) {
      console.log(error);
      this.error(res.status, error);
    }
  }
</script>

<script lang="ts">
  export let post: {
    id: string;
    slug: string;
    markdown: string;
    created: number;
    updated: number | null;
  };
</script>

<svelte:head>
  <title>{post.slug}</title>
</svelte:head>

<h1>{post.slug}</h1>

<div class="content">
  {@html post.markdown}
</div>

<style>
  /*
		By default, CSS is locally scoped to the component,
		and any unused styles are dead-code-eliminated.
		In this page, Svelte can't know which elements are
		going to appear inside the {{{post.html}}} block,
		so we have to use the :global(...) modifier to target
		all elements inside .content
	*/
  .content :global(h2) {
    font-size: 1.4em;
    font-weight: 500;
  }

  .content :global(pre) {
    background-color: #f9f9f9;
    box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
    padding: 0.5em;
    border-radius: 2px;
    overflow-x: auto;
  }

  .content :global(pre) :global(code) {
    background-color: transparent;
    padding: 0;
  }

  .content :global(ul) {
    line-height: 1.5;
  }

  .content :global(li) {
    margin: 0 0 0.5em 0;
  }
</style>
