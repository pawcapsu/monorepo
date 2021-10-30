<script lang="typescript">
  // Importing components
  import { Heading, Paragraph, DesignStory } from 'src/design';

  import headingSizes from 'src/design/typography/Heading/properties/Sizes';
  import paragraphSizes from 'src/design/typography/Paragraph/properties/Sizes';

  // -colors
  import colors from 'src/design/typography/properties/Colors';

  let components = [
    {
      name: "Заглавный текст",
      description: "",
      component: Heading,
      properties: [
        {
          id: "color",
          description: "Цвет",
          values: colors,
          color: 'white',
        },
        {
          id: "size",
          description: "Размер",
          values: headingSizes,
          color: 'white',
        }
      ]
    },
    {
      name: "Текст параграфа",
      description: "",
      component: Paragraph,
      properties: [
        {
          id: "color",
          description: "Цвет",
          values: colors,
          color: 'white',
        },
        {
          id: "size",
          description: "Размер",
          values: paragraphSizes,
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