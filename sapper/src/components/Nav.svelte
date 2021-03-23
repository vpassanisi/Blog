<script lang="ts">
  import DarkModeToggle from "./DarkModeToggle.svelte";
  import Sidebar from "./Sidebar.svelte";
  import { darkMode } from "../store/darkMode";
  import { onMount } from "svelte";

  let scroll: number;
  export let segment: string;
  let show = false;

  function toggleSidebar() {
    show = !show;
  }

  onMount(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")
      .matches;

    prefersDark ? darkMode.turnOn() : null;

    const root = document.documentElement;

    function opFunc() {
      if (segment !== undefined)
        return root.style.setProperty("--bg-opacity", "1");
      let op = scroll / 150;
      op > 1 ? (op = 1) : null;
      root.style.setProperty("--bg-opacity", op.toString());
    }

    window.onscroll = () => {
      scroll = document.documentElement.scrollTop;

      opFunc();
    };
  });
</script>

<nav>
  <div class="nav__container">
    <a class={segment === undefined ? "selected" : ""} href=".">home</a>
    <a class={segment === "about" ? "selected" : ""} href="about">about</a>
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      class="nav__logo"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35.0273 11.759L19.3923 51.466L4.22932 11.759H6.64832L19.4513 47.867L32.9033 11.759H35.0273ZM60.6071 22.438C60.6071 26.214 59.5254 28.9477 57.3621 30.639C55.1987 32.291 51.9144 33.117 47.509 33.117H42.14V52.056H40.193V11.759H47.45C49.8494 11.759 51.698 11.877 52.996 12.113C54.3334 12.3097 55.6117 12.8407 56.831 13.706C59.3484 15.5153 60.6071 18.426 60.6071 22.438ZM58.4241 22.733C58.4241 21.0417 58.1487 19.5667 57.598 18.308C57.0474 17.01 56.2607 15.9677 55.238 15.181C54.2547 14.355 53.055 13.824 51.639 13.588C50.2624 13.352 48.276 13.234 45.68 13.234H42.14V31.642H45.68C50.2034 31.642 53.35 31.1307 55.12 30.108C57.3227 28.8493 58.4241 26.391 58.4241 22.733Z"
      />
    </svg>
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
    height: 6rem;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, var(--bg-opacity));
  }

  :global(.dark nav) {
    background-color: rgba(18, 18, 18, var(--bg-opacity));
  }

  .nav__container {
    display: none;
    width: 90%;
    height: 80%;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    font-family: Rubik, sans-serif;
    font-weight: 700;
    text-transform: uppercase;
    border-top: 1px var(--gray-500) solid;
    border-bottom: 1px var(--gray-500) solid;
  }

  .nav__mobile {
    display: flex;
    width: 90%;
    height: 60%;
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

  .nav__logo {
    fill: currentColor;
    height: 100%;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
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
    margin-left: 1rem;
    margin-right: 1rem;
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
