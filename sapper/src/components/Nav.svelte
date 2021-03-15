<script lang="ts">
  export let segment: string;
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
  </div>
</nav>

<style>
  nav {
    position: fixed;
    width: 100%;
    height: 70px;
    top: 0;
    z-index: 100;
    background-color: white;
    border-bottom: 1px var(--gray-300) solid;
  }

  .nav__container {
    width: 90%;
    height: 100%;
    align-items: flex-end;
    display: flex;
    flex-direction: row;
    margin-left: auto;
    margin-right: auto;
    font-family: Rubik, sans-serif;
    font-weight: 700;
    justify-content: flex-end;
    align-items: center;
    text-transform: uppercase;
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
    background: #aaa;
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
