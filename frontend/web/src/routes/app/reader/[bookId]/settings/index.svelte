<script lang="typescript">
  // Importing modules
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  // onMount event
  onMount(() => {
    // Redirecting user to Book pane
    goto(`${$page.path}/book`);
  });
</script>