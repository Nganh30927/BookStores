import { Metadata } from "next"
import Link from "next/link";
import Product from "@/components/product";

export const metadata: Metadata ={
  title: 'Products Page',
}
// interface IProduct {
//     id?: number;
//     title: string;
//     price: number
//   }
/**
 * Mặc định fetch sẽ được nextjs cache kết quả
 * @returns Mă
 */

const getProducts = async ()=>{
    const res = await fetch(`https://server.aptech.io/online-shop/products`,
        {next: { revalidate: 30}}); //Sau 30 giây thì API này được fetch lại,
    return res.json();
}

type Props = {};

export default async function Products({}: Props) {
  const products = await getProducts();
  return (
    <section data-section-id="1" data-share="" data-category="search-solid" data-component-id="fce12138_02_awz" className="py-10 bg-gray-100">
    <div className="container px-4 mx-auto">
      <div className=" flex flex-wrap -mx-4">
        <div className="w-full lg:w-4/12 xl:w-3/12 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6 md:gap-8 lg:gap-10 lg:max-w-2xs lg:pt-28  lg:pb-9 px-4">
            <div className="hidden lg:block pb-10 lg:border-b border-gray-600">
              <h6 className="font-bold text-black mb-5" data-config-id="auto-txt-2-2">Price</h6>
              <input className="w-full bg-blue-500" type="range" data-config-id="auto-input-1-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600" data-config-id="auto-txt-3-2">$0</span>
                <span className="text-sm font-medium text-gray-600" data-config-id="auto-txt-4-2">$200</span>
              </div>
            </div>
            <div className="hidden lg:block pb-10 lg:border-b border-gray-600">
              <h6 className="font-bold text-black mb-8" data-config-id="auto-txt-5-2">Category</h6>
             
            </div>
           
          </div>
        </div>
        <div className="w-full lg:w-8/12 xl:9/12 px-4">
          <div className="flex flex-col sm:flex-row mb-6 sm:items-center pb-6 border-b border-gray-400  ">
            <div className="mb-3 sm:mb-0 sm:mr-5">
              <div className="relative border border-gray-600">
                <span className="absolute top-1/2 right-0 mr-4 transform -translate-y-1/2" data-config-id="auto-txt-18-2">
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.96967 0.71967C1.26256 0.426777 1.73744 0.426777 2.03033 0.71967L6 4.68934L9.96967 0.71967C10.2626 0.426777 10.7374 0.426777 11.0303 0.71967C11.3232 1.01256 11.3232 1.48744 11.0303 1.78033L6.53033 6.28033C6.23744 6.57322 5.76256 6.57322 5.46967 6.28033L0.96967 1.78033C0.676777 1.48744 0.676777 1.01256 0.96967 0.71967Z" fill="white"></path>
                  </svg>
                </span>
                <select className="relative w-full pl-6 pr-10 py-4 bg-transparent font-medium text-gray-600 outline-none appearance-none" name="" id="" data-config-id="auto-input-7-1">
                  <option value="1">Brand</option>
                  <option value="2">Price</option>
                  <option value="3">Ratings</option>
                  <option value="4">Popularity</option>
                </select>
              </div>
            </div>
            <div className="mb-3 sm:mb-0 sm:mr-5">
              <div className="relative border border-gray-600">
                <span className=" absolute top-1/2 right-0 mr-4 transform -translate-y-1/2" data-config-id="auto-txt-19-2">
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.96967 0.71967C1.26256 0.426777 1.73744 0.426777 2.03033 0.71967L6 4.68934L9.96967 0.71967C10.2626 0.426777 10.7374 0.426777 11.0303 0.71967C11.3232 1.01256 11.3232 1.48744 11.0303 1.78033L6.53033 6.28033C6.23744 6.57322 5.76256 6.57322 5.46967 6.28033L0.96967 1.78033C0.676777 1.48744 0.676777 1.01256 0.96967 0.71967Z" fill="white"></path>
                  </svg>
                </span>
                <select className="relative w-full pl-6 pr-10 py-4 bg-transparent font-medium text-gray-600 outline-none appearance-none" name="" id="" data-config-id="auto-input-7-1">
                  <option value="1">Category</option>
                  <option value="2">Clothes</option>
                  <option value="3">Home</option>
                  <option value="4">Kids</option>
                </select>
              </div>
            </div>
            <div>
              <div className="lg:hidden md:w-80 ml-4">
                <h6 className="font-bold text-black mb-5" data-config-id="auto-txt-2-2">Price</h6>
                <input className="w-full bg-blue-500" type="range" data-config-id="auto-input-1-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600" data-config-id="auto-txt-3-2">$0</span>
                  <span className="text-sm font-medium text-gray-600" data-config-id="auto-txt-4-2">$200</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap mb-20">
              {products.map((product: any) => (
                <Product key={product.id} data={product} />
              ))}
          </div>
          {/* <div className="m-2 p-3">
        {products && products.length < total && (
          <button
            className="btn loadmore"
            onClick={(e) => {
              e.preventDefault();
              setPage(page + 1);
            }}
          >
            {loading ? (
              "Loading ..."
            ) : (
              <>
                {" "}
                Loadmore 
              </>
            )}
          </button>
        )}
      </div> */}
        </div>
      </div>
    </div>
  </section>
  );
}


