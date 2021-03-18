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
      imgEl.style.backgroundImage = `url(${article.banner})`;
    };
    img.src = article.banner;
  });
</script>

<a rel="prefetch" href="articles/{article.slug}" class="article">
  <div
    id={`${id}`}
    class="article__img"
    style={`background-image: url(${article.tiny})`}
  />

  <a class="article__link" href="articles/{article.slug}" title={article.title}
    >{article.title}</a
  >
  <small class="article__readtime">{readTime.text}</small>
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
    width: 100%;
    height: calc(var(--listWidth) / 2);
    transition: background-image ease-in-out 0.3s;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
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
  }

  .article__readtime {
    color: var(--gray-500);
  }
</style>
