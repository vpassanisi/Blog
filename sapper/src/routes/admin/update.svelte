<script lang="ts">
  import type { Post } from "../../../../posts/controllers/types";

  let auth: string;
  let slug: string;
  let article: Post;

  async function boom() {
    if (!slug) return;
    try {
      const res = await fetch("/gql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          query: `
        query Input(\$slug: String!) {
            posts(slug: \$slug) {
              id
              slug
              title
              banner
              tiny
              excerpt
              markdown
              created
              updated
              live
            }
          }
        `,
          variables: {
            slug,
          },
        }),
      });

      const { data, errors } = await res.json();

      if (errors) throw Error(errors);

      article = data.posts[0];
    } catch (error) {
      console.log(error);
    }
  }

  async function update() {
    if (!auth) return;
    try {
      const res = await fetch("/gql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          query: `
        mutation Input(\$id: String!, \$live: Boolean!) {
            updatePost(id: \$id, live: \$live) {
              slug
            }
          }
        `,
          variables: {
            id: article.id,
            live: article.live,
          },
        }),
      });

      const { data, errors } = await res.json();

      if (errors) throw Error(errors);

      slug = data.updatePost.slug;

      console.log(slug);
    } catch (error) {
      console.log(error);
    }
  }
</script>

<svelte:head>
  <title>Update</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<section class="admin">
  <div class="admin__container">
    <input
      bind:value={auth}
      class="container__auth"
      type="text"
      placeholder="auth . . ."
    />

    <input
      bind:value={slug}
      class="container__id"
      type="text"
      placeholder="slug . . ."
      name="slug"
    />

    <button class="container__boom" on:click={boom}>Get</button>

    {#if article}
      <div class="container__article">
        <div>{article.title}</div>
        <div class="article__live">
          Live:
          <input
            bind:checked={article.live}
            class="live__checkbox"
            type="checkbox"
          />
        </div>
      </div>
      <button class="container__boom" on:click={update}>Update</button>
    {/if}
  </div>
</section>

<style>
  :global(body) {
    background-color: var(--blue-gray-50);
  }

  .admin {
    margin-top: 70px;
  }

  :global(.dark .admin) {
    background-color: var(--dark-gray-900);
  }

  .admin__container {
    width: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    padding-top: 4rem;
  }

  .container__auth {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    border: none;
  }

  .container__auth:focus {
    outline: none;
  }

  :global(.dark .container__auth) {
    background-color: var(--dark-gray-800);
  }

  .container__id {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.5rem;
    border: none;
  }

  .container__id:focus {
    outline: none;
  }

  :global(.dark .container__id) {
    background-color: var(--dark-gray-800);
  }

  .container__boom {
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding-left: 3rem;
    padding-right: 3rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    font-size: 1.5rem;
    color: var(--white);
    background-color: var(--upsdell-red-500);
  }

  .container__article {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0.5rem;
    padding: 0.25rem 0.5rem;
    background-color: var(--white);
  }

  :global(.dark .container__article) {
    background-color: var(--dark-gray-800);
  }

  .article__live {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .live__checkbox {
    width: 1rem;
    height: 1rem;
  }
</style>
