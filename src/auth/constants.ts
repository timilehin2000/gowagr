// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

export const jwtConstants = {
  jwt_secret: process.env.JWT_SECRET,
};
