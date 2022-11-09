import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-identicon-sprites';


export default function avatarGenerator() : string
{
    return createAvatar(style, {});
}