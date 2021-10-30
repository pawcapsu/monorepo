<script lang="typescript">
  // Importing components
  import { Button, DesignStory } from 'src/design';

  // -types
  import types from 'src/design/buttons/properties/Types';
  
  // -sizes
  import sizes from 'src/design/buttons/properties/Sizes';
  
  let components = [
    {
      name: "Кнопка",
      description: "Один из главных элементов взаимодействия пользователя с страничкой.",
      component: Button,
      properties: [
        {
          id: "type",
          description: "Тип кнопки",
          values: types,
          color: 'white',
        },
        {
          id: "size",
          description: "Размер кнопки",
          values: sizes,
          color: 'white',
        }
      ]
    },
  ];
</script>

<!-- Introduction -->
<div class="my-4">

</div>

<DesignStory components={components} />