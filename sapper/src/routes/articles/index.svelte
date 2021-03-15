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
              tiny
              excerpt
              markdown
              created
              updated
              live
            }
          }
          `,
        }),
      });

      const { data, errors } = await res.json();

      if (errors) throw Error(errors[0].message);

      const articles = data.posts;

      return { articles };
    } catch (error) {
      console.log(error);
      this.error(res.status, error);
    }
  }
</script>

<script lang="ts">
  import type { Post } from "../../../../posts/controllers/types";
  import ArticleCard from "../../components/ArticleCard.svelte";
  export let articles: Post[];
</script>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<div class="container">
  <div class="container__list">
    {#each articles as article}
      <ArticleCard {article} />
    {/each}
  </div>
</div>

<style>
  .container {
    width: 90%;
    max-width: 768px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 4rem;
  }

  .container__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
</style>
