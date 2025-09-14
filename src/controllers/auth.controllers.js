import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import { ApiResponse } from "../utils/api-response.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
    throw new ApiError(
      500,
      "🔴 Something went wrong while generating access-token."
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // receive data
  const { password, role, username, email } = req.body;

  // validate
  const existingUser = await UserModel.findOne({
    $or: [{ username }, { email }], // if username OR password exists
  });

  if (existingUser) {
    throw new ApiError(
      409,
      "🔴ERR. User with email/username already exists.",
      []
    );
  }

  // create user
  const user = await UserModel.create({
    email,
    password,
    username,
    isEmailVerified: false,
  });

  // get the schema-methods
  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();
  user.emailVerificationToken = hashedToken;
  user.enmailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  // send email
  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailGenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get(
        "host"
      )}/api/v1/users/verify-email/${unHashedToken}`
    ),
  });

  // send limited-amount of data
  const createdUser = await UserModel.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "🔴ERR. Something went wrong while registering an user"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        { user: createdUser },
        "User registered successfully and verification email has been sent on your email✅"
      )
    );
});

export { registerUser };
