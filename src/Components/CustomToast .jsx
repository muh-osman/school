// API
import { useResendEmailApi } from "../API/useResendEmailApi";

const CustomToast = ({ closeToast }) => {
  const { mutate } = useResendEmailApi();

  return (
    <>
      <style>
        {`
            .resendButton {
              border: none;
              background-color: transparent;
              color: #0d6efd;
              cursor: pointer;
              font-size: 16px;
            }
            .resendButton:hover {
              color: #0b5ed7;
            }
          `}
      </style>

      <div>
        Please&nbsp;
        <button
          className="resendButton"
          onClick={() => {
            mutate();
            closeToast();
          }}
        >
          request
        </button>
        &nbsp;a verification email to confirm your account.
      </div>
    </>
  );
};

export default CustomToast;
