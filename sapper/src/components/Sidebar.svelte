<script lang="ts">
  import { fly, fade } from "svelte/transition";
  import DarkModeToggle from "./DarkModeToggle.svelte";

  export let segment: string;
  export let show: boolean;

  function closeSidebar() {
    show = false;
  }
</script>

{#if show}
  <button
    class="close"
    transition:fade={{ duration: 300 }}
    on:click={closeSidebar}
  />

  <nav transition:fly={{ x: -300, opacity: 1, duration: 300 }} class="sidebar">
    <div class="sidebar__toggle">
      <DarkModeToggle />
    </div>
    <a
      class={segment === undefined ? "selected" : ""}
      href="."
      on:click={closeSidebar}>home</a
    >
    <a
      class={segment === "about" ? "selected" : ""}
      href="about"
      on:click={closeSidebar}>about</a
    >
    <a
      rel="prefetch"
      class={segment === "articles" ? "selected" : ""}
      href="articles"
      on:click={closeSidebar}>articles</a
    >
  </nav>
{/if}

<style>
  .sidebar {
    position: fixed;
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 40%;
    background-color: var(--white);
    z-index: 200;
    box-shadow: var(--shadow);
    border-right: 1px var(--gray-500) solid;
    font-family: Rubik, sans-serif;
    text-transform: uppercase;
    font-weight: 700;
  }

  :global(.dark .sidebar) {
    background-color: var(--dark-gray-900);
    border-right: 1px var(--gray-800) solid;
  }

  .sidebar__toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 6rem;
    width: 100%;
  }

  .close {
    background-color: var(--black);
    opacity: 0.25;
    border: none;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    z-index: 150;
  }

  a {
    width: 100%;
    color: inherit;
    text-decoration: none;
    padding: 10px 5px;
    display: block;
    position: relative;
  }
  a:not(.selected) {
    opacity: 0.7;
  }
  a::before {
    content: "";
    position: absolute;
    transition: transform 0.3s ease;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: var(--gray-500);
    transform: scaleX(0);
  }
  a:hover::before,
  .selected::before {
    transform: scaleX(1);
  }
  .selected::before {
    background: var(--upsdell-red-500);
  }
</style>
