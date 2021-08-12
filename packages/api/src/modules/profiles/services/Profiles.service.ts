import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../../../types/models';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('profile') private profileModel: Model<ProfileDocument>,
  ) {}

  // 
  // findProfile
  async findProfile(userId?: string, email?: string): Promise<Profile | undefined> {
    return await this.profileModel.findOne({ email: email });
  };

  // testAddProfile
  async testAddProfile(uid: string): Promise<Profile> {
    const profile = new this.profileModel({ uid, email: 'soglacen@gmail.com' });
    return await profile.save();
  };
};