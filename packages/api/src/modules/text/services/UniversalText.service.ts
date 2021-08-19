import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UniversalText, UniversalTextDocument } from 'src/types/models';

@Injectable()
export class UniversalTextService {
  constructor(
    @InjectModel('universalText')
    private readonly textModel: Model<UniversalTextDocument>,
  ) {}



};