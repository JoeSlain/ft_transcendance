import { User } from "src/database/entities/User";

// done type for serializer
export type Done = (err: Error, user: User) => void;

// user details for db query
export type UserDetails = {
    username: string;
    email: string;
    id42: number;
    img_url: string;
}

/* NOTIF
** header = [
    'Friend Request',
    'Game Invite',
    'Delete Friend',
    ]
** acceptEvent = [
    'acceptFriendRequest',
    'acceptGameInvite',
    ]
** declineEvent = [
    'declineFriendRequest',
    'declineGameInvite',
    null
    ]
*/

export type NotifData = {
    type: string,
    from: User,
    to: User,
}