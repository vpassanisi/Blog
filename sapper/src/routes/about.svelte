<script lang="ts">
  import { onMount } from "svelte";

  onMount(() => {
    document.documentElement.style.setProperty("--bg-opacity", "1");
  });
</script>

<svelte:head>
  <title>About</title>
</svelte:head>

<section class="me">
  <div class="me__container">
    <div>
      <div
        class="me__img"
        style="background-image: url('https://i.imgur.com/85VTvVu.jpg')"
      />
    </div>

    <div>
      <h1>About Me</h1>
      <div>
        Hi, I'm Vincent Passanisi and I am a Software Engineer currently living
        in Santa Cruz, California. I started programming and writing code in
        2010, and I recieved my bachelor's in Audio Engineering and Technology
        in 2015. I learned HTML/CSS and JavaScript, and found myself creating
        web apps and eventually transitioning from audio engineering to full
        time web development. Since then, I have expanded my skills to include
        Go, Python, Vue, React and much more!
      </div>
    </div>
  </div>
</section>

<style>
  .me {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .me__container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 90%;
    max-width: 1024px;
  }

  .me__img {
    height: 10rem;
    width: 10rem;
    overflow: hidden;
    border-radius: 100%;
    background-position: right;
    background-size: cover;
    background-repeat: no-repeat;
    margin-right: 2rem;
  }
</style>
