<script lang="typescript">
  // Importing modules
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(() => {
    goto('/app/place/explore');
  });
</script>