<script lang="ts">
  import DarkModeToggle from "./DarkModeToggle.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { darkMode } from "../store/darkMode";
  import { onMount } from "svelte";

  export let segment: string;
  let show = false;

  function toggleSidebar() {
    show = !show;
  }

  onMount(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
      .matches;

    prefersDark ? darkMode.turnOn() : null;
  });
</script>

<nav>
  <div class="nav__container">
    <a class={segment === undefined ? "selected" : ""} href=".">home</a>
    <a class={segment === "about" ? "selected" : ""} href="about">about</a>
    <a
      rel="prefetch"
      class={segment === "articles" ? "selected" : ""}
      href="articles">articles</a
    >

    <DarkModeToggle />
  </div>
  <div class="nav__mobile">
    <button class="nav__button" on:click={toggleSidebar}>
      <svg
        version="1.1"
        class="nav__svg"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 50 50"
        xml:space="preserve"
      >
        <path
          d="M8.667,15h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,15,8.667,15z"
        />
        <path
          d="M8.667,37h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,37,8.667,37z"
        />
        <path
          d="M8.667,26h30c0.552,0,1-0.447,1-1s-0.448-1-1-1h-30c-0.552,0-1,0.447-1,1S8.114,26,8.667,26z"
        />
      </svg>
    </button>
  </div>
</nav>
<Sidebar {segment} bind:show />

<style>
  nav {
    position: fixed;
    width: 100%;
    height: 60px;
    top: 0;
    z-index: 100;
    background-color: white;
    border-bottom: 1px var(--gray-300) solid;
  }

  :global(.dark nav) {
    background-color: var(--dark-gray-900);
    border-bottom: 1px var(--gray-700) solid;
  }

  .nav__container {
    display: none;
    width: 90%;
    height: 100%;
    align-items: flex-end;
    flex-direction: row;
    margin-left: auto;
    margin-right: auto;
    font-family: Rubik, sans-serif;
    font-weight: 700;
    justify-content: flex-end;
    align-items: center;
    text-transform: uppercase;
  }

  .nav__mobile {
    display: flex;
    width: 90%;
    height: 100%;
    align-items: flex-end;
    flex-direction: row;
    margin-left: auto;
    margin-right: auto;
    justify-content: flex-end;
    align-items: center;
  }

  @media only screen and (min-width: 768px) {
    .nav__container {
      display: flex;
    }

    .nav__mobile {
      display: none;
    }
  }

  .nav__button {
    height: 100%;
    width: auto;
    background-color: transparent;
    border: none;
  }

  .nav__svg {
    height: 100%;
    width: auto;
    fill: currentColor;
  }

  :global(.dark .nav__svg) {
    color: var(--white);
  }

  a {
    color: inherit;
    text-decoration: none;
    padding: 10px 5px;
    display: block;
    position: relative;
    margin-left: 20px;
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
