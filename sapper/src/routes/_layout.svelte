<script lang="ts">
  import Nav from "../components/Nav.svelte";

  export let segment: string;
</script>

<Nav {segment} />

<main>
  <slot />
</main>

<style>
  main {
    position: relative;
    padding: 0;
    margin: 70px auto;
    box-sizing: border-box;
  }
</style>
