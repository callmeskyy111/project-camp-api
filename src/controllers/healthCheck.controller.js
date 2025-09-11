import { ApiResponse } from "../utils/api-response.js";

export function healthCheck(req, res) {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running.. ✅" }));
  } catch (err) {
    console.log(err.message);
  }
}
