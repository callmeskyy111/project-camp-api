import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail.js";
import { ApiResponse } from "../utils/api-response.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

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

// register controller

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

// login controller
const loginUser = asyncHandler(async (req, res) => {
  // email based login
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "⚠️Email is required!");
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError(400, "🔴ERR. User does not exist!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "🔴ERR. Invalid credentials!");
  }

  // generate token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // send limited-amount of data
  const loggedInUser = await UserModel.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  // setting tokens on the cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged-in successfully ✅"
      )
    );
});

// logOut controller

const logoutUser = asyncHandler(async (req, res) => {
  await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshTokens", options)
    .json(new ApiResponse(200, {}, "User logged out! ✅"));
});

// GET current user
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched ✅"));
});

// Verify email
const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ApiError(400, "⚠️ Email verification token is missing!");
  }

  // hash again
  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // search user based on the hashedToken
  const user = await UserModel.findOne({
    emailVerificationToken: hashedToken,
    enmailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "🔴 Token is invalid or expired!");
  }

  user.emailVerificationToken = undefined;
  user.enmailVerificationExpiry = undefined;

  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, { isEmailVerified: true }, "Email is verified ✅")
    );
});

// resend email-verification
const resendEmailVerification = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "🔴 User Does Not Exist!");
  }

  if (user.isEmailVerified) {
    throw new ApiError(409, "⚠️ Email is already verified!");
  }

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

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your email ✅"));
});

// refresh the access-token (1d)
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "🔴 Unauthorized Access");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await UserModel.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "🔴 Invalid refresh-token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "🔴 Refresh-token expired");
    }

    // set options in cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    // accessToken based on _id
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    // update refresh token with new refresh token
    user.refreshToken = newRefreshToken;

    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed ✅"
        )
      );
  } catch (err) {
    console.log(err);
    throw new ApiError(401, "🔴 Invalid refresh-token");
  }
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  verifyEmail,
  resendEmailVerification,
  refreshAccessToken,
};
