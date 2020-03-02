import { CommentPost } from './CommentPost';

export interface Post{
    nameUser: string;
    srcPhotoUser: string;
    uidUser: string;
    srcPhotoPost: string;
    likes: number;
    uidComments: string[]; 
    description?: string;
    featuredComment: CommentPost;
}