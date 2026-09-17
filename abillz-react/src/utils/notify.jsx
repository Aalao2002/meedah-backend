import { toast } from 'react-toastify';

const showError = (message) => {
    toast.error(message, {
    position: "top-right",
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    autoClose: 5000,
});
}
export default showError;