<script context="module" lang="ts">
  export async function preload() {
    try {
      var res = await this.fetch(`/gql`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query {
            posts {
              id
              slug
              title
              banner
              excerpt
              markdown
              created
              updated
            }
          }
          `,
        }),
      });

      const { data, errors } = await res.json();

      if (errors) throw Error(errors[0].message);

      const posts = data.posts;

      return { posts };
    } catch (error) {
      console.log(error);
      this.error(res.status, error);
    }
  }
</script>

<script lang="ts">
  import type { Article } from "../../../../posts/controllers/types";
  export let posts: Article[];
</script>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<div class="container">
  <h1 class="container__title">Articles</h1>

  <ul class="container__list">
    {#each posts as post}
      <li class="container__item">
        <a class="container__link" rel="prefetch" href="articles/{post.slug}"
          >{post.title}</a
        >
        <span class="container__excerpt">{post.excerpt}</span>
      </li>
    {/each}
  </ul>
</div>

<style>
  .container {
    width: 90%;
    max-width: 768px;
    margin: 0 auto;
  }

  .container__title {
    display: block;
    font-family: Merriweather, serif;
    margin: 2rem 0;
    font-size: 4rem;
  }

  .container__link {
    font-size: 1.75rem;
    font-weight: 700;
  }

  .container__excerpt {
    display: block;
  }

  ul {
    margin: 0 0 1em 0;
    line-height: 1.5;
  }

  li {
    list-style: none;
  }
</style>
