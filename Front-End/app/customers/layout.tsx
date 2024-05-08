'use client'
import Link from "next/link"
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  const { data: session } = useSession();
  const router = useRouter();
  /* Nếu chưa login thì bắt đi login */
  useEffect(()=>{
    console.log('useEffect');
    if(!session){
      router.push('/login')
    }
  },[session,router])

  return (
    <div className="grid grid-cols-12">
          <div className="col-span-4">
            <ul>
              <li><Link href='/customers'>Dashboard</Link></li>
              <li><Link href='/customers/orders'>Danh sách đơn hàng</Link></li>
              <li><Link href='/customers/profile'>Thông tin cá nhân</Link></li>
            </ul>
          </div>
          <div className="col-span-8">
            {children}
          </div>
      </div>
  )
}