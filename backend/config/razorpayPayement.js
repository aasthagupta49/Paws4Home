import Razorpay from 'razorpay';

const api_key="rzp_test_dvw3fzIoIa32de";
const api_Secret_key="iXVWr0YCqX8gnOUSy9Nn5Qk7";

export const razorpay = new Razorpay({
  key_id:api_key,
  key_secret:api_Secret_key,
})