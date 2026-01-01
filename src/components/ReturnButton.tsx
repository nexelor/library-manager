import { useNavigationHelpers } from "../helper/useNavigationHelper";

export default function ReturnButton() {
    const { goBack } = useNavigationHelpers();

    return (
        <div>
            <button onClick={goBack}>
                ← Return to the Previous Page
            </button>
        </div>
    );
}