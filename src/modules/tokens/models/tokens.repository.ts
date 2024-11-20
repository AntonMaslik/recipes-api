import { InjectModel, Model } from 'nestjs-dynamoose';
import { TokenKey, TokenModel } from './token.model';

export class TokensRepository {
  @InjectModel('Token')
  private tokenModel: Model<TokenModel, TokenKey>;

  async softDelete(id: string): Promise<void> {
    const now = new Date();
    await this.tokenModel.update({ id }, { deletedAt: now });
  }

  async findNonDeleted(): Promise<any[]> {
    return await this.tokenModel.scan().where('deletedAt').eq(null).exec();
  }

  async findById(id: string): Promise<any> {
    const token = await this.tokenModel.get({ id });

    if (token && token.deletedAt !== null) {
      return null;
    }
    return token;
  }

  async findByToken(refreshToken: string): Promise<any> {
    const tokens = await this.tokenModel
      .scan('refreshToken')
      .eq(refreshToken)
      .exec();

    if (tokens.length == 0) {
      return null;
    }

    const token = tokens[0];

    if (token && token.deletedAt !== null) {
      return null;
    }

    return token;
  }

  async create(refreshToken: string, userId: string) {
    return await this.tokenModel.create({
      refreshToken,
      userId,
    });
  }

  async update(refreshToken: string, userId: string) {
    return await this.tokenModel.update({
      refreshToken,
      userId,
    });
  }
}
