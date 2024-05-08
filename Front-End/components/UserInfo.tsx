"use client"

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";


const UserInfo = () => {

    const { data: session } = useSession();
    const user = session?.user;

  return (
    <div className="userInfo flex items-center gap-x-2">
        {
            user ? (
                <>
                <Link className="flex gap-x-2" href='/customers/profile'>
                    {user.picture ? (
                        <>
                        <img className="rounded-full" height={30} width={30} src={user?.picture} alt={user?.name} />
                        </>
                    ) : null}  
                    <strong>{user?.name}</strong>
                </Link>
                <button type="button" onClick={() => signOut()}>Logout</button>
                </>
                
            ) : (
                <Link href='/login'>Login</Link>
            )
        }
       
    </div>
  )
}

export default UserInfo