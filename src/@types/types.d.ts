// Source - https://stackoverflow.com/a
// Posted by Bruno Bastos, modified by community. See post 'Timeline' for change history
// Retrieved 2025-12-06, License - CC BY-SA 4.0

declare namespace Express {
  export interface Request {
    user?: UserEntity & { token: string };
  }
  export interface Response {
    user?: UserEntity & { token: string };
  }
}
