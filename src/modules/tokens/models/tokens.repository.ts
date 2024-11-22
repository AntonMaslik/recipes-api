import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel, Model, ScanResponse } from 'nestjs-dynamoose';

import { TokenKey, TokenModel } from './token.model';

export class TokensRepository {
    @InjectModel('Token')
    private tokenModel: Model<TokenModel, TokenKey>;

    async softDelete(id: string): Promise<TokenModel> {
        const now: Date = new Date();
        return this.tokenModel.update({ id }, { deletedAt: now });
    }

    async findNonDeleted(): Promise<ScanResponse<TokenModel>> {
        return await this.tokenModel
            .scan()
            .where('deletedAt')
            .not()
            .exists()
            .exec();
    }

    async findById(id: string): Promise<TokenModel> {
        const token: TokenModel = await this.tokenModel.get({ id });

        if (token && token.deletedAt !== null) {
            return null;
        }
        return token;
    }

    async findTokensByHashCompare(
        refreshToken: string,
        tokens: TokenModel[],
    ): Promise<TokenModel[]> {
        const result = [];

        for (const token of tokens) {
            const status: boolean = await bcrypt.compare(
                refreshToken,
                token.refreshToken,
            );
            if (status) {
                result.push(token);
            }
        }

        return result;
    }

    async findByHash(refreshToken: string): Promise<TokenModel> {
        const tokens: TokenModel[] = await this.findNonDeleted();

        const findTokensByHashCompare: TokenModel[] =
            await this.findTokensByHashCompare(refreshToken, tokens);

        if (!findTokensByHashCompare.length) {
            throw new NotFoundException('Tokens hash not find!');
        }

        return findTokensByHashCompare[0];
    }

    async findByToken(refreshToken: string): Promise<TokenModel> {
        const tokens: ScanResponse<TokenModel> = await this.tokenModel
            .scan()
            .where('refreshToken')
            .eq(refreshToken)
            .exec();

        if (tokens.length === 0) {
            return null;
        }

        const token: TokenModel = tokens[0];

        if (token.deletedAt) {
            return null;
        }

        return token;
    }

    async create(refreshToken: string, userId: string): Promise<TokenModel> {
        return this.tokenModel.create({
            refreshToken,
            userId,
        });
    }

    async update(refreshToken: string, userId: string): Promise<TokenModel> {
        return await this.tokenModel.update({
            refreshToken,
            userId,
        });
    }
}
