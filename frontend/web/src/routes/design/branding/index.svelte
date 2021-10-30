<script lang="typescript">
  // Importing components
  import { Logotype, DesignStory } from 'src/design';

  let components = [
    {
      name: "Логотип",
      description: "",
      component: Logotype,
      properties: [
        {
          id: "type",
          description: "Тип логотипа",
          values: { full: {}, icon: {} },
          color: 'white',
        },
      ]
    },
  ];
</script>

<!-- Introduction -->
<div class="my-4">

</div>

<DesignStory components={components} />