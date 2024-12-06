import { registerUser } from "../../lib/action";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../../firebase-client";

function RegisterPage() {
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.target);
      const email = formData.get('email');
      const password = formData.get('password');
      const confirmPassword = formData.get('confirmPassword');

      const result = await registerUser(email, password, confirmPassword);
      if (result.success) {
        setMessage('Registration successful');
        setErrors({});
        navigate('/confirm');

      } else if (result.errors) {
        setErrors(result.errors);
        if (result.message) {
          setMessage(result.message);
        }

      } else {
        setMessage(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-shade-500">
      <div className="w-[448px] h-fit p-[30px] bg-shade-400 rounded-[10px]">
        <form onSubmit={handleSubmit} className="mx-3 text-text text-[16px]">
          <div className="text-[32px] font-bold text-primary-tint-300">Register</div>
          <div className="flex flex-col">
            <label className="mt-[24px] font-bold">Email</label>
            <input id="email" name="email" type="text" className=" border-0 mt-[10px] px-[12px] py-[8px] bg-shade-300 placeholder-text placeholder:italic rounded-[5px] focus:ring-0" placeholder="example@domain.com" />
          </div>
          {errors.email &&
            errors.email.map((error) => (
              <p className="error mt-[4px] text-[14px] text-error italic" key={error}>
                ** {error}
              </p>))}
          <div className="flex flex-col">
            <label className="mt-[24px] font-bold">Password</label>
            <input id="password" name="password" type="password" className="border-0 mt-[10px] px-[12px] py-[8px] bg-shade-300 placeholder-text italic rounded-[5px] focus:ring-0" placeholder="Must have at least 8 characters" />
            {errors.password && <p className="error mt-[4px] text-[14px] text-error italic">** {errors.password}</p>}
          </div>

          <div className="flex flex-col">
            <div className="flex flex-col">
              <label className="mt-[24px] font-bold">Re-enter Password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" className="border-0 mt-[10px] px-[12px] py-[8px] bg-shade-300 placeholder-text italic rounded-[5px] focus:ring-0" placeholder="Re-enter Password" />
            </div>
            <div className="flex justify-between mt-[4px]">
              <div className="">
                {errors.confirmPassword &&
                  errors.confirmPassword.map((error) => (
                    <p className="error text-[14px] text-error italic" key={error}>
                      ** {error}
                    </p>
                  ))}
              </div>
              <div className="text-[14px] italic">Have an account? <a className="text-primary-tint-400 underline" href="/login">Click here!</a></div>
            </div>
          </div>

          <button disabled={loading} className={`flex justify-center gap-[4px] mt-[24px] w-full h-fit py-[8px] bg-primary-tint-300 text-white rounded-[5px] fs-6 duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <span>{loading ? 'Registering...' : 'Register'}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </button>
          {/* {message && <p>{message}</p>} */}
        </form>
      </div>
    </div>
  )
}

export default RegisterPage;
