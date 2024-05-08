'use client'

import { useState,useEffect, FormEvent } from "react"
import { signIn, useSession} from "next-auth/react"
import { useRouter } from 'next/navigation'

const LoginForm = ()=>{

  const router = useRouter();
  const { data: session } = useSession();

  /* Nếu login rồi thì bỏ qua */
  useEffect(()=>{
    console.log('useEffect');
    if(session){
      router.push('/')
    }
  },[session,router])

  const [user,setUser] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState({
    accLoading: false,
    googleLoading: false,
    facebookLoading: false
  });
 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>)=>{
    e.preventDefault();//ngăn form re-fresh page
    console.log(user);

    setLoading({
      ...loading,
      accLoading: true,
    });

    const res = await signIn('credentials', {
      redirect: false,
      email: user.email,
      password: user.password,
      callbackUrl: '/'
    });

    console.log(res);
    if(res && res.ok){
      setLoading({
        ...loading,
        accLoading: false,
      });
      //Nếu login thành công, chuyển hướng đến trang chủ
      router.push('/')
    }else{
      setLoading({
        ...loading,
        accLoading: false,
      });
    }
  }
  const [error, setError] = useState('');
  const callbackUrl =  '/customers';
 

  const handleLoginProvider = async (provider: string) => {
    try {
      setLoading({
        ...loading,
        googleLoading: provider === 'google',
        facebookLoading: provider === 'facebook'
      });
      const res = await signIn(provider, {redirect: false,callbackUrl});
      console.log('handleLoginProvider',res);
      //TODO: add new usser Account after then login Provider
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError('invalid email or password');
      }
  } catch (error: any) {
    setLoading({
      ...loading,
      googleLoading: false,
      facebookLoading: false
    });
    setError(error);
  }
}

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-y-1 mx-auto max-w-sm">
      <input onChange={(e)=>{
        setUser(prev => {
          return {...prev, email: e.target.value}
        })
      }} value={user.email}  placeholder="Enter your email" className="border rounded py-2 px-2" type="email" name='email' />
      <input onChange={(e)=>{
        setUser(prev => {
          return {...prev, password: e.target.value}
        })
      }} value={user.password} placeholder="Enter your password" className="border rounded py-2 px-2" type="password" name='password' />
      <button className="bg-indigo-500 text-white py-2 px-2 rounded" 
      type="submit"
      disabled={loading.accLoading}
      >
         {loading.accLoading ? 'loading...' : 'Sign In'}
        </button>
        <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
        <p className="text-center mx-4 mb-0">OR</p>
      </div>
      <div className="flex flex-col gap-y-2">
        <button  type='button' className="border rounded w-full py-2 px-3" onClick={() => handleLoginProvider('google')} role="button">
       Continue with Google
        </button>
       
      </div>
    </form>
  )
}

export default LoginForm