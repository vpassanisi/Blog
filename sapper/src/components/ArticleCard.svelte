<script lang="ts">
  import readingTime from "reading-time";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import type { Post } from "../../../posts/controllers/types";

  export let article: Post;
  let loaded = false;

  const readTime = readingTime(article.markdown);

  const date = new Date(article.created * 1000).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  onMount(() => {
    const img = new Image();
    img.onload = () => {
      loaded = true;
    };
    img.src = article.banner;
  });
</script>

<a rel="prefetch" href="articles/{article.slug}" class="article">
  <div class="article__img">
    {#if loaded}
      <div
        class="article__large"
        style={`background-image: url(${article.banner})`}
      />
    {:else}
      <div
        transition:fade
        class="article__tiny"
        style={`background-image: url(${article.tiny})`}
      />
    {/if}
  </div>

  <a class="article__link" href="articles/{article.slug}" title={article.title}
    >{article.title}</a
  >
  <small class="article__readtime">{date} - {readTime.text}</small>
</a>

<style>
  .article {
    position: relative;
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    text-decoration: none;
  }

  .article__img {
    position: relative;
    width: 100%;
    height: calc(var(--listWidth) / 2);
  }

  .article__large {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 0;
  }

  .article__tiny {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 1;
  }

  @media only screen and (min-width: 640px) {
    .article {
      width: 50%;
    }

    .article__img {
      width: 100%;
      height: calc(var(--listWidth) / 5);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  @media only screen and (min-width: 768px) {
    .article {
      width: 33%;
    }

    .article__img {
      width: 100%;
      height: calc(var(--listWidth) / 7);
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  .article__link {
    position: relative;
    display: -webkit-box;
    font-size: 1.25rem;
    width: 100%;
    white-space: normal;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: 4rem;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .article__readtime {
    color: var(--gray-500);
  }
</style>
