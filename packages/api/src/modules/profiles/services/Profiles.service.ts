import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../../../types/models';
import { IProfile } from '@pawcapsu/shared/src';
import * as mongoose from 'mongoose';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel('profile') private profileModel: Model<ProfileDocument>,
  ) {}

  // 
  // findProfile
  async findProfile(id?: string | mongoose.Schema.Types.ObjectId): Promise<Profile | undefined> {
    const _id = typeof id === "string" ? mongoose.Types.ObjectId(id) : id;
    return await this.profileModel.findOne({ _id: id  });
  };

  // testAddProfile
  async testAddProfile(uid: string): Promise<Profile> {
    const profile = new this.profileModel(<IProfile>{ uid, email: 'soglacen@gmail.com', username: 'juiipup' });
    return await profile.save();
  };
};