import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { RiGoogleFill } from 'react-icons/ri';


const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    address: yup.string().required(),
    contact: yup.string().required(),
    gender: yup.string().required(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;


const SignUpPage = () => {
  
  const navigate = useNavigate();
  const { signup, isAuthenticated, isLoading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data: FormData) => {
    console.log('Form data:', data);
    const result = await signup(data.name, data.email, data.password, data.address, data.contact, data.gender);
    console.log('Signup result:', result);
    if (!result.ok) {
      setError(result.message);
    } else {
      console.log('Navigating to "/"');
      navigate('/');
    }
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/customers");
    }
  }, [isAuthenticated])



  return (
    <>
      <section
        data-section-id="1"
        data-share=""
        data-category="sign-up"
        data-component-id="6c5b97a6_10_awz"
        className="relative pt-6 px-4 lg:px-6 pb-20 md:pb-32 overflow-hidden"
      >
        <div className="relative max-w-7xl pt-12 sm:pt-28 mx-auto">
          <img
            className="absolute top-0 left-0 object-contain"
            src="../../../public/images/background-gradient-color.png"
            alt=""
            data-config-id="auto-img-1-10"
          />
          <div className="relative container px-4 mx-auto">
            <div className="max-w-lg md:max-w-xl py-14 px-6 xs:px-12 lg:px-16 mx-auto bg-white rounded-3xl shadow-lg">
              <h3 className="font-heading text-4xl text-gray-900 font-semibold mb-4" data-config-id="auto-txt-1-10">
                Sign up to your account
              </h3>
              <p className="text-lg text-gray-500 mb-10" data-config-id="auto-txt-2-10">
                Greetings on your return! We kindly request you to enter your details.
              </p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                  <label className="block mb-1.5 text-sm text-gray-900 font-semibold" data-config-id="auto-txt-3-10">
                    Name
                  </label>
                  <input
                    {...register('name')}
                    id="name"
                    name="name"
                    className="w-full py-3 px-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-purple-500 focus:outline-purple rounded-lg"
                    type="text"
                  />
                  {errors.name && <span>{errors.name.message}</span>}
                </div>
                <div className="mb-6">
                  <label className="block mb-1.5 text-sm text-gray-900 font-semibold" data-config-id="auto-txt-4-10">
                    Email
                  </label>
                  <input
                    {...register('email')}
                    id="email"
                    name="email"
                    className="w-full py-3 px-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-purple-500 focus:outline-purple rounded-lg"
                    type="email"
                    data-config-id="auto-input-5-10"
                  />
                  {errors.email && <span>{errors.email.message}</span>}
                </div>
                <div className="mb-6">
                  <label className="block mb-1.5 text-sm text-gray-900 font-semibold" data-config-id="auto-txt-3-10">
                    Contact
                  </label>
                  <input
                    {...register('contact')}
                    id="contact"
                    name="contact"
                    className="w-full py-3 px-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-purple-500 focus:outline-purple rounded-lg"
                    type="number"
                    data-config-id="auto-input-4-10"
                  />
                  {errors.contact && <span>{errors.contact.message}</span>}
                </div>
                <div className="mb-6">
                  <label className="block mb-1.5 text-sm text-gray-900 font-semibold" data-config-id="auto-txt-3-10">
                    Gender
                  </label>
                  <div className="flex justify-between">
                    <div className="w-full lg:w-1/3 flex items-center gap-x-4">
                      <input {...register('gender', { required: true })} className="h-5 w-5" id="genderMale" type="radio" name="gender" value="Male" />
                      <label htmlFor="genderMale">Male</label>
                    </div>

                    <div className="w-full lg:w-1/3 flex items-center gap-x-4">
                      <input
                        {...register('gender', { required: true })}
                        className="h-5 w-5"
                        id="genderFemale"
                        type="radio"
                        name="gender"
                        value="Female"
                      />
                      <label htmlFor="genderFemale">Female</label>
                    </div>
                    <div className="w-full lg:w-1/3 flex items-center gap-x-4">
                      <input
                        {...register('gender', { required: true })}
                        className="h-5 w-5"
                        id="genderOthers"
                        type="radio"
                        name="gender"
                        value="Others"
                      />
                      <label htmlFor="genderOthers">Others</label>
                    </div>
                  </div>
                  {errors.gender && <span>{errors.gender.message}</span>}
                </div>
                <div className="mb-6">
                  <label className="block mb-1.5 text-sm text-gray-900 font-semibold" data-config-id="auto-txt-3-10">
                    Address
                  </label>
                  <input
                    {...register('address')}
                    id="address"
                    name="address"
                    className="w-full py-3 px-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-purple-500 focus:outline-purple rounded-lg"
                    type="text"
                    data-config-id="auto-input-4-10"
                  />
                  {errors.address && <span>{errors.address.message}</span>}
                </div>
                <div className="mb-6">
                  <label className="block mb-1.5 text-sm text-gray-900 font-semibold" data-config-id="auto-txt-5-10">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register('password')}
                      id="password"
                      name="password"
                      className="w-full py-3 px-4 text-sm text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-purple-500 focus:outline-purple rounded-lg"
                      type="password"
                    />
                    {errors.password && <span>{errors.password.message}</span>}
                  </div>
                </div>
                {/* <div className="flex mb-6 items-center">
                  <input type="checkbox" value="" id="" data-config-id="auto-input-7-10"/>
                  <label className="ml-2 text-xs text-gray-800"  data-config-id="auto-txt-6-10">Remember me</label>
                </div> */}
                <button
                  className="relative group block w-full mb-6 py-3 px-5 text-center text-sm font-semibold text-orange-50 bg-orange-600 rounded-full overflow-hidden"
                  type="submit"
                >
                  <div className="absolute top-0 right-full w-full h-full bg-gray-900 transform group-hover:translate-x-full group-hover:scale-102 transition duration-500"></div>
                  <span className="relative" data-config-id="auto-txt-7-10">
                    {isSubmitting ? 'Submitting...' : 'Sign up'}
                  </span>
                </button>
                <a
                  className="inline-flex w-full mb-10 py-3 px-4 items-center justify-center rounded-full border border-gray-200 hover:border-gray-400 transition duration-100"
                  href="#"
                >
                  <span>
                    <RiGoogleFill />
                  </span>
                  <span className="ml-4 text-sm font-semibold text-gray-900" data-config-id="auto-txt-8-10">
                    Login with Google
                  </span>
                </a>
                <div className="text-center">
                  <span className="text-xs font-semibold text-gray-900">
                    <span data-config-id="auto-txt-9-10">Already have an account?</span>
                    <a className="inline-block ml-1 text-orange-500 hover:text-orange-700" href="#" data-config-id="auto-txt-10-10">
                      Sign in
                    </a>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUpPage;
