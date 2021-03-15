<script lang="ts">
  import readingTime from "reading-time";
  import { onMount } from "svelte";
  import type { Post } from "../../../posts/controllers/types";

  export let article: Post;
  const id = Math.random();

  const readTime = readingTime(article.markdown);

  onMount(() => {
    const imgEl = document.getElementById(`${id}`);

    const img = new Image();
    img.onload = () => {
      imgEl.style.backgroundImage = `url(${article.banner}`;
    };
    img.src = article.banner;
  });
</script>

<div class="article">
  <div
    id={`${id}`}
    class="article__img"
    style={`background-image: url(${article.tiny})`}
  />

  <a class="article__link" rel="prefetch" href="articles/{article.slug}"
    >{article.title}</a
  >
  <small class="article__readtime">{readTime.text}</small>
</div>

<style>
  .article {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 20vw;
  }

  .article__img {
    width: 100%;
    height: 70%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  .article__link {
    font-size: 1.25rem;
    font-weight: 700;
  }
</style>
