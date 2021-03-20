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
            slug: params.slug,
          },
        }),
      });

      const { data, errors } = await res.json();

      if (errors) throw Error(errors[0].message);

      const article = data.posts[0];

      return { article };
    } catch (error) {
      console.log(error);
      this.error(res.status, error);
    }
  }
</script>

<script lang="ts">
  import * as marked from "marked";
  import prism from "prismjs";
  import readingTime from "reading-time";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import type { Post } from "../../../../posts/controllers/types";

  export let article: Post;

  let bannerEl: HTMLElement;
  let scroll: number;
  let scrollIntervalID: number;

  const date = new Date(article.created * 1000).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const readTime = readingTime(article.markdown);

  const renderer = new marked.Renderer();
  const linkRenderer = renderer.link;
  renderer.link = (href, title, text) => {
    const html = linkRenderer.call(renderer, href, title, text);

    if (href.indexOf("/") === 0) {
      // Do not open internal links on new tab
      return html;
    } else if (href.indexOf("#") === 0) {
      // Handle hash links to internal elements
      const html = linkRenderer.call(renderer, "javascript:;", title, text);
      return html.replace(
        /^<a /,
        `<a onclick="document.location.hash='${href.substr(1)}';" `
      );
    }

    return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
  };

  renderer.code = (code, language) => {
    const parser = prism.languages[language] || prism.languages.html;
    const highlighted = prism.highlight(code, parser, language);
    return `<pre class="language-${language}"><code class="language-${language}">${highlighted}</code></pre>`;
  };

  marked.setOptions({ renderer });
  const md = marked.default(article.markdown);

  let loaded = false;

  onMount(() => {
    bannerEl = document.getElementById("banner");
    document.addEventListener("scroll", () => {
      scroll = document.documentElement.scrollTop;
    });

    function animateStuff() {
      bannerEl.style.transform = `translate3d(0px, ${(scroll / 2).toFixed(
        2
      )}px, 0px)`;
    }

    scrollIntervalID = setInterval(() => {
      if (window.innerWidth < 768) return;
      window.requestAnimationFrame(animateStuff);
    }, 16);

    const img = new Image();
    img.onload = () => {
      loaded = true;
    };
    img.src = article.banner;
  });

  onDestroy(() => clearInterval(scrollIntervalID));
</script>

<svelte:head>
  <title>{article.title}</title>
  <!--  Include canonical links to your blog -->
  <!--   <link rel="canonical" href="" /> -->

  <!-- Validate your twitter card with https://cards-dev.twitter.com/validator  -->
  <!-- Update content properties with your URL   -->
  <!-- 	<meta property="og:url" content=""} /> -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content={article.title} />
  <meta name="Description" content={article.excerpt} />
  <meta property="og:description" content={article.excerpt} />

  <!--  Link to your preferred image  -->
  <meta property="og:image" content={article.banner} />

  <meta name="twitter:card" content="summary_large_image" />

  <!--  Link to your Domain  -->
  <!-- 	<meta name="twitter:domain" value="" /> -->

  <!--  Link to your Twitter Account  -->
  <meta name="twitter:creator" value="https://twitter.com/VinnyPassanisi" />

  <meta name="twitter:title" value={article.title} />
  <meta name="twitter:description" content={article.excerpt} />

  <!--  Link to your preferred image to be displayed on Twitter (832x520px) -->
  <!-- 	<meta name="twitter:image" content="" /> -->

  <meta name="twitter:label1" value="Published on" />
  <meta
    name="twitter:data1"
    value={new Date(article.created).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })}
  />
  <meta name="twitter:label2" value="Reading Time" />
  <meta name="twitter:data2" value={readTime.text} />
</svelte:head>

<div id="banner" class="banner">
  {#if loaded}
    <div
      class="banner__large"
      style={`background-image: url("${article.banner}");`}
    />
  {:else}
    <div
      transition:fade
      class="banner__tiny"
      style={`background-image: url("${article.tiny}");`}
    />
  {/if}
</div>

<section class="content">
  <article class="content__container">
    <h1 class="content__title">{article.title}</h1>
    <p class="content__excerpt">{article.excerpt}</p>
    <p class="content__date">{date} ~ {readTime.text}</p>
    <div class="content__article">
      {@html md}
    </div>
  </article>
</section>

<style>
  .banner {
    position: relative;
    width: 100%;
    height: 35vw;
  }

  .banner__large {
    position: absolute;
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    z-index: 0;
  }

  .banner__tiny {
    position: absolute;
    height: 100%;
    width: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    z-index: 1;
  }

  .content {
    position: relative;
    z-index: 10;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :global(.dark .content) {
    background-color: var(--dark-gray-900);
  }

  .content__container {
    display: inline-block;
    width: 90%;
    max-width: 680px;
  }

  .content__title {
    margin-top: 3rem;
    text-align: center;
  }

  .content__excerpt {
    color: var(--gray-600);
  }

  :global(.dark .content__excerpt) {
    color: var(--gray-400);
  }

  .content__date {
    font-size: 1rem;
    color: var(--gray-700);
  }

  :global(.dark .content__date) {
    color: var(--gray-500);
  }
</style>
