import React from 'react';
import { Helmet } from 'react-helmet';
import config from '../../constants/config';
import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../library/axiosClient';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from 'axios';


import { User } from '../../hooks/useAuth';

// interface IUser {
//   id: number;
//   name: string;
//   address: string;
//   email?: string;
//   gender?: string;
//   contact: string;
//   password?: string;
// }

const CustomerProfile = () => {
  const { user, updateUser } = useAuth();
  const [userState, setUserState] = React.useState<User | null>(user);
  const [loading, setLoading] = React.useState(false);
  const [alert, setAlert] = React.useState<{ type: 'success' | 'warning' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    user && setUserState(user);
  }, [user]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setUserState((prevState: any) => ({ ...prevState, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const pattern = new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g);

    if (!pattern.test(userState?.contact as string) || userState?.name === '') {
      setAlert({ type: 'warning', message: 'Please enter a valid input!' });
    } else {
      try {
        setLoading(true);
        const response = await axiosClient.patch(`/members/${userState?.id}`, userState);

        if (response.status === 200) {
          setAlert({ type: 'success', message: 'Cập nhập thành công!' });
          updateUser(response.data);
        }
      } catch (error) {
        setAlert({ type: 'error', message: 'Something went wrong!' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {alert && <div className={`alert alert-${alert.type}`}>{alert.message}</div>}
      <section className="py-10 bg-white border-2 border-gray-100 lg:w-10/12 md:w-10/12">
        <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl mx-auto ">
          <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
          <div className="grid max-w-2xl mx-auto mt-8 sm:p-5">
            <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
              <img
                className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                alt="Bordered avatar"
              />
            </div>
            <form className="items-center mt-8 sm:mt-14 text-[#202142]" onSubmit={onSubmit}>
              <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                <div className="w-full">
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                    defaultValue={userState?.name}
                    onChange={handleInputChange}
                    name="name"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    className="bg-gray-300 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                    readOnly
                    defaultValue={userState?.email}
                    onChange={handleInputChange}
                    name="email"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center w-full mb-2 space-x-0 space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0 sm:mb-6">
                <div className="w-full">
                  <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                    Phone number
                  </label>
                  <input
                    type="text"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                    defaultValue={userState?.contact}
                    onChange={handleInputChange}
                    name="contact"
                  />
                </div>
                <div className="w-full">
                  <label htmlFor="name_select" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                    Gender
                  </label>
                  <select
                    defaultValue={userState?.gender}
                    onChange={handleInputChange}
                    name="gender"
                    className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5"
                  >
                    <option value="">Select your gender</option>
                    {['Male', 'Female', 'Others'].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-2 sm:mb-6">
                <label htmlFor="profession" className="block mb-2 text-sm font-medium text-indigo-900 dark:text-white">
                  Address
                </label>
                <input
                  type="text"
                  id="profession"
                  className="bg-indigo-50 border border-indigo-300 text-indigo-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 "
                  defaultValue={userState?.address}
                  onChange={handleInputChange}
                  name="address"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="text-white bg-indigo-700  hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerProfile;
