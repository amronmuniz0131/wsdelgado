import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export function SuccessToast(text, onClose, isWithdrawRequest) {
    let temp = text
    if (document.hasFocus()) {
        temp = text
    } else {
        temp = undefined
    }

    toast(temp, {
        style: {
            backgroundColor: '#47B04C',
            color: '#fff',
            boxShadow: '1px 1px 5px 4px rgba(126, 191, 129, 0.54)',
            textAlign: 'center'
        },
        position: "top-right",
        autoClose: isWithdrawRequest ? 3000 : 5000,
        limit: isWithdrawRequest ? 2 : 8,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        closeButton: false,
        pauseOnFocusLoss: false,
        onClose: () => {
            if (onClose) {
                onClose();
            }
        }
    });
}

export function DangerToast(text, onClose, isWithdrawRequest) {
    toast(text, {
        style: {
            backgroundColor: '#D96C78',
            color: '#fff',
            boxShadow: '1px 1px 5px 4px rgba(233, 94, 109, 0.54)',
            textAlign: 'center'
        },
        position: "top-right",
        autoClose: isWithdrawRequest ? 3000 : 5000,
        limit: isWithdrawRequest ? 2 : 8,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        closeButton: false,
        onClose: () => {
            if (onClose) {
                onClose();
            }
        }
    });
}
