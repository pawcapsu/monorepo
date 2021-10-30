<script lang="typescript">
  // Importing components
  import { BookCard, DesignStory } from 'src/design';

  import types from 'src/design/cards/BookCard/properties/Types';
  import sizes from 'src/design/cards/BookCard/properties/Sizes';

  let components = [
    {
      name: "Книга",
      description: "",
      component: BookCard,
      properties: [
        {
          id: "type",
          description: "Тип карточки",
          values: types,
          color: 'white',
        },
        {
          id: "size",
          description: "Размер карточки",
          values: sizes,
          color: 'white',
        }
      ],
      attributes: {
        book: {
          "title": "Test Book",
          "creator": {
            "_id": "61163d119b31edce0323541d",
            "username": "juiipup",
            "__typename": "Profile"
          },
          "tags": [
            {
              "icon": null,
              "title": "Test tag",
              "color": "bg-indigo-500",
            }
          ],
          "bookSize": 479,
          "description": {
            "nodes": [
              {
                "type": "TEXT",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
              },
              {
                "type": "TEXT",
                "content": "Вау вау вау! Круто круто круто да!"
              },
              {
                "type": "PICTURE",
                "url": "https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F28%2F2020%2F10%2F13%2Fcorgi-dog-POPDOGNAME1020.jpg",
                "caption": "Image of a dog!"
              }
            ],
          },
        },
      },
    },
  ];
</script>

<!-- Introduction -->
<div class="my-4">

</div>

<DesignStory components={components} componentSpace="full" />