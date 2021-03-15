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
      bannerEl.style.backgroundImage = `url(${article.banner}`;
    };
    img.src = article.banner;
  });

  onDestroy(() => clearInterval(scrollIntervalID));
</script>

<svelte:head>
  <title>{article.title}</title>
</svelte:head>

<div
  id="banner"
  class="banner"
  style={`background-image: url("${article.tiny}");`}
/>

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
    width: 100%;
    height: 35vw;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-top: 70px;
    transition: background-image 0.2s ease-in-out;
  }

  .content {
    position: relative;
    z-index: 10;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
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

  .content__date {
    font-size: 1rem;
    color: var(--gray-700);
  }
</style>
