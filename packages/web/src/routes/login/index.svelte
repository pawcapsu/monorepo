<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  import axios from 'axios';

  onMount(() => {
    const token = $page.query.get('token');
    $page.query.set('token', '');
    
    axios.get(`http://localhost:3001/login/${token}`)
    .then(res => res.data)
    .then((data) => {
      if (data._id != null) {
        goto('/');
      };
    });
  });
</script>

<main class="w-full h-screen bg-gray-900 flex justify-center items-center py-16">
  <div class="w-1/3 px-12 h-full rounded-xl flex flex-col bg-white items-center justify-center">
    <h1 class="text-2xl text-black font-medium">Авторизовываем...</h1>
    <p class="text-black text-sm opacity-80">Авторизовываем Вас в Ваш аккаунт пакапсу...</p>
  </div>
</main>