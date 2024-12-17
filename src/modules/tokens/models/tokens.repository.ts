import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
    InjectModel,
    Model,
    QueryResponse,
    ScanResponse,
} from 'nestjs-dynamoose';

import { TokenKey, TokenModel } from './token.model';

export class TokensRepository {
    @InjectModel('Token')
    private readonly tokenModel: Model<TokenModel, TokenKey>;

    async softDelete(id: string): Promise<TokenModel> {
        return this.tokenModel.update({ id }, { deletedAt: new Date() });
    }

    async findNonDeleted(): Promise<ScanResponse<TokenModel>> {
        return this.tokenModel.scan().where('deletedAt').not().exists().exec();
    }

    async findById(id: string): Promise<TokenModel> {
        const tokens: QueryResponse<TokenModel> = await this.tokenModel
            .query('id')
            .eq(id)
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (tokens.length) {
            return tokens[0];
        }

        return null;
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
            .and()
            .where('deletedAt')
            .not()
            .exists()
            .exec();

        if (!tokens.length) {
            return null;
        }

        return tokens[0];
    }

    async create(refreshToken: string, userId: string): Promise<TokenModel> {
        return this.tokenModel.create({
            id: crypto.randomUUID(),
            refreshToken,
            userId,
        });
    }

    async update(refreshToken: string, userId: string): Promise<TokenModel> {
        return this.tokenModel.update({
            refreshToken,
            userId,
        });
    }
}
