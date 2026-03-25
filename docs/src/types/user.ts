export interface User {
    id: string;
    email: string;
    urlAvatar?: string;
    username: string;
    firstName: string;
    roles: string;
    permissions: string[];
}