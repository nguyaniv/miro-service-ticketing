import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { validateRequest, BadRequestError } from '@yystickets/common';
import { User } from '../models/user';
import { Password } from '../services/password';
const router = Router();
router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('you must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials no user');
    }
    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    console.log('is match?: ', passwordsMatch);

    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials password not match');
    }

    // Generate JWT

    const userJtw = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    // Store it on session object
    req.session = {
      jwt: userJtw,
    };
    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
