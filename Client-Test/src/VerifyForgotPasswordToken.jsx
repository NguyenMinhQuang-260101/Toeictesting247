import { useEffect, useState } from "react";
import useQueryParams from "./useQueryParams";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VerifyForgotPasswordToken() {
  const [message, setMessage] = useState();
  const { token } = useQueryParams();
  const navigate = useNavigate();
  useEffect(() => {
    const controller = new AbortController();
    if (token) {
      axios
        .post(
          `/users/verify-forgot-password`, // URL xác thực token_forgot_password bên API server
          { forgot_password_token: token },
          {
            baseURL: import.meta.env.VITE_API_URL,
            signal: controller.signal,
          }
        )
        .then(() => {
          // Bên trang reset password cần cái forgot_password_token này để gửi lên API
          // Ở đây chúng ta có 2 cách để trong ResetPassword nhận forgot_password_token này
          // Cách 1: tại đây ta lưu forgot_password_token vào trong localStorage
          // Và bên trang reset password chỉ cần get từ localStorage ra

          // Cách 2: Chúng ta dùng state của React Router để truyền forgot_password_token này qua trang reset password
          navigate("/reset-password", {
            state: { forgot_password_token: token },
          });
        })
        .catch((error) => {
          setMessage(error.response.data.message);
        });
    }
    return () => {
      controller.abort();
    };
  }, [token, navigate]);
  return <div>{message}</div>;
}
