<script lang="ts">
  let md = "";
  let auth = "";
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
        mutation Input(\$md: String!) {
          newPost(md: \$md) {
            title
          }
        }
        `,
        variables: {
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
  <textarea bind:value={md} class="admin__md" />
  <input bind:value={auth} class="admin__auth" type="text" />
  <button on:click={addPost} class="admin__add">Add</button>
</section>

<style>
  .admin {
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .admin__md {
    width: 80%;
    height: 80%;
    border: #333 1px solid;
    padding: 0.5rem;
  }

  .admin__md:focus {
    outline: none;
  }

  .admin__auth {
    width: 80%;
    padding: 0.5rem;
    margin-top: 1rem;
    border: #333 1px solid;
  }

  .admin__auth:focus {
    outline: none;
  }

  .admin__add {
    margin-top: 1rem;
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    background-color: var(--blue-200);
  }
</style>
