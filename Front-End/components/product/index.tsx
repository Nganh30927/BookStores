import React from 'react';

type Props = {
    data: any;
};

export default function Product({ data }: Props) {
    return (

        <div className='w-full sm:w-1/2 xl:w-1/3'>
            <div className="block p-5 border border-gray-400 hover:border-yellow-500 ">
            <img className="block w-full h-80 mb-8 object-cover transition-all group-hover:scale-105" src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' alt='Product Image' />
            <div className="">

                <h6 className="font-bold text-black mt-2 mb-5" data-config-id="auto-txt-2-9">{data?.name}</h6>

                <div className="flex justify-between items-center mb-3">
                    <div>
                        <span className="font-bold text-black" data-config-id="auto-txt-1-9">${data?.price}</span>
                        <del className="ms-2 font-semibold text-red-600">{data?.description}</del>
                    </div>
                    <div className="w-12 h-12  text-sky-500 hover:bg-sky-600 hover:text-white rounded-3xl border border-sky-500 flex items-center justify-center">
                    </div>
                </div>
            </div>
        </div>
        </div>


    )
}