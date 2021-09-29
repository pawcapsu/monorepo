import { UNodeEntity } from '@app/shared';
import { Injectable } from '@nestjs/common';
import { ObjectId } from '@pawcapsu/types';
import { Book, UniversalText } from '@pawcapsu/types/models';

@Injectable()
export class UserPermissionsService {
  // +todo
  public async _checkWritePermissions(
    userId: ObjectId,
    entity: Book,
  ): Promise<boolean> {
    // +todo
    if (entity.creator == userId) {
      return true
    } else {
      return false;
    };
  };

  // +todo
  public async _checkTextWritePermissions(
    userId: ObjectId,
    entity: UniversalText,
  ): Promise<boolean> {
    // +todo
    return true
  };
};