<script>
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Chatbot from '$lib/components/Chatbot.svelte';
</script>

<Nav />
<main id="main">
  <slot />
</main>
<Footer />
<Chatbot />
