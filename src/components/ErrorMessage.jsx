
import { AlertCircle} from 'lucide-react';

function ErrorMessage({error}) {
  // get the message from the error
  // if the message or the error is null or undefined, then use a generic error message
  let message = error?.message ?? error ?? 'Something went wrong';
  // change message to lower case
  const testMessage = message.toLowerCase();

  // if the message includes 'email' and 'does not exist'
  if (testMessage.includes('email') && testMessage.includes('does not exist') ) {
    message = "Account with given Email does not exist.";
  }

  // if the message includes 'invalid password'
  if (testMessage.includes('invalid password')) {
    message = "Incorrect Password.";
  }
  
  // if the message includes 'required'
  if (testMessage.includes('required')) {
    message = "This field is required.";
  }
  
  // if the message includes '@' and 'already exist'
  if (testMessage.includes('@') && testMessage.includes('already exist')) {
    message = "An account with that email already exists.";
  }

  // return the error message container
  return (
    <div className="validation error">
      <AlertCircle size={20} />
      <span className="text-xsmall font-bold center">{message}</span>
    </div>
  );
}

export default ErrorMessage;

