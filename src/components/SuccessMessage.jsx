
import { CheckCircle } from 'lucide-react';

function SuccessMessage({message}) {
    if (!message || message === '') {
        message = 'Something Succeeded'
    }
    // return the success message container
    return (
        <div className="validation success">
        <CheckCircle size={20} />
        <span className="text-xsmall font-bold center">{message}</span>
        </div>
    );
}

export default SuccessMessage;

