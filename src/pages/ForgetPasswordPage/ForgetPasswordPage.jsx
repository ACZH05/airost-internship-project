import { useState } from "react";
import { sendResetPasswordEmail } from "../../lib/action";

function ForgetPasswordPage() {
  const [message, setMessage] = useState(''); 
  const [errors, setErrors] = useState({});
  
  const handleSubmit = async (event) => { 
    event.preventDefault(); 

    const formData = new FormData(event.target);
    const email = formData.get('email');

    const result = await sendResetPasswordEmail(email); 
    setMessage(result.message);

    if (result.errors) {
      setErrors(result.errors);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-shade-500">
      <div className="w-fit h-fit p-[30px] bg-shade-400 rounded-[10px]">
        
        <form onSubmit={handleSubmit} className="mx-3 text-text text-[16px]">
            <div className="text-[32px] font-bold text-primary-tint-300">Reset your password</div>
            <div className="text-[16px] mt-8 max-w-[380px]">Please provide the email address that you used when you signed up for your account.</div>
          
          <div className="flex flex-col">
              <label className="mt-8 font-bold">Email</label>
              <input id="email" name="email" type="text" className="border-0 mt-[10px] px-[12px] py-[8px] bg-shade-300 placeholder-text placeholder:italic rounded-[5px] focus:ring-0" placeholder="example@domain.com" />
          </div>

          { errors.email && 
            errors.email.map((error) => (
              <p className="error mt-[4px] text-[14px] text-error italic" key={error}>
                ** {error}
              </p> 
            ))
          }
            
            <div className="text-[16px] mt-8 max-w-[380px]">We will send you an email that will allow you to reset your password.</div>

          <button type="submit" className="flex justify-center mt-8 w-full h-fit py-[8px] bg-primary-tint-300 text-white rounded-[5px] fs-6 duration-200">Submit</button>
          
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  )
}

export default ForgetPasswordPage;
