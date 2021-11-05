<script lang="typescript">
  // Importing modules
  import { onMount } from 'svelte';

  import { page } from '$app/stores';
  import { CurrentBook } from '$stores/reader';
  import { Viewer } from 'src/design';

  // Importing types
  import type { EUniversalTextType, IUniversalText } from '@app/shared';
  import { ENodeType } from '@app/shared';

  const text: IUniversalText = { 
    version: -1,
    type: 'TEXT' as EUniversalTextType,
    nodes: [],
  };

  // Subscribing to CurrentBook store
  CurrentBook.subscribe((book) => {
    if (!book.book) return;

    if (!text.nodes[0] || text.nodes[0] && text.nodes[0].type != ENodeType.BOOK_REVIEW) {
      // Adding BookReview section
      text.nodes = [
        {
          type: ENodeType.BOOK_REVIEW,
          book: book.book,
        },
      ];
    };

    if (book.chapters) {
      // Adding other nodes to list
      const content = book.chapters[0].content as IUniversalText;
      text.nodes = [...text.nodes, { type: ENodeType.CHAPTER_TITLE, chapter: book.chapters[0] }, ...content.nodes];
    };
  });
</script>

<!-- UniversalTextViewer -->
<Viewer input={text.nodes} />