import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Book } from 'src/types/models';
import { PaginatedBooks } from 'src/types/models/content/Book/PaginatedBooks.model';

@Resolver(of => PaginatedBooks)
export class PaginatedBooksResolver {
  @ResolveField('docs', returns => [Book])
  public resolveDocs(@Parent() pagination: PaginatedBooks): Book[] {
    return pagination.docs;
  }
};