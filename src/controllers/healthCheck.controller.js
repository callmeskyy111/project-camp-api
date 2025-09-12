import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

// export function healthCheck(_, res) {
//   try {
//     res
//       .status(200)
//       .json(new ApiResponse(200, { message: "Server is running.. ✅" }));
//   } catch (err) {
//     console.log(err.message);
//   }
// }

//! Alternate way - with asyncHanlder() HOF and no more try/catch

export const healthCheck = asyncHandler(async (_, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, { message: "Server is running.. ✅" }));
});
