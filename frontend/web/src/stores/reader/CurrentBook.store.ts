// Importing modules
import { writable } from 'svelte/store';

// Importing types
import type { IBook, IBookChapter, IUniversalText } from '@app/shared';

// Importing services
import { BookService } from '$services/book';

// Exporting CurrentBook store interface 
export interface CurrentBookStore {
  title: string,
  description: IUniversalText,
  chapters: Array<IBookChapter>,
  book: IBook,
};

// Function to initialize CurrentBook store
function CurrentBookStoreInit() {
  const defaultStore: Partial<CurrentBookStore> = {};
  const { update, subscribe } = writable(defaultStore);

  return {
    subscribe,

    // fetchInfo
    async fetchInfo(bookId: string) {
      // Fetch book
      const book = await BookService.get(bookId);

      // Updating store
      update((object) => {
        object.title = book.title;
        object.description = book.description;
        object.chapters = book.chapters;

        object.book = book;

        return object;
      });
    },

    clear() {
      update(() => {
        return {};
      })
    }
  };
};

// Exporting create CurrentBook store
export const CurrentBook = CurrentBookStoreInit();
