// to make the file a module and avoid the TypeScript error
//export type {};

//declare global {
//namespace Express {
// export interface Request {
/* ************************************************************************* */
// Add your custom properties here, for example:
//
// user?: { ... }

/* ************************************************************************* */
// }
// }
//

import "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: number;
      isAdmin: boolean;
    };
  }
}
