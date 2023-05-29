import {WagaResponse} from 'waga/dist/types';
import InternalErrors from '../../utils/internalErrors';
import { makeError } from '../../utils/object';

export function getBody(res:WagaResponse, body: any) {
    if (typeof body !== 'object' && body !== null)
        return makeError(res, 500, InternalErrors.INVALID_PARSE_BODY)
    return body;
}