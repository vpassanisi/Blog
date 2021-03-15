<script lang="ts">
  let md: string;
  let auth: string;
  let title: string;
  let slug: string = "";
  let banner: string;
  let excerpt: string;

  function updateSlug(): void {
    slug = this.value.split(" ").join("-");
  }

  async function addPost() {
    if (!md) return;
    const res = await fetch("/gql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        query: `
        mutation Input(\$slug: String!, \$title: String!, \$banner: String!, \$excerpt: String! \$md: String!) {
          newPost(slug: \$slug, title: \$title, banner: \$banner, excerpt: \$excerpt, md: \$md) {
            slug
          }
        }
        `,
        variables: {
          slug,
          title,
          banner,
          excerpt,
          md,
        },
      }),
    });

    console.log(await res.json());
  }
</script>

<svelte:head>
  <title>Admin</title>
</svelte:head>

<section class="admin">
  <div class="admin__container">
    <input
      bind:value={banner}
      class="container__banner"
      type="text"
      placeholder="banner . . ."
    />
    <div class="container__img" style={`background-image: url(${banner})`} />
    <div class="container__slug">Slug: {slug}</div>
    <input
      on:input={updateSlug}
      bind:value={title}
      class="container__title"
      type="text"
      placeholder="title . . ."
    />
    <textarea
      bind:value={excerpt}
      class="container__excerpt"
      placeholder="excerpt . . ."
    />
    <textarea
      bind:value={md}
      class="container__md"
      placeholder="markdown . . ."
    />
    <input
      bind:value={auth}
      class="container__auth"
      type="text"
      placeholder="auth . . ."
    />
    <button on:click={addPost} class="container__add">Add</button>
  </div>
</section>

<style>
  :global(body) {
    background-color: var(--blue-gray-50);
  }

  .admin {
    margin-top: 70px;
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

  .container__banner {
    width: 100%;
    border: none;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  .container__banner:focus {
    outline: none;
  }

  .container__img {
    margin-bottom: 1rem;
    width: 100%;
    height: 35vw;
    background-position: center;
    background-size: cover;
  }

  .container__slug {
    width: 100%;
    background-color: white;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  .container__title {
    width: 100%;
    border: none;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  .container__title:focus {
    outline: none;
  }

  .container__excerpt {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    height: 80%;
    padding: 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .container__excerpt:focus {
    outline: none;
  }

  .container__md {
    width: 100%;
    max-width: 100%;
    min-width: 100%;
    height: 80%;
    padding: 0.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
  }

  .container__md:focus {
    outline: none;
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

  .container__add {
    margin-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    background-color: var(--blue-200);
  }
</style>
