<script lang="typescript">
  // Importing components
  import { Logotype } from 'src/design';

  // Stores
  import { page } from '$app/stores';

  let links = [
    {
      title: 'Бейджики',
      url: 'badges',
    },
    {
      title: 'Брендинг',
      url: 'branding'
    },
    {
      title: 'Кнопки',
      url: 'buttons',
    },
    {
      title: 'Карточки',
      url: 'cards'
    },
    {
      title: 'Иконки',
      url: 'icons'
    },
    {
      title: 'Композиция',
      url: 'layout'
    },
    {
      title: 'UniversalText',
      url: 'text'
    },
    {
      title: 'Типография',
      url: 'typography'
    }
  ];
</script>

<!-- Header -->
<div class="absolute top-0 w-full bg-gray-900 flex items-center py-4 px-6">
  <!-- Logotype -->
  <div class="w-6 h-6 flex items-center justify-center">
    <Logotype type="icon" />
  </div>

  <!-- Links -->
  <div class="w-auto ml-2 flex items-center">
    { #each links as link }
      <div class="px-3 py-1.5 rounded-md { $page.path.includes(link.url) ? 'bg-indigo-500 hover:bg-opacity-60' : 'hover:bg-gray-800' } mx-2">
        <a href="/design/{ link.url }" class="text-white opacity-90 text-sm">{ link.title }</a>
      </div>
    { /each }
  </div>
</div>

<!-- Content -->
<div class="pt-24 px-6">
  <slot />
</div>