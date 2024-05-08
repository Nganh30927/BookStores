import Image from "next/image";

/**
 * Server component
 */
interface IProduct {
  id: number;
  title: string;
  price: number
}


const fetchProductDetail = async (id: string)=>{
  const res =  await fetch(`https://api.escuelajs.co/api/v1/products/${id}`);
  return res.json();
}

// or Dynamic metadata
// Tạo title động theo sản phẩm
export async function generateMetadata({ params }: { params: { id: string } }) {
    const productDetail = await fetchProductDetail(params.id);
    return {
      title: productDetail.title,
    }
  }
  

export default async function Page({params} : {params: {id: string}}) {
    const productDetail = await fetchProductDetail(params.id)

    return(
        <>
            <h1 className="text-3xl font-bold">{productDetail.title}</h1>
            <div>
                <Image height={400} width={400} src={productDetail.images} alt={productDetail.title} />
            </div>
            <strong>
                {productDetail.price}
            </strong>
        </>
    )
}

/**
 * Sinh ra các đường dẫn để chuẩn bị cho quá trình gen URL tĩnh
 * khi đánh lệnh yarn build
 * @returns 
 */
export async function generateStaticParams() {
    const products : IProduct[] = await fetch('https://api.escuelajs.co/api/v1/products').then((res) => res.json())
    
    const shortProducts = products.slice(0,5);
  
  
    return shortProducts.map((product) => ({
      id: product.id.toString(),
    }))
  }