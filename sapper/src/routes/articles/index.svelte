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
  import ArticleCard from "../../components/ArticleCard.svelte";
  import type { Post } from "../../../../posts/controllers/types";
  import { onMount } from "svelte";

  export let articles: Post[];

  onMount(() => {
    const listEl = document.getElementById("list");
    const root = document.documentElement;

    root.style.setProperty("--bg-opacity", "1");

    root.style.setProperty("--listWidth", listEl.offsetWidth + "px");

    window.addEventListener("resize", () => {
      root.style.setProperty("--listWidth", listEl.offsetWidth + "px");
    });
  });
</script>

<svelte:head>
  <title>Articles</title>
</svelte:head>

<div class="container">
  <div id="list" class="container__list">
    {#each articles as article}
      <ArticleCard {article} />
    {/each}
  </div>
</div>

<style>
  .container {
    margin-top: 6rem;
    padding-top: 2rem;
  }

  .container__list {
    width: 90%;
    max-width: 1024px;
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
  }
</style>
