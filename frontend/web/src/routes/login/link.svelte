<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  import { Config } from '$config/index';

  onMount(() => {
    // +todo move this id to env variable?
    const resourceId = "617a552cb4a7bfad0b9a1b54";
    goto(`https://cloud.odzi.dog/auth/v1/${resourceId}`);
  });
</script>

<main class="w-full h-screen bg-gray-900 flex justify-center items-center py-16">
  <div class="w-1/3 px-12 h-full rounded-xl flex flex-col bg-white items-center justify-center">
    <h1 class="text-2xl text-black font-medium">Перекидываем...</h1>
    <p class="text-black text-sm opacity-80">Перекидываем Вас на страничку авторизации...</p>
  </div>
</main>